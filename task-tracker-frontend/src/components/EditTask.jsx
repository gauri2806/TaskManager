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
  MenuItem,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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

export default function EditTask({ task, onTaskUpdated }) {
  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description);
  const [status, setStatus] = React.useState(task.status || "");
  const [priority, setPriority] = React.useState(task.priority || "");
  const [dueDate, setDueDate] = React.useState(
    task.dueDate?.$date?.substring(0, 10) || task.dueDate?.substring(0,10) || ""
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title,
      description,
      status,
      priority,
      dueDate,
    };

    try {
      await axios.put(`${API_URL}/${task._id.$oid || task._id}`, updatedTask);
      if (onTaskUpdated) onTaskUpdated(); 
      handleClose();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <>
      <IconButton
        aria-label="edit"
        color="primary"
        size="small"
        style={{ marginRight: "8px" }}
        onClick={handleOpen}
      >
        ✎
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Edit Task
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
