import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip'; // 1. Import Chip for the Status Badge

// 2. Define the Columns for Student Data
const columns = [
    { id: 'name', label: 'Student Name', minWidth: 170 },
    { id: 'phone', label: 'Phone Number', minWidth: 120 },
    { id: 'parent_name', label: 'Parent Name', minWidth: 170 },
    {
        id: 'fee_status',
        label: 'Fee Status',
        minWidth: 100,
        align: 'center' // Center the status badge
    },
];

function createData(name, phone, parent_name, fee_status) {
    return { name, phone, parent_name, fee_status };
}

// 3. Your 10 Student Records
const rows = [
    createData('Rahul Sharma', '9876543210', 'Amit Sharma', 'Paid'),
    createData('Priya Verma', '9123456789', 'Suresh Verma', 'Pending'),
    createData('Aditya Singh', '9988776655', 'Rajesh Singh', 'Paid'),
    createData('Sneha Gupta', '8877665544', 'Anil Gupta', 'Overdue'),
    createData('Mohammed Ayan', '7766554433', 'Imran Khan', 'Paid'),
    createData('Rohan Mehta', '9898989898', 'Vikram Mehta', 'Pending'),
    createData('Ishita Patel', '9000011111', 'Jignesh Patel', 'Paid'),
    createData('Kavya Reddy', '8555522222', 'Satish Reddy', 'Paid'),
    createData('Arjun Nair', '7000080000', 'Mohan Nair', 'Overdue'),
    createData('Simran Kaur', '9111122222', 'Harpreet Singh', 'Pending'),
];

export default function StudentTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // 4. Helper to choose Color based on Status
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
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: '#f5f5f5' }} // Made Header Bold
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.phone}> {/* Using Phone as Unique Key */}
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>

                                                    {/* 5. Special Logic: If column is "fee_status", show a Chip */}
                                                    {column.id === 'fee_status' ? (
                                                        <Chip
                                                            label={value}
                                                            color={getStatusColor(value)}
                                                            size="small"
                                                            variant="filled"
                                                            sx={{
                                                                width: '90px',
                                                                justifyContent: 'center'
                                                            }} // "outlined" looks good too
                                                        />
                                                    ) : (
                                                        value
                                                    )}

                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}