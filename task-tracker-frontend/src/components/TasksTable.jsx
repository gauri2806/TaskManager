import React, {useState, useEffect} from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, IconButton, Typography } from "@mui/material";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { API_URL } from "../config.js";
import {OPENAI_API_URL} from "../config.js";
import AddTask from "./AddTask.jsx";
import VoiceInput from "./VoiceInput.jsx";
import AddIcon from "@mui/icons-material/Add";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [aiGeneratedTask, setAIGeneratedTask] = useState(null);
  const [openAddTask, setOpenAddTask] = useState(false);

  const sendToAI = async (text) => {
    try {
      setOpenAddTask(false)
      setAIGeneratedTask(null)
      const res = await axios.post(OPENAI_API_URL, { text });
      const aiTask = res.data;
      console.log("AI returned:", aiTask);
      setAIGeneratedTask(aiTask);
      setOpenAddTask(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoiceSubmit = (text) => {
    sendToAI(text);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <>
    <Box display='flex' spacing={6} alignItems="center" justifyContent="space-between" sx={{mt: 3, mb: 1, mx: 'auto', maxWidth: '70%'}}>
        <Typography variant="h3" gutterBottom>All Tasks</Typography>
         <Button
        onClick={() => {
          setAIGeneratedTask(null)
          setOpenAddTask(true)
        }}
        variant="outlined"
        color="primary"
        size="large"
        sx={{ width: "150px" }}
        endIcon={<AddIcon />}
      >
        Add Task
      </Button>

       
        <VoiceInput onSubmit={handleVoiceSubmit}/>
    </Box>
    
    <TableContainer component={Paper} sx={{mt: 3, maxWidth: '70%', marginLeft: 'auto', marginRight: 'auto'}}>

      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const id = task._id;
            const dueDate = new Date(task.dueDate);

            return (
            <TableRow key={id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell sx={{
                textTransform: 'capitalize'
              }} >{task.status}</TableCell>
              <TableCell sx={{
                textTransform: 'capitalize'
              }}>{task.priority}</TableCell>
              <TableCell>{dueDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <EditTask task={task} onTaskUpdated={fetchTasks} />
                <DeleteTask task={task} onTaskDeleted={fetchTasks} />
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    {openAddTask && <AddTask onSuccess={fetchTasks} task={aiGeneratedTask} onClose={() => setOpenAddTask(false)}/> }
     
    </>
  );
}