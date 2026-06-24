import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { theme } from "../../theme/theme";
import { toExcelColor } from "../../utils/common/excelUtils";
import type { WorksheetWithDataValidations } from "../../interfaces/users/excel.interface";

export const downloadBulkUsersTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Usuarios");

  worksheet.columns = [
    {
      header: "nombre",
      key: "nombre",
      width: 30,
    },
    {
      header: "correo",
      key: "correo",
      width: 35,
    },
    {
      header: "contraseña",
      key: "contraseña",
      width: 22,
    },
    {
      header: "rol",
      key: "rol",
      width: 18,
    },
  ];

  const colors = {
    primary: toExcelColor(theme.palette.primary.main),
    primaryDark: toExcelColor(theme.palette.primary.dark),
    backgroundPaper: toExcelColor(theme.palette.background.paper),
  };

  // Estilo para los encabezados.
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: colors.backgroundPaper },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colors.primary },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    cell.border = {
      top: { style: "thin", color: { argb: colors.primaryDark } },
      left: { style: "thin", color: { argb: colors.primaryDark } },
      bottom: { style: "thin", color: { argb: colors.primaryDark } },
      right: { style: "thin", color: { argb: colors.primaryDark } },
    };
  });

  worksheet.getRow(1).height = 26;

  // Comentarios con reglas para cada columna.
  worksheet.getCell("A1").note =
    "Regla: escriba el nombre completo del usuario. Solo se permiten letras, espacios, tildes y la letra ñ. Mínimo 3 caracteres.";

  worksheet.getCell("B1").note =
    "Regla: escriba un correo electrónico válido. Ejemplo: usuario@correo.com. No debe estar repetido en el archivo ni registrado previamente.";

  worksheet.getCell("C1").note =
    "Regla: escriba una contraseña para el usuario. Debe tener mínimo 6 caracteres.";

  worksheet.getCell("D1").note =
    "Regla: seleccione un rol válido. Opciones permitidas: USER, ADMIN o AGENT.";

  // Lista desplegable para rol sin asignar valores vacíos a las filas.
  const worksheetWithValidation = worksheet as WorksheetWithDataValidations;

  worksheetWithValidation.dataValidations.add("D2:D500", {
    type: "list",
    allowBlank: true,
    formulae: ['"USER,ADMIN,AGENT"'],
    showErrorMessage: true,
    errorTitle: "Rol no válido",
    error: "Debe seleccionar un rol válido: USER, ADMIN o AGENT.",
  });

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "plantilla_carga_masiva_usuarios.xlsx");
};