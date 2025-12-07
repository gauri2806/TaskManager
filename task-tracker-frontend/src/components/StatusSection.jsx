import React from "react";
import TaskCard from "./TaskCard";
import { Box } from "@mui/material";

const StatusSection = ({ tasks = [], status, onTaskUpdated, onTaskDeleted  }) => {
  const style = {
  width: "50%",
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 3,
};
  const filteredTasks = tasks.filter(task => task.status === status);
  return (
    <Box sx={{style}}>
      {filteredTasks.map(task => (
        <TaskCard key={task._id} task={task} onTaskUpdated={onTaskUpdated} onTaskDeleted={onTaskDeleted} />
      ))}
    </Box>
  );
};

export default StatusSection;