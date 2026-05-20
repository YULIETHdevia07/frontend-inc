import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
    render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    columns: DataTableColumn<T>[];
    rows: T[];
    page: number;
    rowsPerPage: number;
    onPageChange: (_event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Muestra una tabla reutilizable con encabezado flotante, acciones y paginación
const DataTable = <T,>({
    title,
    subtitle,
    actions,
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

    return (
        <Box>
            {(title || subtitle || actions) && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "stretch",
                            sm: "center",
                        },
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "14px",
                    }}
                >
                    <Box>
                        {title && (
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                }}
                            >
                                {title}
                            </Typography>
                        )}

                        {subtitle && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    marginTop: "2px",
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {actions && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: {
                                    xs: "flex-start",
                                    sm: "flex-end",
                                },
                                gap: "8px",
                                flexWrap: "wrap",
                            }}
                        >
                            {actions}
                        </Box>
                    )}
                </Box>
            )}

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: "16px",
                    boxShadow: "none",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    backgroundColor: "background.paper",
                }}
            >
                <Table>
                    <TableHead
                        sx={{
                            backgroundColor: "#f8fafc",
                        }}
                    >
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || "left"}
                                    sx={{
                                        color: "#475569",
                                        fontWeight: 800,
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
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
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "primary.light",
                                    },
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || "left"}
                                        sx={{
                                            color: "text.primary",
                                            fontSize: "14px",
                                            borderBottom: "1px solid #f1f5f9",
                                        }}
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
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count}`
                    }
                />
            </TableContainer>
        </Box>
    );
};

export default DataTable;