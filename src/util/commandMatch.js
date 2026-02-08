import { normalizeText } from './normalizeText.js';

// Função para verificar se alguma das frases do array existe no texto normalizado
export const commandMatch = (text, phrases, threshold = 0.75) => {
  if (!text || text.trim() === "") return false;
  
  const normalizedInput = normalizeText(text);
  const inputWords = normalizedInput.split(" ").filter(w => w.length > 0);

  return phrases.some(phrase => {
    const normalizedPhrase = normalizeText(phrase);
    const phraseWords = normalizedPhrase.split(" ").filter(w => w.length > 0);

    if (phraseWords.length === 0) return false;

    let matches = 0;

    phraseWords.forEach(word => {
      if (word.length > 0 && inputWords.some(w => w.length > 0 && (w.startsWith(word) || word.startsWith(w)))) {
        matches++;
      }
    });

    const score = matches / phraseWords.length;
    return score >= threshold;
  });
}
