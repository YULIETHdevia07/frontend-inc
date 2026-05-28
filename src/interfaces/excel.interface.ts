import type ExcelJS from "exceljs";

// Esto ayuda a que TypeScript permita agregar la lista desplegable del rol.
// Tipo auxiliar para poder usar dataValidations.add sin error de TypeScript.
export type WorksheetWithDataValidations = ExcelJS.Worksheet & {
  dataValidations: {
    add: (
      range: string,
      validation: ExcelJS.DataValidation
    ) => void;
  };
};