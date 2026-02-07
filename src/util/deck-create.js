// Função para gerar array automático de valores sequenciais
const generateRange = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Gerador de ID com fallback para ambientes sem crypto.randomUUID
const generateId = () => {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const toHex = (b) => b.toString(16).padStart(2, "0");
      const hex = Array.from(bytes, toHex);
      return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    }
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Funções que geram arrays de cartas baseado nos status
const getEnemyCards = (enemy = 0) => [
  {
    title: "Dragão",
    value: generateRange(7 + enemy, 13 + enemy),
    type: "enemy",
    uri: "https://wallpapers.com/images/featured/imagens-do-dragao-3d-7fnp82l6eor2rsxo.jpg",
    description: "Dragão inimigo",
  },
  {
    title: "Gosma",
    value: generateRange(3 + enemy, 6 + enemy),
    type: "enemy",
    description: "Gosma inimiga",
    uri: "https://t4.ftcdn.net/jpg/05/94/89/73/360_F_594897314_F1ROeMCmV6zvRveKpXQk6Cl2vgiAfttn.jpg",
  },
  {
    title: "Esqueleto",
    value: generateRange(5 + enemy, 8 + enemy),
    type: "enemy",
    description: "Esqueleto inimigo",
    uri: "https://wallpapers.com/images/hd/scary-monster-pictures-wxi8mvb6mdad3xu2.jpg",
  },
  {
    title: "Vampiro",
    value: generateRange(2 + enemy, 7 + enemy),
    type: "enemy",
    description: "Vampiro inimigo",
    uri: "https://files.meiobit.com/wp-content/uploads/2020/04/20200424dracula-de-bram-stoker-2.jpg",
  },
  {
    title: "Rato",
    value: generateRange(2 + enemy, 7 + enemy),
    type: "enemy",
    description: "Rato inimigo",
    uri: "https://r2.starryai.com/results/1051467097/5bfb197a-c221-4519-b718-3a6e61892e8b.webp",
  },
    {
    title: "Fantasma",
    value: generateRange(4 + enemy, 10 + enemy),
    type: "enemy",
    description: "Fantasma inimigo",
    uri: "https://r2.starryai.com/results/1051467097/5bfb197a-c221-4519-b718-3a6e61892e8b.webp",
  },
];

const getShieldCards = (shield = 0) => [
  {
    title: "Defesa",
    value: generateRange(2 + shield, 9 + shield),
    type: "defense",
    actions: {
      bag: ["pegar", "descartar"], //retirar é tirar da bag e adicinar no slot, descartar é destruir e pegar seu valor em ouro
      hand: ["Defesa"], // é absorver o dano do inimigo com base no value, se o dano for maior que o value, o restante do dano passa para a vida do herói,e e a defesa é destruida, caso contradio só diminui a quantidade de defesa com base no dado do inimigo
      board: ["comprar", "guardar", "descartar"], // pegar, é adiconar a carta no slot se estiver algum disponivel, guardar é adicionar a bag, se estiver disponivel, e discartar é destruir a carta e pegar seu valor em ouro
    },
    uri: "https://img.elo7.com.br/product/zoom/4DD8D58/escudo-medieval-em-mdf-40-cm-aniversario-de-principe.jpg",
    description: "Defesa absorve dano",
    textCommand: "",
  }
];

const getAttackCards = (attack = 0) => [
  {
    title: "Ataque",
    value: generateRange(2 + attack, 9 + attack),
    type: "attack",
    actions: {
      bag: ["pegar", "descartar"],
      hand: ["ataque"], // o ataque diminui o value do inimigo baseado no value da carta value, após a carta ser utilizada ela é destruida e libera o slot.
      board: ["comprar", "guardar", "descartar"],
    },
    uri: "https://aventurasnahistoria.com.br/wp-content/uploads/espada_achado_bosnia.jpeg",
    description: "Ataque remove dano do inimigo",
    textCommand: "",
  },
];

const getPotionCards = (potion = 0) => [
  {
    title: "Poção",
    value: generateRange(3 + potion, 9 + potion),
    type: "potion",
    actions: {
      bag: ["pegar", "descartar"],
      board: ["comprar", "descartar", "guardar"],
    },
    auto: {
      // o item deve ser consumido automaticamente ao ser adicinada no slot, ele fica oculpado no slot até o final do turno
      slot: true,
    },
    uri: "https://i.etsystatic.com/31046540/r/il/02f3d4/4024103472/il_340x270.4024103472_nazj.jpg",
    description:
      "Poção é usada automaticamente ao ser colocada no slot, recuperando vida do herói. remove a carta quando finaliza o turno",
    textCommand: "",
    isUse: false //controle de uso: muda o valor pra true se a carta ja foi usada nesse turno
  },
];

