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

// 1. Updated Column IDs to match your Prisma DB fields (camelCase)
const columns = [
    { id: 'name', label: 'Student Name', minWidth: 170 },
    { id: 'phone', label: 'Phone Number', minWidth: 120 },
    { id: 'parentName', label: 'Parent Name', minWidth: 170 }, // Matches DB field
    {
        id: 'feeStatus', // Matches DB field
        label: 'Fee Status',
        minWidth: 100,
        align: 'center'
    },
];

// 2. Accept 'students' as a prop (default to empty array to prevent crash)
export default function BatchTable({ students = [] }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Helper to choose Color based on Status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'success';   // Green
            case 'Pending': return 'warning'; // Orange
            case 'Overdue': return 'error';   // Red
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
                        {/* 3. Map over the Real 'students' prop instead of mock 'rows' */}
                        {students
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => {
                                return (
                                    // Use student.id or phone as unique key
                                    <TableRow hover role="checkbox" tabIndex={-1} key={student.id || student.phone}>
                                        {columns.map((column) => {
                                            const value = student[column.id]; // Access data dynamically
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {/* Status Badge Logic */}
                                                    {column.id === 'feeStatus' ? (
                                                        <Chip
                                                            label={value || 'Pending'} // Default to Pending if null
                                                            color={getStatusColor(value || 'Pending')}
                                                            size="small"
                                                            variant="filled"
                                                            sx={{
                                                                width: '90px',
                                                                justifyContent: 'center'
                                                            }}
                                                        />
                                                    ) : (
                                                        value || '-' // Show dash if data is missing
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
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    No students found in this batch.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={students.length} // Count comes from props
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}