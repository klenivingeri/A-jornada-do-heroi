
import { useState, useEffect, useRef } from 'react'
import { HeroContainer } from './components/HeroContainer/HeroContainer';
import { Board } from './components/Board/Board';
import { commandMatch } from './util/commandMatch';
import { normalizeText } from './util/normalizeText';
import { readSimpleCommand } from './util/speechReader';
import SpeechListener from './components/SpeechListener/SpeechListener';

const initItem =
{
  title: 'Poção',
  value: 2,
  type: 'potion',
  content: 'This is the second dungeon card.',
  id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707',
  uri: "https://i.etsystatic.com/31046540/r/il/02f3d4/4024103472/il_340x270.4024103472_nazj.jpg",
  auto: {
    slot: true,
  },
  isUse: false
}

const initHero = {
  slot: [],
  hero: {
    title: 'Herói',
    value: 13,
    maxValue: 13,
    actions: ['avancar'],
    type: 'heroi',
    description: 'This is the second dungeon card.',
    id: 'fb4fce46-b49d-4e3e-84cf-6bd13c382222',
    uri: "https://img.freepik.com/fotos-premium/vista-frontal-do-capacete-de-cavaleiro-medieval-isolado-no-fundo-preto-criado-com-ia-generativa_916303-1693.jpg"
  }
  ,
  bag: [],
  skill: [], // sempre que o heroi morrer ou estiver com carta de ataque no slot, ou carta de defesa no slot, deve ser verificao se existe algum efeito pra ser aplicado
  gold: 0,
}