const getGoldCards = (gold = 0) => [
  {
    title: "Ouro",
    value: generateRange(2 + gold, 11 + gold),
    type: "gold",
    actions: {
      board: ["comprar", "descartar", "guardar"],
    },
    auto: {
      // o item deve ser consumido automaticamente ao ser adicinada no slot ou bag, ele fica oculpado no slot até o final do turno
      bag: true,
      slot: true,
    },
    uri: "https://cdn.hswstatic.com/gif/Money-gold.jpg",
    description:
      "Ouro é usado automaticamente ao ser adicionado na bag ou slot, somando pontos de ouro ao herói., remove a carta quando finaliza o turno",
    textCommand: "",
    isUse: false //controle de uso: muda o valor pra true se a carta ja foi usada nesse turno
  },
];

const getSkillCards = (skill = 0) => {
  const reviveValue = 1 + skill;

  return [
    {
      title: "Dobra Ataque",
      value: [2],
      type: "skill",
      sequencial: 1, // informa quantas vezes o heroi pode usar a carta durante o jogo, se o heroi conseguir mais de uma carta deve o sequencial ser acumulativo, se utilizada em um ataque deve reduzir 1 do sequencial
      description: "Dobra a carta de ataque atual do herói.",
      actions: {
        bag: ["pegar", "descartar"],
        hand: ["usar"],// multiplica o valor de ataque com base no value da carta, após a carta ser utilizada ela é destruida e libera o slot.
        board: ["comprar", "guardar", "descartar"],
      },
      isUse: false, //controle de uso: muda o valor pra true se a carta ja foi usada, após a carta ser utilizada ela é destruida e libera o slot, o efeito dela deve existir até o sequencial for zerado
      effect: "attack", // o efeito é aplicado apenas em cartas type:ataque
      uri: "https://www.caminhosdaevolucao.org/wp-content/uploads/2018/10/magia1-945x628.jpg",
    },
    {
      title: "Dobra Defesa",
      value: [2],
      type: "skill",
      sequencial: 1, // informa quantas vezes o heroi pode usar a carta durante o jogo, se o heroi conseguir mais de uma carta deve o sequencial ser acumulativo, se utilizada em uma defesa deve reduzir 1 do sequencial
      actions: {
        bag: ["pegar", "descartar"],
        hand: ["usar"],
        board: ["comprar", "guardar", "descartar"],
      },
      description: "Dobra a carta de defesa atual do herói.",
      isUse: false, //controle de uso: muda o valor pra true se a carta ja foi usada, após a carta ser utilizada ela é destruida e libera o slot, o efeito dela deve existir até o sequencial for zerado
      effect: "defense", // o efeito é aplicado apenas em cartas type:defense
      uri: "https://www.caminhosdaevolucao.org/wp-content/uploads/2018/10/magia1-945x628.jpg",
    },
    {
      title: "Reviver",
      value: [reviveValue],
      type: "skill",
       sequencial: 1, // informa quantas vezes o heroi pode usar a carta durante o jogo, se o heroi conseguir mais de uma carta deve o sequencial ser acumulativo, se heroi morrer deve reduzir 1 do sequencial
      actions: {
        bag: ["pegar", "descartar"],
        hand: ["usar"],
        board: ["comprar", "guardar", "descartar"],
      },
      description: `Quando o herói for morto ele é revivido com ${reviveValue} de vida.`,
      isUse: false, //controle de uso: muda o valor pra true se a carta ja foi usada nesse turno
      uri: "https://www.caminhosdaevolucao.org/wp-content/uploads/2018/10/magia1-945x628.jpg",
    },
  ];
};

// Função para criar cartas aleatórias de um array
const getRandomCards = (cardArray, quantity, existingCards = []) => {
  const cards = [];

  for (let i = 0; i < quantity; i++) {
    const randomCard = cardArray[Math.floor(Math.random() * cardArray.length)];

    // Filtra os valores que já existem no deck para este título
    const usedValues = [...existingCards, ...cards]
      .filter((card) => card.title === randomCard.title)
      .map((card) => card.value);

    const availableValues = randomCard.value.filter(
      (v) => !usedValues.includes(v),
    );

    // Se não houver valores disponíveis, pula esta iteração
    if (availableValues.length === 0) continue;

    const randomValue =
      availableValues[Math.floor(Math.random() * availableValues.length)];

    cards.push({
      ...randomCard,
      value: randomValue,
      id: generateId(),
    });
  }

  return cards;
};

// Criar deck com quantidades específicas e status do jogador
const createDeck = (playerStats = {}) => {
  const {
    enemy = 0,
    attack = 0,
    shield = 0,
    potion = 0,
    gold = 0,
    skill = 0,
  } = playerStats;

  const deck = [];

  // Adiciona cartas garantindo que não haja duplicatas
  deck.push(...getRandomCards(getEnemyCards(enemy), 15, deck)); // 15 inimigos
  deck.push(...getRandomCards(getAttackCards(attack), 10, deck)); // 10 ataques
  deck.push(...getRandomCards(getShieldCards(shield), 8, deck)); // 8 escudos
  deck.push(...getRandomCards(getPotionCards(potion), 7, deck)); // 7 vidas/poções
  deck.push(...getRandomCards(getGoldCards(gold), 8, deck)); // 8 ouros
  deck.push(...getRandomCards(getSkillCards(skill), 2, deck)); // 2 habilidades

  return deck.sort(() => Math.random() - 0.5); // Embaralha o deck
};

export default createDeck;
