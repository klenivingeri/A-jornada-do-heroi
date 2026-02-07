
import { useState, useEffect } from 'react'
import { HeroContainer } from './components/HeroContainer/HeroContainer';
import { Board } from './components/Board/Board';
import { commandMatch } from './util/commandMatch';
import { normalizeText } from './util/normalizeText';

const initItem =
{
  title: 'Poção',
  value: 2,
  type: 'potion',
  content: 'This is the second dungeon card.',
  id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707',
  uri: "https://i.etsystatic.com/31046540/r/il/02f3d4/4024103472/il_340x270.4024103472_nazj.jpg"
}

const initHero = {
  slot: [],
  hero: {
    title: 'Herói',
    value: 13,
    actions: ['avancar'],
    type: 'heroi',
    description: 'This is the second dungeon card.',
    id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707',
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

    useEffect(() => {
      const activeCards = dungeonCards.filter((card) => card.title)
      const countCard = activeCards.length

      if (countCard <= 1 && deckState.length > 0) {
        const newCards = deckState.slice(0, 3)
        setDungeonCards([...newCards, ...activeCards])
        setDeckState(deckState.slice(3))
      }
    }, [dungeonCards, deckState]);

  useEffect(() => {
    if (!openModal) {
      const [actiont, ...text] = command.split(" ")
      const restComand = text.join(" ")

      if (commandMatch(actiont, ["pegar", "guardar", "descartar"])) {
        let heroChanged = false
        const nextHero = {
          ...dungeonHero,
          bag: [...dungeonHero.bag],
          slot: [...dungeonHero.slot],
          skill: [...dungeonHero.skill]
        }

        const restDungeonCards = dungeonCards.map((card) => {
          const infoCard = `${normalizeText(card.title)} ${card.value}`

          if (commandMatch(restComand, [infoCard])) {
            if (actiont === "guardar" && nextHero.bag.length < 1) {
              nextHero.bag.push(card)
              heroChanged = true
              return {}
            }
            if (actiont === "descartar") {
              nextHero.gold = nextHero.gold + card.value
              heroChanged = true
              return {}
            }
            if (actiont === "pegar" && nextHero.slot.length < 2) {
              nextHero.slot.push(card)
              heroChanged = true
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

      setCommand("") // Limpa o comando após executar
    }
  }, [command, openModal, dungeonCards, dungeonHero, setCommand])

  console.log({ dungeonHero })
  return (
    <>
      <div style={{ color: 'white' }}>{deckState.length}</div>
      <Board dungeonCards={dungeonCards} />
      <HeroContainer dungeonHero={dungeonHero} />
    </>

  )
}

export default Game
