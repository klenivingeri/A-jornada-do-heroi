import './App.css'
import createDeck from './util/deck-create.js'
import Game from './Game.jsx'
import { useState, useEffect } from 'react';
import { Modal } from './components/Modal/index.jsx';
import SpeechListener from './components/SpeechListener/SpeechListener.jsx';
import { commandMatch } from './util/commandMatch.js';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic.jsx';
import { readSimpleCommand } from './util/speechReader';
import Rules from './components/Rules/Rules.jsx';

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
    command: ["ambiente"],
    type: "ambient",
    min: 0,
    max: 100,
    value: 10
  },
  {
    text: "Som efeito",
    description: "Música que toca no fundo",
    textCommand: "som ambiente [valor]",
    command: ["efeito"],
    type: "ambient",
    min: 0,
    max: 100,
    value: 10
  },
  {
    text: "Velocidade da Fala",
    description: " Velocidade da fala do narrador, que lê as ações do jogo",
    command: ["velocidade"],
    textCommand: "velocidade [valor]",
    min: 0,
    max: 100,
    value: 50
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
  // {
  //   text: "Falas de Efeitos",
  //   textCommand: "ativar falas, ou desativar falas",
  //   description:
  //     "Ativado: fala o nome das cartas. Desativado: apenas o efeito sonoro será reproduzido",
  //   command: ["ativar falas", "desativar falas"],
  //   active: true
  // },

function App() {
  const deck = createDeck(statusGame);
  const [command, setCommand] = useState("")
  const [config, setConfig] = useState(() => menuConfiguracoes)
  const [openModal, setOpenModal] = useState(false)
  const [page, setPage] = useState('init')
  const [isDead, setIsDead] = useState(false)
  
  useEffect(() => {
    if (!openModal) {
      console.log('aaaaaaaaaa', command)
      if (commandMatch(command, ["menu", "configurações"])) {
        setPage('menu')
      }
      if (commandMatch(command, ["iniciar"])) {
        setPage('game')
      }
      
      if (commandMatch(command, ["retorn", "volta", "fechar"])) {
        setPage('init')
        console.log('aaaaaaaaaa')
        setIsDead(false)
      }
      if (commandMatch(command, ["regra"])) {
        setPage('regra')
      }
      setCommand("")
    }
  }, [command])

  // UseEffect para ler mensagem quando o herói morre
  useEffect(() => {
    if (isDead) {
      setPage('result')
      readSimpleCommand('Você morreu! Diga "retornar" para voltar à tela inicial')
    }
  }, [isDead])

  return (
    <div className="app">
      {page === 'init' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          height: '100%',
        }}>
          <header 
            style={{height:'25%'}}
            role="banner"
            aria-label="Tela inicial do jogo A Jornada do Herói"
          >
            <h1  
              style={{ marginBottom: '6px', fontSize: '18px' }}
              id="game-title"
            >
              A Jornada do herói
            </h1>
            <p style={{ marginBottom: '6px'}} aria-label="Descrição do jogo">
              Bem-vindo ao jogo! Use comandos de voz para executar ações.
              Imagine 4 blocos, um em cima do outro, os 2 blocos centrais são o area do botão para executarcomandos, é só segurar e falar, ao soltar o botão, se for um comando valido, sera executado.
            </p>
            <nav aria-label="Comandos disponíveis">
              <p>Diga: <strong aria-label="diga iniciar">"Iniciar"</strong> para começar o jogo</p>
              <p>Diga: <strong aria-label="diga regras">"Regras"</strong> para entender como jogar</p>
              <p>Diga: <strong aria-label="diga abrir menu">"Abrir menu"</strong> para acessar as configurações</p>
            </nav>
          </header>
          <SpeechListener setCommand={setCommand} />
          <div style={{height:'25%'}}>Historico de partidas</div>
        </div>
      )}

      {page === 'result' && (<div style={{
        color: 'red',
        padding: '40px',
        textAlign: 'center',
        height: '100%',

      }}>
        <h1 style={{ marginBottom: '30px', fontSize: '48px' }}>💀 Você Morreu!</h1>
        <p style={{ fontSize: '24px', marginBottom: '20px' }}>
          Sua jornada chegou ao fim...
        </p>
        <p style={{ fontSize: '18px', color: 'white' }}>
          Diga <strong>"retornar"</strong> para voltar à tela inicial
        </p>
        
      </div>)}
      {page === 'game' && (
        <Game
          deck={deck}
          openModal={openModal}
          setIsDead={setIsDead}
        />)}
      {page === 'regra' && (
        <Rules setCommand={setCommand} />
      )}

      {page === 'menu' &&  (
        <Modal
          command={command}
          setCommand={setCommand}
          onClose={setOpenModal}
          config={config}
          setConfig={setConfig}
        >
        <SpeechListener setCommand={setCommand} />
        </Modal>
      )}
      <BackgroundMusic volume={config.find(item => item.type === "ambient")?.value || 10} />
    </div>
  )
}

export default App
