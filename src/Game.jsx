
import { useState, useEffect } from 'react'
import { CardContainer } from './components/CardContainer/CardContainer'

const initItem = 
{
  title: 'Poção',
  value: 7, 
  type: 'potion',
  content: 'This is the second dungeon card.',
  id: 'fb4fce46-b49d-4e3e-84cf-6bd13c38b707'
} 
function Game({deck}) {
  const [deckState, setDeckState] = useState(deck);
  const [dungeonCards, setDungeonCards] = useState([initItem])

  useEffect(() => {
    if(dungeonCards.length <= 1 && deckState.length > 0){
        const initialCards = deckState.slice(0, 3)
        setDungeonCards([initItem, ...initialCards])
        setDeckState(deckState.slice(3))
    }
  }, []);
  console.log(dungeonCards)
  return (
    <CardContainer dungeonCards={dungeonCards} />
  )
}

export default Game
