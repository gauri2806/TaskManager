import * as React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "../config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  textAlign: "center",
};

export default function DeleteTask({ task, onTaskDeleted }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${task._id.$oid || task._id}`);
      if (onTaskDeleted) onTaskDeleted(); 
      handleClose();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <>
      <IconButton aria-label="delete" color="error" size="small" onClick={handleOpen}>
        🗑
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" fontWeight={600}>
            Delete Task
          </Typography>

          <Typography mt={2} mb={3}>
            Are you sure you want to delete the task <b>"{task.title}"</b>?
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
