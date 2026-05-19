import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    rows: T[];
    page: number;
    rowsPerPage: number;
    onPageChange: (_event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Muestra una tabla reutilizable con columnas dinámicas y paginación
const DataTable = <T,>({
    columns,
    rows,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: DataTableProps<T>) => {
    // Calcula los registros visibles según la página actual
    const visibleRows = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const style = {
        tableContainer: {
            borderRadius: "16px",
            boxShadow: "none",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
        },

        tableHead: {
            backgroundColor: "#f3f4f6",
        },

        tableHeadText: {
            color: "#374151",
            fontWeight: 800,
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
        },

        tableCell: {
            color: "text.primary",
            fontSize: "14px",
            borderBottom: "1px solid #f1f5f9",
        },
    };

    return (
        <TableContainer component={Paper} sx={style.tableContainer}>
            <Table>
                <TableHead sx={style.tableHead}>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || "left"}
                                sx={style.tableHeadText}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {visibleRows.map((row, index) => (
                        <TableRow
                            key={index}
                            hover
                            sx={{
                                "&:hover": {
                                    backgroundColor: "#f8fafc",
                                },
                            }}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || "left"}
                                    sx={style.tableCell}
                                >
                                    {column.render(row, page * rowsPerPage + index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 30, 50]}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </TableContainer>
    );
};

export default DataTable;