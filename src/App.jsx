import './App.css'
import createDeck from './util/deck-create.js'
import Game from './Game.jsx'

const statusGame = {
  enemy: 1,
  attack: 0,
  shield: 0,
  potion: 0,
  gold: 0,
  skill: 0
}

function App() {
  const deck = createDeck(statusGame);
  return (
    <div className="app">
      <Game deck={deck} />
    </div>
  )
}

export default App
