
import { useState, useEffect } from 'react'
import { HeroContainer } from './components/HeroContainer/HeroContainer';
import { Board } from './components/Board/Board';

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
  slot: [{}, {}],
  hero:
  {
    title: 'Herói',
    value: 13,
    actions: ['avancar'],
    type: 'heroi',
    description: 'This is the second dungeon card.',
    id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707',
    uri: "https://img.freepik.com/fotos-premium/vista-frontal-do-capacete-de-cavaleiro-medieval-isolado-no-fundo-preto-criado-com-ia-generativa_916303-1693.jpg"
  }
  ,
  bag: [{}],
  skill: [{}] // sempre que o heroi morrer ou estiver com carta de ataque no slot, ou carta de defesa no slot, deve ser verificao se existe algum efeito pra ser aplicado
}

function Game({ deck }) {
  const [deckState, setDeckState] = useState(() => deck);
  const [dungeonCards, setDungeonCards] = useState(() => [initItem])
  const [dungeonHero, setDungeonHero] = useState(() => initHero)

  useEffect(() => {
    if (dungeonCards.length <= 1 && deckState.length > 0) {
      const newCards = deckState.slice(0, 3)
      setDungeonCards([...newCards, ...dungeonCards])
      setDeckState(deckState.slice(3))
    }
  }, [deckState]);

  

  return (
    <>
      <Board dungeonCards={dungeonCards} />
      <HeroContainer dungeonHero={dungeonHero} />
    </>

  )
}

export default Game