function Game({ deck, openModal, setIsDead }) {
  const [deckState, setDeckState] = useState(() => deck);
  const [dungeonCards, setDungeonCards] = useState(() => [initItem])
  const [dungeonHero, setDungeonHero] = useState(() => initHero)
  const [selectCardID, setSelectCardID] = useState(() => (''))
  const [selectHeroID, setSelectHeroID] = useState(() => (''))
  const [command, setCommand] = useState("")
  // Referência para o áudio do heartbeat
  const heartbeatAudioRef = useRef(null)

  // Referência para armazenar o valor anterior do herói
  const prevHeroValueRef = useRef(dungeonHero.hero.value)

  // Função para tocar sons de efeito
  const playSound = (soundFile, volume = 0.5, useFadeOut = true) => {
    console.log('Tocando som:', soundFile, 'volume:', volume);
    // Se o arquivo não tem extensão, adiciona .mp3 por padrão
    const fileName = soundFile.includes('.') ? soundFile : `${soundFile}.mp3`;
    console.log('Arquivo completo:', `/assets/effect/${fileName}`);
    const audio = new Audio(`/assets/effect/${fileName}`);

    // Define o volume inicial (respeitando o valor passado)
    audio.volume = volume;

    audio.play().catch(err => console.log('Erro ao reproduzir som:', err));

    // Se useFadeOut for false, apenas reproduz o som sem efeitos
    if (!useFadeOut) {
      return;
    }

    // Fade out: diminui o volume gradualmente até 0
    const fadeOutDuration = 1000; // duração máxima de 0.8 segundos
    const fadeOutInterval = 50; // atualiza a cada 50ms
    const steps = fadeOutDuration / fadeOutInterval;
    const volumeDecrement = volume / steps;

    let currentVolume = volume;
    const fadeOut = setInterval(() => {
      currentVolume -= volumeDecrement;
      if (currentVolume <= 0) {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeOut);
      } else {
        audio.volume = currentVolume;
      }
    }, fadeOutInterval);

    // Garante que o áudio seja pausado após 0.8 segundos
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fadeOut);
    }, fadeOutDuration);
  }

  // Função para verificar e aplicar revive
  const checkRevive = (nextHero) => {
    // Procura por uma skill com efeito de revive e sequencial > 0
    const reviveSkillIndex = nextHero.skill.findIndex(
      skill => skill.effect === 'revive' && skill.sequencial > 0
    )

    if (reviveSkillIndex !== -1) {
      const reviveSkill = nextHero.skill[reviveSkillIndex]

      // Revive o herói com o value da skill
      nextHero.hero.value = reviveSkill.value
      nextHero.isDead = false

      // Reduz o sequencial em 1
      const updatedSkill = {
        ...reviveSkill,
        sequencial: reviveSkill.sequencial - 1,
        isUse: true
      }

      // Se sequencial chegou a 0, remove a skill
      if (updatedSkill.sequencial <= 0) {
        nextHero.skill = nextHero.skill.filter((_, index) => index !== reviveSkillIndex)
      } else {
        // Atualiza a skill com o novo sequencial
        nextHero.skill[reviveSkillIndex] = updatedSkill
      }

      // Toca o som da skill de revive
      if (reviveSkill.song) {
        playSound(reviveSkill.song, reviveSkill.songVolume || 0.5)
      }
    }
  }

  useEffect(() => {
    const activeCards = dungeonCards.filter((card) => card.title)
    const countCard = activeCards.length

    if (countCard <= 1 && deckState.length > 0) {
      playSound('frap_card', 0.5, false)
      const newCards = deckState.slice(0, 3)
      setDungeonCards([...newCards, ...activeCards])
      setDeckState(deckState.slice(3))

      // Novo turno: remove items consumidos do slot e da bag
      setDungeonHero(prevHero => ({
        ...prevHero,
        slot: prevHero.slot.filter(card => !card.isUse),
        bag: prevHero.bag.filter(card => !card.isUse)
      }))
    }
  }, [dungeonCards, deckState]);

  // Efeito para tocar heartbeat quando a vida está baixa
  useEffect(() => {
    const heroValue = dungeonHero.hero.value

    // Se a vida está abaixo de 6, toca o heartbeat
    if (heroValue > 0 && heroValue < 6) {
      // Se o áudio ainda não foi criado, cria
      if (!heartbeatAudioRef.current) {
        const audio = new Audio('/assets/effect/heartbeat.mp3')
        audio.loop = true
        heartbeatAudioRef.current = audio
      }

      const audio = heartbeatAudioRef.current

      // Calcula volume e velocidade baseado na vida
      // Quanto menor a vida, mais alto e mais rápido
      // value 5: volume 0.3, rate 1.0
      // value 1: volume 0.7, rate 2.0
      const volumeBase = 0.3
      const volumeIncrement = (6 - heroValue) * 0.1 // 0.1 por ponto de vida perdido
      const volume = Math.min(volumeBase + volumeIncrement, 0.8)

      const rateBase = 1.0
      const rateIncrement = (6 - heroValue) * 0.25 // 0.25 por ponto de vida perdido
      const playbackRate = Math.min(rateBase + rateIncrement, 2.5)

      audio.volume = volume
      audio.playbackRate = playbackRate

      // Toca o áudio se não estiver tocando
      if (audio.paused) {
        audio.play().catch(err => console.log('Erro ao reproduzir heartbeat:', err))
      }
    } else {
      // Para o áudio se a vida está OK ou herói morreu
      if (heartbeatAudioRef.current && !heartbeatAudioRef.current.paused) {
        heartbeatAudioRef.current.pause()
        heartbeatAudioRef.current.currentTime = 0
      }
    }

    // Cleanup: para o áudio quando o componente desmontar
    return () => {
      if (heartbeatAudioRef.current) {
        heartbeatAudioRef.current.pause()
        heartbeatAudioRef.current.currentTime = 0
      }
    }
  }, [dungeonHero.hero.value])

  // Efeito para tocar som quando o herói recebe dano
  useEffect(() => {
    const currentValue = dungeonHero.hero.value
    const prevValue = prevHeroValueRef.current

    // Se o valor diminuiu, toca o som de hit
    if (currentValue < prevValue && currentValue > 0) {
      playSound('hero_hit', 0.6, false)
    }

    // Atualiza o valor anterior
    prevHeroValueRef.current = currentValue
  }, [dungeonHero.hero.value])

  useEffect(() => {
    if (!openModal) {
      const [actiont, ...text] = command.split(" ")
      const restComand = text.join(" ")
      let heroChanged = false

      if (commandMatch(actiont, ["compra", "guarda", "descar", "discar"])) {

        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        const restDungeonCards = dungeonCards.map((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = selectCardID
            ? card.id === selectCardID
            : commandMatch(restComand, [infoCard])

          if (shouldProcessCard) {
            if (commandMatch(actiont, ["guarda"]) && nextHero.bag.length < 1) {
              const cardWithUseFlag = { ...card, isUse: false }

              // Auto-consumo para gold na bag
              if (card.type === 'gold' && card.auto?.bag) {
                nextHero.gold = nextHero.gold + card.value
                cardWithUseFlag.isUse = true
              }

              nextHero.bag.push(cardWithUseFlag)
              heroChanged = true
              setSelectCardID(null)
              playSound('equip')
              return {}
            }
            if (commandMatch(actiont, ["descar", "discar"])) {

              heroChanged = true
              setSelectCardID(null)
              return {}
            }
            if (commandMatch(actiont, ["compra"]) && nextHero.slot.length < 2) {
              const cardWithUseFlag = { ...card, isUse: false }

              // Auto-consumo para poção no slot
              if (card.type === 'potion' && card.auto?.slot) {
                nextHero.hero.value = Math.min(nextHero.hero.value + card.value, nextHero.hero.maxValue)
                cardWithUseFlag.isUse = true
              }

              // Auto-consumo para gold no slot
              if (card.type === 'gold' && card.auto?.slot) {
                nextHero.gold = nextHero.gold + card.value
                cardWithUseFlag.isUse = true
              }

              nextHero.slot.push(cardWithUseFlag)
              heroChanged = true
              setSelectCardID(null)

              playSound('buy')
              playSound('equip')

              // Se o card não possui auto, seleciona ele automaticamente
              // if (!card.auto) {
              //   setSelectHeroID(card.id)
              // }

              return {}
            }
          }
          return card
        })

        if (heroChanged) {
          setDungeonHero(nextHero)
        }

        setDungeonCards(restDungeonCards)
      }

      if (commandMatch(actiont, ["pega", "vende"])) {
        let heroChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        // Processa cards da bag do herói
        nextHero.bag = nextHero.bag.filter((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard])

          if (shouldProcessCard) {
            if (commandMatch(actiont, ["vende"])) {
              nextHero.gold = nextHero.gold + card.value
              heroChanged = true
              setSelectHeroID(null)
              return false // Remove da bag
            }
            if (commandMatch(actiont, ["pega"]) && nextHero.slot.length < 2) {
              const cardWithUseFlag = { ...card, isUse: card.isUse || false }

              // Auto-consumo para poção no slot
              if (card.type === 'potion' && card.auto?.slot && !card.isUse) {
                nextHero.hero.value = Math.min(nextHero.hero.value + card.value, nextHero.hero.maxValue)
                cardWithUseFlag.isUse = true
              }

              // Auto-consumo para gold no slot
              if (card.type === 'gold' && card.auto?.slot && !card.isUse) {
                nextHero.gold = nextHero.gold + card.value
                cardWithUseFlag.isUse = true
              }

              nextHero.slot.push(cardWithUseFlag)
              heroChanged = true
              setSelectHeroID(null)
              playSound('equip')

              // Se o card não possui auto, seleciona ele automaticamente
              // if (!card.auto) {
              //   setSelectHeroID(card.id)
              // }

              return false // Remove da bag
            }
          }
          return true // Mantém na bag
        })

        if (heroChanged) {
          setDungeonHero(nextHero)
        }
      }

      if (commandMatch(actiont, ["usa"])) {
        let heroChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        // Verifica se há 2 ou mais cartas de skill no slot sem seleção específica
        const skillCardsInSlot = nextHero.slot.filter(card => card.type === 'skill')
        if (skillCardsInSlot.length >= 2 && !selectHeroID && !restComand) {
          readSimpleCommand('você possui itens iguais selecione uma mão')
          setCommand("")
          return
        }

        // Se selectCardID está definido e há apenas uma carta no slot, usa automaticamente
        // Ou se há apenas uma carta no slot e ela é do tipo skill, usa automaticamente
        const shouldAutoUse = (selectCardID && nextHero.slot.length === 1) ||
          (nextHero.slot.length === 1 && nextHero.slot[0].type === 'skill')

        // Primeiro, encontra a carta que será usada
        let cardToUse = null
        let cardToUseIndex = -1

        nextHero.slot.forEach((card, index) => {
          if (cardToUse) return // Já encontrou

          const infoCard = `${normalizeText(card.title)} ${card.value}`
          const shouldProcessCard = shouldAutoUse || (selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard]))

          if (shouldProcessCard) {
            cardToUse = card
            cardToUseIndex = index
          }
        })

        // Se encontrou uma carta para usar, processa ela
        if (cardToUse) {
          // Se a carta tem effect de attack ou defense, tenta aplicar em outra carta
          if (cardToUse.effect === 'attack' || cardToUse.effect === 'defense') {
            const targetType = cardToUse.effect // 'attack' ou 'defense'
            let applied = false

            // Procura no slot por carta do tipo correspondente (excluindo a própria)
            for (let i = 0; i < nextHero.slot.length; i++) {
              if (i !== cardToUseIndex && nextHero.slot[i].type === targetType) {
                nextHero.slot[i] = {
                  ...nextHero.slot[i],
                  value: nextHero.slot[i].value + cardToUse.value
                }
                applied = true
                heroChanged = true

                // Toca som se existir
                if (cardToUse.song) {
                  playSound('anvil-hit', 0.5)
                }
                break
              }
            }

            // Se não encontrou no slot, procura na bag
            if (!applied) {
              for (let i = 0; i < nextHero.bag.length; i++) {
                if (nextHero.bag[i].type === targetType) {
                  nextHero.bag[i] = {
                    ...nextHero.bag[i],
                    value: nextHero.bag[i].value + cardToUse.value
                  }
                  applied = true
                  heroChanged = true

                  // Toca som se existir
                  if (cardToUse.song) {
                    playSound(cardToUse.song, cardToUse.songVolume || 0.5)
                  }
                  break
                }
              }
            }

            // Remove a carta usada do slot
            nextHero.slot = nextHero.slot.filter((_, index) => index !== cardToUseIndex)
            setSelectHeroID(null)

          } else {
            // Para outros tipos de carta, comportamento normal (vai para skill)
            nextHero.skill.push(cardToUse)
            nextHero.slot = nextHero.slot.filter((_, index) => index !== cardToUseIndex)
            heroChanged = true
            setSelectHeroID(null)
          }
        }

        if (heroChanged) {
          setDungeonHero(nextHero)
        }
      }

      if (commandMatch(actiont, ["avanca"])) {
        let heroChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        // Processa cards da dungeon para combate
        const restDungeonCards = dungeonCards.map((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = selectCardID
            ? card.id === selectCardID
            : commandMatch(restComand, [infoCard])

          if (shouldProcessCard && card.type === 'enemy') {
            // Diminui o valor do herói pelo valor do inimigo
            nextHero.hero.value = nextHero.hero.value - card.value

            // Verifica se o herói morreu
            if (nextHero.hero.value <= 0) {
              // Verifica e aplica revive se disponível
              checkRevive(nextHero)

              // Se ainda está morto após tentar revive, marca como morto
              if (nextHero.hero.value <= 0) {
                nextHero.isDead = true
                setIsDead(true)
              }
            }

            // Converte o valor do enemy em gold
            nextHero.gold = nextHero.gold + card.value
            heroChanged = true
            setSelectCardID(null)

            // Toca o som do enemy se existir
            if (card.song) {
              playSound(card.song, card.songVolume || 0.5)
            }
            playSound('punch', 0.5)

            return {} // Destrói o card (retorna objeto vazio)
          }
          return card
        })

        if (heroChanged) {
          setDungeonHero(nextHero)
          setDungeonCards(restDungeonCards)
        }
      }

      if (commandMatch(actiont, ["ataque", "atacar"])) {
        let heroChanged = false
        let dungeonChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        // Se selectCardID está definido, verifica se há apenas uma carta de ataque no slot
        const attackCards = nextHero.slot.filter(c => c.type === 'attack')

        // Verifica se há 2 cartas de ataque sem seleção específica
        if (attackCards.length === 2 && !selectHeroID && !restComand) {
          readSimpleCommand('você possui itens iguais selecione uma mauo')
          setCommand("")
          return
        }

        const shouldAutoAttack = selectCardID && attackCards.length === 1 && !selectHeroID && !restComand

        // Processa cards do slot do herói para usar carta de ataque
        let attackCard = null
        nextHero.slot = nextHero.slot.filter((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = (shouldAutoAttack && card.type === 'attack') || (selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard]))

          if (shouldProcessCard && card.type === 'attack') {
            attackCard = card
            heroChanged = true
            setSelectHeroID(null)
            return false // Remove a carta de ataque do slot
          }
          return true // Mantém no slot
        })

        // Se encontrou carta de ataque, processa o ataque no inimigo
        if (attackCard) {
          const restDungeonCards = dungeonCards.map((card) => {
            const infoCard = `${normalizeText(card.title)} ${card.value}`

            // Verifica se deve usar o ID do card selecionado ou o comando de texto
            const shouldProcessCard = selectCardID
              ? card.id === selectCardID
              : commandMatch(restComand, [infoCard])

            if (shouldProcessCard && card.type === 'enemy') {
              // Diminui o valor do inimigo pelo valor da carta de ataque
              const newEnemyValue = card.value - attackCard.value
              dungeonChanged = true
              setSelectCardID(null)

              // Se o inimigo foi destruído (value <= 0)
              if (newEnemyValue <= 0) {
                // Converte o valor do enemy em gold
                nextHero.gold = nextHero.gold + card.value
                // Toca o som do enemy se existir
                if (card.song) {
                  playSound(card.song, card.songVolume || 0.5)
                }
                playSound('attack', card.songVolume || 0.5)
                return {} // Destrói o card do inimigo
              }

              // Inimigo sobreviveu, mas com value reduzido
              return { ...card, value: newEnemyValue }
            }
            return card
          })

          if (dungeonChanged) {
            setDungeonCards(restDungeonCards)
          }
        }

        if (heroChanged) {
          setDungeonHero(nextHero)
        }
      }

      if (commandMatch(actiont, ["defesa", "defender", "defende", "escudo"])) {
        let heroChanged = false
        let dungeonChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill],
          hero: { ...dungeonHero.hero }
        }

        // Se selectCardID está definido, verifica se há apenas uma carta de defesa no slot
        const defenseCards = nextHero.slot.filter(c => c.type === 'defense')

        // Verifica se há 2 cartas de defesa sem seleção específica
        if (defenseCards.length === 2 && !selectHeroID && !restComand) {
          readSimpleCommand('você possui itens iguais selecione uma mão')
          setCommand("")
          return
        }

        const shouldAutoDefend = selectCardID && defenseCards.length === 1 && !selectHeroID && !restComand

        // Processa cards do slot do herói para usar carta de defesa
        let defenseCard = null
        let defenseCardIndex = -1

        nextHero.slot.forEach((card, index) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = (shouldAutoDefend && card.type === 'defense') || (selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard]))

          if (shouldProcessCard && card.type === 'defense' && defenseCard === null) {
            defenseCard = card
            defenseCardIndex = index
            heroChanged = true
            setSelectHeroID(null)
          }
        })

        // Se encontrou carta de defesa, processa a defesa contra o inimigo
        if (defenseCard) {
          const restDungeonCards = dungeonCards.map((card) => {
            const infoCard = `${normalizeText(card.title)} ${card.value}`

            // Verifica se deve usar o ID do card selecionado ou o comando de texto
            const shouldProcessCard = selectCardID
              ? card.id === selectCardID
              : commandMatch(restComand, [infoCard])

            if (shouldProcessCard && card.type === 'enemy') {
              dungeonChanged = true
              setSelectCardID(null)

              const enemyDamage = card.value
              const defenseValue = defenseCard.value

              // Se o dano do inimigo é maior que a defesa
              if (enemyDamage > defenseValue) {
                // O escudo absorve o que pode e é destruído
                const remainingDamage = enemyDamage - defenseValue
                nextHero.hero.value = Math.max(0, nextHero.hero.value - remainingDamage)

                // Verifica se o herói morreu
                if (nextHero.hero.value <= 0) {
                  // Verifica e aplica revive se disponível
                  checkRevive(nextHero)

                  // Se ainda está morto após tentar revive, marca como morto
                  if (nextHero.hero.value <= 0) {
                    nextHero.isDead = true
                    setIsDead(true)
                  }
                }

                // Remove a carta de defesa do slot
                nextHero.slot = nextHero.slot.filter((_, index) => index !== defenseCardIndex)
              } else {
                // O escudo absorve todo o dano e só perde value
                defenseCard.value = defenseValue - enemyDamage

                // Se o escudo zerou, remove do slot
                if (defenseCard.value <= 0) {
                  nextHero.slot = nextHero.slot.filter((_, index) => index !== defenseCardIndex)
                } else {
                  // Atualiza o value do escudo no slot
                  nextHero.slot[defenseCardIndex] = { ...defenseCard }
                }
              }
              playSound('shield')

              // Converte o valor do enemy em gold
              nextHero.gold = nextHero.gold + card.value

              // Toca o som do enemy se existir
              if (card.song) {
                playSound(card.song, card.songVolume || 0.5)
              }

              // Inimigo é sempre destruído após o ataque
              return {}
            }
            return card
          })

          if (dungeonChanged) {
            setDungeonCards(restDungeonCards)
          }
        }

        if (heroChanged) {
          setDungeonHero(nextHero)
        }
      }

      if (commandMatch(actiont, ["comand", 'command'])){
        readSimpleCommand(`
          você pode usar os seguintes comandos: 
          comprar: adiciona na mão, 
          guardar: adiciona na bolsa, 
          descartar: joga do fora, 
          pegar: pega da bolsa,
          vender: ganha ouro, 
          usar: aplica habilidade no Herói, arma ou escudo,
          avançar: usa o Héroi pra atacar o inimigo,
          atacar: usar a carta de ataque pra atacar,
          defesa: usa carta de defesa pra defender do inimigo`)
      }
      setCommand("") // Limpa o comando após executar
    }
  }, [command, openModal, dungeonCards, dungeonHero, selectCardID, setCommand])

  const handlerCardClick = (text) => {
    readSimpleCommand(text)
  }

  return (
    <>
      <div aria-hidden="true" style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
          }}>
          </div>
          <Board
            dungeonCards={dungeonCards}
            setSelectCardID={setSelectCardID}
          />
        </div>
        <div style={{
          display: 'flex',
          height: '100%'
        }} >
          <div
            aria-hidden="true"
            style={{
              color: 'white',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '5px'
            }}
            onClick={() => handlerCardClick(`restam ${deckState.length} cartas no deck`)}
          ><p>🎴</p><p>{deckState.length}</p></div>
          <SpeechListener setCommand={setCommand} />
          <div
            aria-hidden="true"
            style={{
              color: 'white',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '5px'
            }}
            onClick={() => handlerCardClick(`${dungeonHero.gold} de ouro`)}
          ><p>🪙</p><p>{dungeonHero.gold}</p>
          </div></div>
        <HeroContainer
          dungeonHero={dungeonHero}
          setSelectHeroID={setSelectHeroID}
        />
      </div>
    </>
  )
}

export default Game
