// Convierte colores tipo "#1565c0" a formato ExcelJS "FF1565C0".
export const toExcelColor = (color: string) => {
  return `FF${color.replace("#", "").toUpperCase()}`;
};