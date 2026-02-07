
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

  useEffect(() => {
    const activeCards = dungeonCards.filter((card) => card.title)
    const countCard = activeCards.length

    if (countCard <= 1 && deckState.length > 0) {
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
              return {}
            }
            if (commandMatch(actiont, ["descarta"])) {
              nextHero.gold = nextHero.gold + card.value
              heroChanged = true
              setSelectCardID(null)
              return {}
            }
            if (commandMatch(actiont, ["pega", "compra"]) && nextHero.slot.length < 2) {
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

        // Processa cards do slot do herói
        nextHero.slot = nextHero.slot.filter((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          // Verifica se deve usar o ID do card selecionado ou o comando de texto
          const shouldProcessCard = selectHeroID
            ? card.id === selectHeroID
            : commandMatch(restComand, [infoCard])

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
              heroChanged = true
              setSelectCardID(null)
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
