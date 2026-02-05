
// Função para gerar array automático de valores sequenciais
const generateRange = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Funções que geram arrays de cartas baseado nos status
const getEnemyCards = (enemy = 0) => [
  { title: "Dragão", value: generateRange(7 + enemy, 1 + enemy), type: "enemy", content: "This is the second dungeon card." },
  { title: "Gosma", value: generateRange(3 + enemy, 6 + enemy), type: "enemy", content: "This is a strong enemy card." },
  { title: "Esqueleto", value: generateRange(5 + enemy, 8 + enemy), type: "enemy", content: "This is a weak enemy card." },
  { title: "Vampiro", value: generateRange(2 + enemy, 5 + enemy), type: "enemy", content: "This is a weak enemy card." },
  { title: "Rato", value: generateRange(2 + enemy, 5 + enemy), type: "enemy", content: "This is a weak enemy card." }
];

const getShieldCards = (shield = 0) => [
  { title: "Escudo", value: generateRange(2 + shield, 8 + shield), type: "shield", content: "This is the second dungeon card." },
];

const getPotionCards = (potion = 0) => [
  { title: "Poção", value: generateRange(3 + potion, 9 + potion), type: "potion", content: "This is the second dungeon card." },
];

const getAttackCards = (attack = 0) => [
  { title: "Ataque", value: generateRange(2 + attack, 8 + attack), type: "attack", content: "This is the second dungeon card." },
];

const getGoldCards = (gold = 0) => [
  { title: "Ouro", value: generateRange(3 + gold, 11 + gold), type: "gold", content: "This is the second dungeon card." },
];

const getSkillCards = (skill = 0) => [
  { title: "Dobra Ataque", value: [2+ skill], type: "skill", content: "This is the second dungeon card." },
  { title: "Dobra Defesa", value: [2+ skill], type: "skill", content: "This is the second dungeon card." },
];

// Função para criar cartas aleatórias de um array
const getRandomCards = (cardArray, quantity, existingCards = []) => {
  const cards = [];
  
  for (let i = 0; i < quantity; i++) {
    const randomCard = cardArray[Math.floor(Math.random() * cardArray.length)];
    
    // Filtra os valores que já existem no deck para este título
    const usedValues = [...existingCards, ...cards]
      .filter(card => card.title === randomCard.title)
      .map(card => card.value);
    
    const availableValues = randomCard.value.filter(v => !usedValues.includes(v));
    
    // Se não houver valores disponíveis, pula esta iteração
    if (availableValues.length === 0) continue;
    
    const randomValue = availableValues[Math.floor(Math.random() * availableValues.length)];
    
    cards.push({
      ...randomCard,
      value: randomValue,
      id: crypto.randomUUID()
    });
  }
  
  return cards;
};

// Criar deck com quantidades específicas e status do jogador
const createDeck = (playerStats = {}) => {
  const { enemy = 0, attack = 0, shield = 0, potion = 0, gold = 0, skill = 0 } = playerStats;
  
  const deck = [];
  
  // Adiciona cartas garantindo que não haja duplicatas
  deck.push(...getRandomCards(getEnemyCards(enemy), 15, deck));    // 15 inimigos
  deck.push(...getRandomCards(getAttackCards(attack), 10, deck));   // 10 ataques
  deck.push(...getRandomCards(getShieldCards(shield), 8, deck));    // 8 escudos
  deck.push(...getRandomCards(getPotionCards(potion), 7, deck));    // 7 vidas/poções
  deck.push(...getRandomCards(getGoldCards(gold), 8, deck));      // 8 ouros
  deck.push(...getRandomCards(getSkillCards(skill), 2, deck));      // 2 habilidades
  
  return deck.sort(() => Math.random() - 0.5); // Embaralha o deck
};

export default createDeck;