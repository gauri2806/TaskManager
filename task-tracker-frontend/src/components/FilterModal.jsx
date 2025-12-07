import { Modal, Typography, Button, Box, TextField, Autocomplete } from "@mui/material";
import React, { useState } from "react";

export default function FilterModal({ onSubmit }) {
    const statusOptions = ['to do', 'in progress', 'completed']
    const priorityOptons = ['low', 'medium', 'high']
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 3,
    };
    const [open, setOpen] = React.useState(false);
    const [statusFilters, setStatusFilters] = useState([])
    const [priorityFilters, setPriorityFilters] = useState([])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const clearFilters = () => {
        setStatusFilters([]);
        setPriorityFilters([]);
        onSubmit([], [])
      };
    return (
        <>
            <Button onClick={handleOpen} sx={{ width: "80px", p: 0.5, m: 0.5, textTransform: 'capitalize', height: '40px' }} variant="contained">Filters</Button>
                        <Button sx={{
                          width: '120px',
                          textTransform: 'capitalize',
                        }}
                        onClick={clearFilters}
                        >Clear Filters</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography id="modal-modal-title" color="primary" variant="h6" component="h2" sx={{ m: 2, p: 2 }}>
                            Apply Filters
                        </Typography>
                        <Autocomplete
                            fullWidth
                            sx={{ m: 1, p: 1 }}
                            multiple
                            id="status-autocomplete"
                            options={statusOptions}
                            value={statusFilters}
                            onChange={(e, newValue) => setStatusFilters(newValue)}
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Status"
                                    placeholder="Status"
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                />
                            )}
                        />

                        <Autocomplete
                            fullWidth
                            sx={{ m: 1, p: 1 }}
                            multiple
                            id="priority-autocomplete"
                            options={priorityOptons}
                            value={priorityFilters}
                            onChange={(e, newValue) => setPriorityFilters(newValue)}
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Priority"
                                    placeholder="Priority"
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                />
                            )}
                        />

                        <Box sx={{ display: 'flex', alignItems: "center" }}>
                            <Button variant="outlined" sx={{ m: 2 }} onClick={handleClose}>Close</Button>
                            <Button variant="contained" sx={{ m: 2 }}
                                onClick={() => { onSubmit(statusFilters, priorityFilters); handleClose(); }}>
                                Apply Filters
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}