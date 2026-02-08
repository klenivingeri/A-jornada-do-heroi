import './App.css'
import createDeck from './util/deck-create.js'
import Game from './Game.jsx'
import { useState, useEffect } from 'react';
import { Modal } from './components/Modal/index.jsx';
import SpeechListener from './components/SpeechListener/SpeechListener.jsx';
import { commandMatch } from './util/commandMatch.js';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic.jsx';
import { readSimpleCommand } from './util/speechReader';

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
  const [startGame, setStartGame] = useState(false)
  const [isDead, setIsDead] = useState(false)

  // UseEffect para reagir aos comandos de voz sem causar loop infinito
  useEffect(() => {
    if (!openModal) {
      if (commandMatch(command, ["abrir menu", "abrir configurações"])) {
        setOpenModal(true)
      }
      if (commandMatch(command, ["iniciar"])) {
        setStartGame(true)
      }
      if (commandMatch(command, ["retorn"])) {
        setStartGame(false)
        setIsDead(false)
      }
      setCommand("")
    }
  }, [command])

  // UseEffect para ler mensagem quando o herói morre
  useEffect(() => {
    if (isDead) {
      readSimpleCommand('Você morreu! Diga "retornar" para voltar à tela inicial')
    }
  }, [isDead])

  

  return (
    <div className="app">
      {!startGame ? (
        <div style={{ 
          color: 'white', 
          padding: '40px', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{ marginBottom: '30px' }}>A Jornada</h1>
          <p style={{ marginBottom: '20px', fontSize: '18px' }}>
            Bem-vindo ao jogo! Use comandos de voz para interagir.
          </p>
          <p style={{ marginBottom: '10px' }}>Diga <strong>"iniciar"</strong> para começar o jogo</p>
          <p>Diga <strong>"abrir menu"</strong> para acessar as configurações</p>
        </div>
      ) : isDead ? (
        <div style={{ 
          color: 'red', 
          padding: '40px', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{ marginBottom: '30px', fontSize: '48px' }}>💀 Você Morreu!</h1>
          <p style={{ fontSize: '24px', marginBottom: '20px' }}>
            Sua jornada chegou ao fim...
          </p>
          <p style={{ fontSize: '18px', color: 'white' }}>
            Diga <strong>"retornar"</strong> para voltar à tela inicial
          </p>
        </div>
      ) : (
        <Game 
          deck={deck} 
          command={command} 
          setCommand={setCommand} 
          openModal={openModal} 
          setIsDead={setIsDead} 
        />
      )}

      {openModal && (
        <Modal 
          command={command} 
          setCommand={setCommand} 
          onClose={setOpenModal} 
          config={config} 
          setConfig={setConfig} 
        />
      )}
      
      <SpeechListener setCommand={setCommand} />
      <BackgroundMusic volume={config.find(item => item.type === "ambient")?.value || 10} />
    </div>
  )
}

export default App
