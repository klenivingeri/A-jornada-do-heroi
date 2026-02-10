import SpeechListener from '../SpeechListener/SpeechListener.jsx';

function Rules({ setCommand }) {
  return (
    <div style={{
      color: 'white',
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      overflow: 'auto',
      height: '100vh',
      position: 'relative'
    }}>
      <h1 style={{ 
        marginBottom: '30px', 
        fontSize: '32px',
        textAlign: 'center',
        borderBottom: '2px solid gold',
        paddingBottom: '15px'
      }}>
        📜 Regras do Jogo - A Jornada do Herói
      </h1>
      <p style={{ marginBottom: '30px' }}>Nesta tela o botão de executar comandos fica no 4º bloco, ele está no inferior da tela. Dito isso, vamos às regras!</p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          🎯 Objetivo
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Sobreviva o maior tempo possível enfrentando inimigos, coletando recursos e gerenciando seu equipamento. 
          O jogo termina quando sua vida chega a zero.
        </p>
      </section>
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          🎯 Distribuição dos Elementos na Tela
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '10px' }}>
          A tela do jogo é dividida em 4 blocos:
        </p>
        <ul style={{ fontSize: '16px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li><strong>Bloco 1 (Superior):</strong> 4 cartas disponíveis na horizontal para interagir</li>
          <li><strong>Blocos 2 e 3 (Centrais):</strong> Botão para executar comandos de voz. Nas laterais(usando espaço minimo): esquerda mostra cartas restantes no deck, na direita mostra ouro atual da partida</li>
          <li><strong>Bloco 4 (Inferior):</strong> Existe 4 espaços para cartas (Mão Esquerda, Mão Direita, Herói, Bolsa), a carta herói é preenchia automaticamente</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          ⏱️ Sistema de Turnos
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Quando restar apenas 1 carta no Bloco 1, o turno termina. Um novo turno começa com novas cartas. 
          As cartas na mão ou bolsa permanecem, menos as que foram usadas automaticamente, geralmente poção de vida e ouro.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          🎴 Cartas do Bloco 1
        </h2>
        <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#ffd700' }}>
          Tipos de Cartas
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#ff6b6b', fontSize: '18px' }}>👹 Inimigos</h3>
            <p>Dragão, Gosma, Esqueleto, Vampiro, Rato, Fantasma, Zumbi, Sereia, Espantalho, Ogro</p>
            <p>Você deve derrotá-los para ganhar ouro.</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#ffd700', fontSize: '18px' }}>🪙 Ouro</h3>
            <p>Ao ser adicionado nas mãos ou na bolsa, o ouro é ganho automaticamente. O espaço fica ocupado até a rodada acabar.</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#95e1d3', fontSize: '18px' }}>🧪 Poção</h3>
            <p>Recupera vida. Ao ser adicionado nas mãos, é automaticamente usada. O espaço fica ocupado até a rodada acabar.</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#ff4444', fontSize: '18px' }}>⚔️ Ataque</h3>
            <p>Adicionada nas mãos, pode ser usada para atacar. Causa dano aos inimigos, reduzindo o valor da carta inimiga.</p>
            <p>Ao ser utilizada, é destruída e libera o espaço.</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#4ecdc4', fontSize: '18px' }}>🛡️ Defesa</h3>
            <p>Adicionada nas mãos, pode ser usada para defender. Absorve dano de inimigos. Se o dano exceder a defesa, o restante afeta a vida do herói.</p>
            <p>Ao ser utilizada, é destruída e libera o espaço.</p>
          </div>
          

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#4ecdc4', fontSize: '18px' }}>🛡️ Herói</h3>
            <p>Carta Herói só existe 1, como dito antes ela é adicionada automaticamente.</p>
            <p>A carta heroi possui o comando "Avançar" ela causa dano com base no seu valor atual</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ color: '#9b59b6', fontSize: '18px' }}>✨ Habilidades</h3>
            <p><strong>Aumenta Ataque:</strong> Aumenta o valor de cartas de ataque (na mão ou bolsa)</p>
            <p><strong>Aumenta Defesa:</strong> Aumenta o valor de cartas de defesa (na mão ou bolsa)</p>
            <p><strong>Reviver:</strong> Te revive quando morrer com vida baseada no valor da carta</p>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Ao ser utilizada, é destruída e libera o espaço.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          💡 Dicas Estratégicas
        </h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>✅ Use poções quando sua vida estiver baixa (abaixo de 6, você ouvirá batimentos cardíacos)</li>
          <li>✅ Guarde cartas de defesa e ataque na bag para momentos críticos</li>
          <li>✅ Habilidades "Aumenta Ataque" e "Aumenta Defesa" fortalecem suas cartas</li>
          <li>✅ A habilidade "Reviver" é sua segunda chance - use com sabedoria</li>
          <li>✅ Cartas de ouro e poção são consumidas automaticamente</li>
          <li>✅ Você ganha ouro ao derrotar inimigos (igual ao valor de dano deles)</li>
        </ul>
      </section>

      <p>Se voce Já fez o tutorial, pode dar o comando "retornar" ou "voltar", os comando da aqui pra baixo explicam os comandos parceiais, que foram oque voce aprendeu no tutorial, e os comandos completos, que são a forma de jogar sem precisar tocar na tela.</p>
      
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          🎮 Mecânicas do Jogo
        </h2>

        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffd700' }}>🎤 Sistema de Comandos</h3>
        <p style={{ marginBottom: '15px' }}>Todo o jogo funciona por comandos de voz. Quando tiver dúvida, diga "comando" para ouvir todas as opções disponíveis na tela.</p>
          
        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffd700' }}>🎯 Sistema de Seleção</h3>
        <p style={{ marginBottom: '15px' }}>Existem seleções independentes no Bloco 1 e Bloco 4. Você pode selecionar um inimigo no Bloco 1 e depois uma carta no Bloco 4 para executar comandos de ataque ou defesa.</p>

        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffd700' }}>📋 Bloco 1 (Tabuleiro)</h3>
        <div style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <p><strong>Comando Parcial:</strong> Selecione uma carta e depois diga: "comprar", "guardar" ou "descartar"</p>
          <p><strong>Comando Completo:</strong> "comprar ataque 5", "guardar defesa 3", "descartar poção"</p>
          <p style={{ fontStyle: 'italic', marginTop: '5px' }}>Funciona para todas as cartas exceto inimigos.</p>
        </div>

        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffd700' }}>📋 Bloco 4 (Herói e Equipamentos)</h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ marginBottom: '10px' }}><strong>Espaços:</strong> Mão Esquerda, Mão Direita, Herói, Bolsa</p>
          <p><strong>Mãos:</strong> Com carta de ataque use "atacar", com defesa use "defender", com habilidade use "usar"</p>
          <p><strong>Herói:</strong> Clique para ouvir status (vida e habilidades passivas)</p> O heroi tmb ataca,
          <p><strong>Bolsa:</strong> Use "vender" para ganhar ouro ou "pegar" para mover para a mão</p>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Comando Parcial:</strong> Selecione carta inimiga e diga: "atacar ", "defender" "usar" quando for habilidade,", se você possuir a carta em mãos, ela é selecionada automaticamente, caso voce tenha 2 iguais, o jogo ai pedir pra selecionar uma</p>
            <p><strong>Comando Completo:</strong> "ataque dragão 10", "defesa vampiro 8", "usar reviver"</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#ffd700' }}>
          🎤 Comandos de Voz
        </h2>
        
        <div style={{ paddingLeft: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#ffa500' }}>
            Comandos do Tabuleiro (Board)
          </h3>
          <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <li><strong>"comprar [nome da carta] [valor]"</strong> - Adiciona carta ao slot</li>
            <li><strong>"guardar [nome da carta] [valor]"</strong> - Adiciona carta à bag</li>
            <li><strong>"descartar [nome da carta] [valor]"</strong> - Descarta a carta</li>
          </ul>

          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#ffa500' }}>
            Comandos da Bolsa (Bag)
          </h3>
          <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <li><strong>"pegar [nome da carta] [valor]"</strong> - Move carta da bag para o slot</li>
            <li><strong>"vender [nome da carta] [valor]"</strong> - Vende a carta por ouro</li>
          </ul>

          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#ffa500' }}>
            Comandos de Combate
          </h3>
          <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <li><strong>"avançar [nome do inimigo] [valor]"</strong> - Enfrenta o inimigo sem proteção (recebe dano)</li>
            <li><strong>"atacar [nome do inimigo] [valor]"</strong> - Usa carta de ataque para reduzir dano do inimigo</li>
            <li><strong>"defender [nome do inimigo] [valor]"</strong> - Usa carta de defesa para absorver dano</li>
          </ul>

          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#ffa500' }}>
            Comandos de Habilidades
          </h3>
          <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <li><strong>"usar [nome da habilidade]"</strong> - Ativa habilidade no slot</li>
          </ul>

          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#ffa500' }}>
            Comandos Gerais
          </h3>
          <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
            <li><strong>"abrir menu"</strong> - Abre configurações</li>
            <li><strong>"retornar"</strong> - Volta à tela inicial</li>
          </ul>
        </div>
      </section>

      <div style={{ 
        textAlign: 'center', 
        padding: '30px',
        borderTop: '2px solid gold',
        marginTop: '40px',
        paddingBottom: '80px'
      }}>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          Diga <strong>"retornar"</strong> para voltar ao menu inicial
        </p>
        <div style={{
          position:'fixed', 
          bottom:'20px', 
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '900px',
          width: '100%'
        }}>
          <SpeechListener setCommand={setCommand} />
        </div>
      </div>
    </div>
  );
}

export default Rules;
