import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Card,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { API_URL } from "../config.js";
import { OPENAI_API_URL } from "../config.js";
import AddTask from "./AddTask.jsx";
import VoiceInput from "./VoiceInput.jsx";
import AddIcon from "@mui/icons-material/Add";
import FilterModal from "./FilterModal.jsx";
import StatusSection from "./StatusSection.jsx";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [aiGeneratedTask, setAIGeneratedTask] = useState(null);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [alignment, setAlignment] = React.useState('listView');

  const [value, setValue] = useState("");
  useEffect(() => {
    const delay = setTimeout(() => {}, 400);
    return () => clearTimeout(delay);
  }, [value]);

  const sendToAI = async (text) => {
    try {
      setGeneratingTasks(true);
      setOpenAddTask(false);
      setAIGeneratedTask(null);
      const res = await axios.post(OPENAI_API_URL, { text });
      const aiTask = res.data;
      console.log("AI returned:", aiTask);
      setAIGeneratedTask(aiTask);
      setOpenAddTask(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingTasks(false);
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

  const getFilters = (statusFilters, priorityFilters) => {
    setStatusFilters(statusFilters);
    setPriorityFilters(priorityFilters);
  }

  const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const isPassingPriotityAndStatusFilter = (priorityFilters?.length === 0 || priorityFilters?.includes(task?.priority)) && (statusFilters?.length === 0 || statusFilters?.includes(task?.status))
    if(!isPassingPriotityAndStatusFilter) return false;

    if(!value) return true; 

    const temp = value.toLowerCase();
    return (
      (task.title || "").toLowerCase().includes(temp) ||
      (task.description || "").toLowerCase().includes(temp)
    );
  }), [priorityFilters, statusFilters, value, tasks]) 

  const sortedTasks = sortOrder === "none"
    ? filteredTasks
    : [...filteredTasks].sort((a, b) => {
      if (sortOrder === "dueDateAsc") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortOrder === "dueDateDesc") {
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });

    const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      {generatingTasks && (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        display="flex"
        spacing={6}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 3, mb: 1, mx: "auto", maxWidth: "70%" }}
      >
        <Typography variant="h5" gutterBottom>
          All Tasks
        </Typography>
        
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mt: 3, maxWidth: "70%", marginLeft: "auto", marginRight: "auto" }}
      >
        <Card sx={{ p: 2, boxShadow: "none" }}>
          <Box display="flex" gap={2} alignItems='center'>
            <Box display="flex" alignItems="center">
              <Button
              onClick={() => {
                setAIGeneratedTask(null);
                setOpenAddTask(true);
              }}
              variant="contained"
              color="primary"
              size="medium"
              sx={{ width: "150px", p:1, m:1 }}
              endIcon={<AddIcon />}
            >
              Add Task
            </Button>

            <VoiceInput onSubmit={handleVoiceSubmit} />
            </Box>

            <TextField
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search task with title or description"
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                m: 2,
                maxWidth: "20rem"
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box display="flex" alignItems="center">  
              <TextField placeholder="Due Date" select size="small" SelectProps={{ native: true }} 
              sx={{borderRadius: 2, m: 1, minWidth: "150px" }} value={sortOrder} label='Sort By'
                onChange={e => setSortOrder(e.target.value)}>
                <option value="none">Due Date</option>
                <option value="dueDateAsc">Due Date (Ascending)</option>
                <option value="dueDateDesc">Due Date (Descending)</option>
              </TextField>
            </Box>

            <FilterModal  onSubmit={getFilters}/>
            
            <Button sx={{
              width: '120px',
              textTransform: 'capitalize',
            }}
            onClick={clearFilters}
            >Clear Filters</Button>
          </Box>
          <Box>

            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChangeAlignment}
              aria-label="Platform"
              size="small"
            >
              <ToggleButton value="listView">List View</ToggleButton>
              <ToggleButton value="kanbanView">Kanban View</ToggleButton>
            </ToggleButtonGroup>

          </Box>
        </Card>
        {alignment === 'listView' && <Table aria-label="simple table">
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
            {sortedTasks.map((task) => {
              const id = task._id;
              const dueDate = new Date(task.dueDate);

              return (
                <TableRow key={id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {task.status}
                  </TableCell>
                  <TableCell
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {task.priority}
                  </TableCell>
                  <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <EditTask task={task} onTaskUpdated={fetchTasks} />
                    <DeleteTask task={task} onTaskDeleted={fetchTasks} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>}
        {alignment === 'kanbanView' && (
          <Box display="flex" flexDirection="row" gap={2} sx={{ mt: 2 }}>
            <Box flex={1}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>To Do</Typography>
              <StatusSection tasks={sortedTasks} status="to do" />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>In Progress</Typography>
              <StatusSection tasks={sortedTasks} status="in progress" />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>Completed</Typography>
              <StatusSection tasks={sortedTasks} status="completed" />
            </Box>
          </Box>
        )}
      </TableContainer>
      
      {openAddTask && (
        <AddTask
          onSuccess={fetchTasks}
          task={aiGeneratedTask}
          onClose={() => setOpenAddTask(false)}
        />
      )}
    </>
  );
}
