import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, TextField, Button,
    Stack, Divider, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, DialogContentText, List, ListItem,
    ListItemText, ListItemIcon, ListItemButton, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import api from '../../api/axios';
import BatchTable from './BatchTable';

const BatchSettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);

    // Dialog States
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');

    const [manageStudentsOpen, setManageStudentsOpen] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');

    const [deleteStudentId, setDeleteStudentId] = useState(null);

    const [deleteBatchOpen, setDeleteBatchOpen] = useState(false);
    const [deleteConfirmStep, setDeleteConfirmStep] = useState(1);
    const [confirmName, setConfirmName] = useState('');

    // --- Fetch Data ---
    const fetchData = async () => {
        try {
            const res = await api.get(`/batches/${id}`);
            setBatch(res.data);
            setStudents(res.data.students || []);
        } catch (error) {
            console.error("Failed to load batch", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // --- Handlers ---

    // 1. Rename Batch
    const handleRenameSubmit = async () => {
        try {
            setLoading(true);
            await api.put(`/batches/${id}`, { name: newName });
            await fetchData();
            setRenameDialogOpen(false);
        } catch (error) {
            console.error("Rename failed", error);
            alert("Rename failed");
        } finally {
            setLoading(false);
        }
    };

    const openRenameDialog = () => {
        setNewName(batch.name);
        setRenameDialogOpen(true);
    };

    // 2. Remove Student
    const confirmRemoveStudent = (studentId) => {
        setDeleteStudentId(studentId);
    };

    const handleRemoveStudent = async () => {
        if (!deleteStudentId) return;
        try {
            await api.delete(`/students/${deleteStudentId}`);
            setStudents(prev => prev.filter(s => s.id !== deleteStudentId));
            setDeleteStudentId(null);
        } catch (error) {
            console.error("Remove student failed", error);
            alert("Failed to remove student");
        }
    };

    // 3. Delete Batch
    const handleDeleteBatch = async () => {
        try {
            await api.delete(`/batches/${id}`);
            navigate('/batches');
        } catch (error) {
            console.error("Delete batch failed", error);
            alert("Failed to delete batch");
        }
    };

    // --- Derived Data ---
    const filteredStudents = students.filter(s =>
        (s.name?.toLowerCase() || "").includes(studentSearchQuery.toLowerCase()) ||
        (s.phone || "").includes(studentSearchQuery)
    );

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 150 },
        { id: 'phone', label: 'Phone', minWidth: 120 },
        {
            id: 'id',
            label: 'Action',
            minWidth: 100,
            align: 'right',
            format: (value) => (
                <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        confirmRemoveStudent(value);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    if (!batch) return <Typography m={4}>Loading...</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: '0', pb: 4, alignItems: 'start' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom mb={3}>
                Settings
            </Typography>

            <Card variant="outlined">
                <List sx={{ p: 0 }}>
                    {/* Rename Option */}
                    <ListItemButton onClick={openRenameDialog} divider>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Rename Batch"
                            secondary={`Current Name: ${batch.name}`}
                        />
                        <ChevronRightIcon color="action" />
                    </ListItemButton>

                    {/* Manage Students Option */}
                    <ListItemButton onClick={() => setManageStudentsOpen(true)} divider>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Manage Students"
                            secondary="Remove students from this batch"
                        />
                        <ChevronRightIcon color="action" />
                    </ListItemButton>

                    {/* Delete Batch Option */}
                    <ListItemButton
                        onClick={() => {
                            setDeleteConfirmStep(1);
                            setConfirmName('');
                            setDeleteBatchOpen(true);
                        }}
                        sx={{
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.lighter' } // Custom hover if needed, or default
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Delete Batch"
                            secondary="Permanently delete this batch and all data"
                            primaryTypographyProps={{ color: 'error.main', fontWeight: 'bold' }}
                        />
                    </ListItemButton>
                </List>
            </Card>

            {/* --- Dialogs --- */}

            {/* Rename Dialog */}
            <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Rename Batch</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Batch Name"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRenameSubmit} variant="contained" disabled={loading || !newName.trim()}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Manage Students Dialog */}
            <Dialog
                open={manageStudentsOpen}
                onClose={() => setManageStudentsOpen(false)}
                fullWidth
                maxWidth="md"
                scroll="paper"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    Manage Students
                    <TextField
                        placeholder="Search in this list..."
                        size="small"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 250 }}
                    />
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <BatchTable
                        students={filteredStudents}
                        columns={studentColumns}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setManageStudentsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Student Remove Confirmation (Nested Dialog) */}
            <Dialog open={!!deleteStudentId} onClose={() => setDeleteStudentId(null)}>
                <DialogTitle>Remove Student?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this student? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteStudentId(null)}>Cancel</Button>
                    <Button onClick={handleRemoveStudent} color="error" variant="contained">Remove</Button>
                </DialogActions>
            </Dialog>

            {/* Batch Delete Confirmation */}
            <Dialog
                open={deleteBatchOpen}
                onClose={() => setDeleteBatchOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {deleteConfirmStep === 1 ? 'Delete Batch?' : 'Final Confirmation'}
                </DialogTitle>
                <DialogContent>
                    {deleteConfirmStep === 1 ? (
                        <DialogContentText>
                            This will delete <b>{batch.name}</b> and ALL its data (students, fees, attendance). Are you sure you want to proceed?
                        </DialogContentText>
                    ) : (
                        <Stack spacing={2}>
                            <DialogContentText>
                                To confirm, please type <b>{batch.name}</b> below:
                            </DialogContentText>
                            <TextField
                                fullWidth
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder={batch.name}
                                autoFocus
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteBatchOpen(false)}>Cancel</Button>
                    {deleteConfirmStep === 1 ? (
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => setDeleteConfirmStep(2)}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            color="error"
                            variant="contained"
                            disabled={confirmName !== batch.name}
                            onClick={handleDeleteBatch}
                        >
                            Delete Forever
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default BatchSettings;