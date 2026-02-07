export const normalizeText = (text) => {
  return text
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais, mantém letras, números e espaços
    .toLowerCase() // Converte para minúsculas
    .trim(); // Remove espaços extras
}