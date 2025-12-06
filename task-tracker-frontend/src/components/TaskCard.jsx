import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

const TaskCard = ({ task }) => {
  if (!task) return null;
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "";
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {task.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
          <Chip label={task.priority} sx={{ textTransform: "capitalize" }} />
          <Chip label={`Due: ${dueDate}`} color="default" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;