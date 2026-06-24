// Detalle de un error encontrado en una columna del archivo.
export interface BulkUploadColumnError {
  column: string;
  message: string;
}

// Error encontrado en una fila durante una carga masiva.
export interface BulkUploadError {
  row: number;
  totalErrors: number;
  errors: BulkUploadColumnError[];
}

// Resultado general de una carga masiva.
export interface BulkUploadResult<T = unknown> {
  totalRows: number;
  totalCreated: number;
  totalRowsWithErrors: number;
  totalErrors: number;
  createdUsers?: T[];
  createdItems?: T[];
  errors: BulkUploadError[];
  message?: string;
}

// Respuesta general de una carga masiva.
export interface BulkUploadResponse<T = unknown> {
  message: string;
  result: BulkUploadResult<T>;
}

// Propiedades del componente reutilizable de carga masiva.
export interface BulkUploadDialogProps<T = unknown> {
  open: boolean;
  title: string;
  description: string;
  requiredColumns: string[];
  file: File | null;
  loading: boolean;
  completed?: boolean;
  result?: BulkUploadResult<T> | null;
  onClose: () => void;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  onClearResult?: () => void;
  onDownloadTemplate?: () => void;
}