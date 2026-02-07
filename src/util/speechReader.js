/**
 * Função para ler em voz alta todos os comandos da configuração
 * @param {Array} config - Array de configuração com comandos
 * @returns {boolean} - true se encontrou textCommand para ler, false caso contrário
 */
export const readCommandsList = (config) => {
  if (!config || config.length === 0 || !('speechSynthesis' in window)) return false;

  // Cancelar qualquer leitura em andamento
  window.speechSynthesis.cancel();

  // Criar texto para leitura percorrendo config
  let fullText = "Lista de comandos disponíveis: ";
  let hasTextCommand = false;
  
  config.forEach((item) => {
    if (item?.textCommand) {
      hasTextCommand = true;
      if (Array.isArray(item.textCommand)) {
        fullText += `${item.textCommand.join(', ')}. `;
      } else {
        fullText += `${item.textCommand}. `;
      }
    }
  });

  // Se não encontrou nenhum textCommand, retorna false
  if (!hasTextCommand) return false;

  // Criar e executar síntese de voz
  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
  
  return true;
};

/**
 * Função para parar a leitura em andamento
 */
export const stopReading = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Função para ler um texto específico em voz alta
 * @param {string} text - Texto a ser lido
 * @param {Object} options - Opções de configuração (lang, rate, pitch, volume)
 */
export const readText = (text, options = {}) => {
  if (!text || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'pt-BR';
  utterance.rate = options.rate || 0.9;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  window.speechSynthesis.speak(utterance);
};
