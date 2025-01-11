export const adjustColor = (color: string, amount: number): string => {
  // HEXカラーコードをRGBに変換
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 各色成分を調整
  const adjustComponent = (c: number): number => {
    const newValue = c + amount;
    return Math.min(255, Math.max(0, newValue));
  };

  const newR = adjustComponent(r);
  const newG = adjustComponent(g);
  const newB = adjustComponent(b);

  // RGBをHEXに戻す
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}; 