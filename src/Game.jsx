
import { useState, useEffect } from 'react'
import { HeroContainer } from './components/HeroContainer/HeroContainer';
import { Board } from './components/Board/Board';
import { commandMatch } from './util/commandMatch';
import { normalizeText } from './util/normalizeText';
import { readSimpleCommand } from './util/speechReader';

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

function Game({ deck, command, setCommand, openModal }) {
  const [deckState, setDeckState] = useState(() => deck);
  const [dungeonCards, setDungeonCards] = useState(() => [initItem])
  const [dungeonHero, setDungeonHero] = useState(() => initHero)
  const [selectCardID, setSelectCardID] = useState(() => (''))
  const [selectHeroID, setSelectHeroID] = useState(() => (''))

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

  useEffect(() => {
    if (!openModal) {
      const [actiont, ...text] = command.split(" ")
      const restComand = text.join(" ")
      let heroChanged = false

      if (commandMatch(actiont, ["compra", "guarda", "descarta"])) {

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
            if (commandMatch(actiont, ["descarta"])) {
              nextHero.gold = nextHero.gold + card.value
              heroChanged = true
              setSelectCardID(null)
              return {}
            }
            if (commandMatch(actiont, ["compra"]) && nextHero.slot.length < 2) {
              const cardWithUseFlag = { ...card, isUse: false }
              
              // Auto-consumo para poção no slot
              if (card.type === 'potion' && card.auto?.slot) {
                const healAmount = Math.min(card.value, nextHero.hero.maxValue - nextHero.hero.value)
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
              if (!card.auto) {
                setSelectHeroID(card.id)
              }
              
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

      if (commandMatch(actiont, ["pega", "descarta"])) {
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
            if (commandMatch(actiont, ["descarta"])) {
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
              if (!card.auto) {
                setSelectHeroID(card.id)
              }
              
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
          skill: [...dungeonHero.skill]
        }

        // Se selectCardID está definido e há apenas uma carta no slot, usa automaticamente
        // Ou se há apenas uma carta no slot e ela é do tipo skill, usa automaticamente
        const shouldAutoUse = (selectCardID && nextHero.slot.length === 1) || 
          (nextHero.slot.length === 1 && nextHero.slot[0].type === 'skill')

        // Processa cards do slot do herói
        nextHero.slot = nextHero.slot.filter((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = shouldAutoUse || (selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard]))

          if (shouldProcessCard) {
            nextHero.skill.push(card)
            heroChanged = true
            setSelectHeroID(null)
            return false // Remove do slot
          }
          return true // Mantém no slot
        })

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
            // Verifica se o herói pode destruir o inimigo
            if (nextHero.hero.value > card.value) {
              // Diminui o valor do herói pelo valor do inimigo
              nextHero.hero.value = nextHero.hero.value - card.value
              // Converte o valor do enemy em gold
              nextHero.gold = nextHero.gold + card.value
              heroChanged = true
              setSelectCardID(null)
              
              // Toca o som do enemy se existir
              if (card.song) {
                playSound(card.song, card.songVolume || 0.5)
              }
              
              return {} // Destrói o card (retorna objeto vazio)
            }
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
            <div
              aria-hidden="true"
              style={{ color: 'white', padding: '20px', width: '100%' }}
              onClick={() => handlerCardClick(`restam ${deckState.length} no deck`)}
            >{deckState.length}</div>
            <div
              aria-hidden="true"
              style={{ color: 'white', padding: '20px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}
              onClick={() => handlerCardClick(`${dungeonHero.gold} de gold`)}
            >R${dungeonHero.gold}
            </div>
          </div>
          <Board
            dungeonCards={dungeonCards}
            setSelectCardID={setSelectCardID}
          />
        </div>

        <HeroContainer
          dungeonHero={dungeonHero}
          setSelectHeroID={setSelectHeroID}
        />
      </div>
    </>
  )
}

export default Game
