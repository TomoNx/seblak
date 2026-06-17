export const getToppingEmoji = (id: string, category: string) => {
  const normId = id.toLowerCase();
  if (normId.includes('kerupuk')) return '🫓';
  if (normId.includes('mie') || normId.includes('kwetiau')) return '🍜';
  if (normId.includes('makaroni')) return '🐚';
  if (normId.includes('bakso')) return '🍢';
  if (normId.includes('sosis')) return '🌭';
  if (normId.includes('ceker')) return '🐓';
  if (normId.includes('dumpling')) return '🥟';
  if (normId.includes('chikuwa') || normId.includes('crabstick') || normId.includes('fish')) return '🍥';
  if (normId.includes('telur')) return '🍳';
  if (normId.includes('batagor') || normId.includes('cuanki')) return '🍘';
  if (normId.includes('pilus')) return '🧆';
  if (normId.includes('pakcoy') || normId.includes('kol') || normId.includes('sawi')) return '🥬';
  if (normId.includes('jamur')) return '🍄';
  return category === 'karbo' ? '🍜' : category === 'protein' ? '🍖' : category === 'cuanki' ? '🍘' : '🥬';
};
