import './App.css'
import createDeck from './util/deck-create.js'
import Game from './Game.jsx'
import { useState, useEffect } from 'react';
import { Modal } from './components/Modal/index.jsx';
import SpeechListener from './components/SpeechListener/SpeechListener.jsx';
import { commandMatch } from './util/commandMatch.js';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic.jsx';

const statusGame = {
  enemy: 1,
  attack: 0,
  shield: 0,
  potion: 0,
  gold: 0,
  skill: 0
}

const menuConfiguracoes = [
  {
    text: "Configurações"
  },
  {
    text: "Som Ambiente",
    description: "Música que toca no fundo",
    textCommand: "som ambiente [valor]",
    command: ["som ambiente"],
    type: "ambient",
    min: 0,
    max: 100,
    value: 10
  },
  {
    text: "Som dos Efeitos",
    description: "Efeito dos sons de ouro, ataque e defesa",
    command: ["som efeito"],
    textCommand: "som efeito [valor]",
    min: 0,
    max: 100,
    value: 50
  },
  {
    text: "Falas de Efeitos",
    textCommand: "ativar falas, ou desativar falas",
    description:
      "Ativado: fala o nome das cartas. Desativado: apenas o efeito sonoro será reproduzido",
    command: ["ativar falas", "desativar falas"],
    active: true
  },
  {
    text: "Lista comandos",
    notRead: true,
    command: ["Listar comandos", "Lista de acoes"],
  },
  {
    text: "Fechar Menu",
    textCommand: "fechar menu",
    isButton: true,
    command: ["fechar menu", "fechar configurações"],
  },
];


function App() {
  const deck = createDeck(statusGame);
  const [command, setCommand] = useState("")
  const [config, setConfig] = useState(() => menuConfiguracoes)
  const [openModal, setOpenModal] = useState(false)
  const [startGame, setStartGame] = useState(true)

  // UseEffect para reagir aos comandos de voz sem causar loop infinito
  useEffect(() => {
    if (!openModal) {
      if (commandMatch(command, ["abrir menu", "abrir configurações"])) {
        setOpenModal(true)
        setCommand("") // Limpa o comando após executar
      }
      if (commandMatch(command, ["iniciar jogo", "iniciar game"])) {
        setStartGame(true)
        setCommand("") // Limpa o comando após executar
      }
    }
  }, [command])

  return (
    <div className="app">
      {!startGame
        ? <div>
          <p>Bem vindo ao jogo! Use comandos de voz para interagir. Diga "abrir menu" para acessar as configurações.</p>
          <p>Ou Iniciar jogo dizendo "iniciar jogo". Diga "fechar menu" para fechar as configurações.</p>
        </div>
        : <Game deck={deck} command={command} setCommand={setCommand} openModal={openModal} setOpenModal={setOpenModal} startGame={startGame} setStartGame={setStartGame} />
      }
      {openModal && <Modal command={command} setCommand={setCommand} onClose={setOpenModal} config={config} setConfig={setConfig} />}
      <SpeechListener setCommand={setCommand} />
      <BackgroundMusic volume={config.find(item => item.type === "ambient")?.value || 10} />
    </div>
  )
}

export default App
