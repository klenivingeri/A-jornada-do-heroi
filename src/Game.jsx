
import { useState, useEffect } from 'react'
import { CardContainer } from './components/CardContainer/CardContainer'
import { HeroContainer } from './components/HeroContainer/HeroContainer';

const initItem =
{
  title: 'Poção',
  value: 2,
  type: 'potion',
  content: 'This is the second dungeon card.',
  id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707'
}

const initHero = {
    slot: [{},{}],
    hero: {
      title: "Herói", value: 13, actions: ['avançar']
    },
    bag: [{}]
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
  }, []);

  return (
    <>
      <CardContainer dungeonCards={dungeonCards} />
      <HeroContainer dungeonHero={dungeonHero} />
    </>

  )
}

export default Game
