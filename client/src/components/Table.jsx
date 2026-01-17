import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

// 1. Define Columns matching your API JSON Keys exactly
const columns = [
    { id: 'name', label: 'Student Name', minWidth: 150 },
    { id: 'batch', label: 'Batch/Class', minWidth: 150 }, // Requires special handling
    { id: 'phone', label: 'Phone', minWidth: 120 },
    { id: 'parentName', label: 'Parent Name', minWidth: 150 }, // Matches JSON
    { id: 'feeStatus', label: 'Fee Status', minWidth: 100, align: 'center' } // Matches JSON
];

export default function StudentTable({ students = [] }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Color logic for status chips
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            case 'Overdue': return 'error';
            default: return 'default';
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="student list table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    // 2. CRITICAL FIX: Use 'row.id' because 'phone' is null in your data
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            return (
                                                <TableCell key={column.id} align={column.align}>

                                                    {/* CASE 1: Handle Batch Object */}
                                                    {column.id === 'batch' ? (
                                                        // Access the nested .name property safely
                                                        value?.name || '-'

                                                        /* CASE 2: Handle Fee Status Chip */
                                                    ) : column.id === 'feeStatus' ? (
                                                        <Chip
                                                            label={value || 'Pending'}
                                                            color={getStatusColor(value || 'Pending')}
                                                            size="small"
                                                            variant="filled"
                                                            sx={{ width: '90px', justifyContent: 'center' }}
                                                        />

                                                        /* CASE 3: Handle Normal Text (check for nulls) */
                                                    ) : (
                                                        // If value is null (like phone), show a dash '-'
                                                        value || '-'
                                                    )}

                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}

                        {/* Empty State Message */}
                        {students.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}