export const extractCommandNumber = (text) => {
    const match = text.match(/(\d+)/);
    const number = match ? parseInt(match[1]) : null;
    const commandText = text.replace(/\d+/g, '').trim();
    return [commandText, number];
  };