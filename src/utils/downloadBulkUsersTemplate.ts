import * as XLSX from "xlsx";

export const downloadBulkUsersTemplate = () => {
    const templateData = [
        {
            nombre: "",
            correo: "",
            contraseña: "",
            rol: "",
        },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    XLSX.writeFile(workbook, "plantilla_carga_masiva_usuarios.xlsx");
};