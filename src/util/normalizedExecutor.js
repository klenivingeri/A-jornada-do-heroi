// Função para verificar se alguma das frases do array existe no texto normalizado
export const normalizedExecutor = (text, phrases) => {
  const normalized = text;
  return phrases.some(phrase => normalized.includes(phrase));
}
