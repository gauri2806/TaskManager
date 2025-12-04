import * as React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import { API_URL } from "../config"; 

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

function convertToInputDate(dateStr) {
  const [d, m, y] = dateStr.split("-");
  return `${y}-${m}-${d}`;
}

export default function AddTask({ onSuccess , task, onClose}) {
  const [title, setTitle] = React.useState( task?.title || ''); 
  const [dueDate, setDueDate] = React.useState(task?.dueDate ? convertToInputDate(task?.dueDate) : new Date().toISOString().substring(0, 10));
  const [description, setDescription] = React.useState(task?.description || '');
  const [status, setStatus] = React.useState(task?.status || 'to do');
  const [priority, setPriority] = React.useState( task?.priority || 'medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      status,
      priority,
      dueDate
    };

    try {
      const response = await axios.post(API_URL, newTask);
      console.log("Task added:", response.data);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  return (
    <div>
     
      <Modal open={true} onClose={onClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography id="modal-title" variant="h5" fontWeight={600} mb={3}>
            Add New Task
          </Typography>

          <Stack spacing={3}>
            <TextField name="title" label="Title" variant="outlined" required onChange={(e => setTitle(e.target.value))} value={title} />

            <TextField
              name="description"
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              onChange={(e => setDescription(e.target.value))}
              value={description}
            />

            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
                
              >
                <MenuItem value="to do">To Do</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              onChange={(e => setDueDate(e.target.value))}
              value={dueDate}
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" variant="contained" size="large">
                Add Task
              </Button>
            </Box>

          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
