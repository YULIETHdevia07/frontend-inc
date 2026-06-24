// Convierte el tamaño de un archivo de bytes a KB o MB para mostrarlo en pantalla.
export const formatFileSize = (size: number) => {
    const sizeInKb = size / 1024;

    if (sizeInKb < 1024) {
        return `${Math.round(sizeInKb)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
};