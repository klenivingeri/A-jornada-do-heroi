export const normalizeText = (text) => {
  if (!text) return ""; // Proteção contra valores nulos/undefined

  // 1. Transformar em string e Normalização Base (Acentos e Especiais)
  // Fazemos isso primeiro para garantir que "Sete" vire "sete" antes do dicionário
  let str = (Array.isArray(text) ? text.join(" ") : text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove símbolos
    .trim();

  // 2. Dicionário
  const mapNumeros = {
    um: "1",
    uma: "1",
    dois: "2",
    duas: "2",
    sete: "7",
    set: "7",
    deis: "10",
    dez: "10",
  };

  // 3. Regex e Substituição
  const keys = Object.keys(mapNumeros).join("|");
  const pattern = new RegExp(`\\b(${keys})\\b`, "gi");

  str = str.replace(pattern, (matched) => {
    const valor = mapNumeros[matched.toLowerCase()];
    return valor !== undefined ? valor : matched; // Fallback para não retornar undefined
  });

  // 4. Limpeza final de espaços
  return str.replace(/\s+/g, " ");
};