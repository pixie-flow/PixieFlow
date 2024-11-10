export const createPath = (startX: number, startY: number, endX: number, endY: number): string => {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(distance * 0.5, 100);
  
  const controlPoint1X = startX + curvature;
  const controlPoint2X = endX - curvature;
  
  return `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`;
};