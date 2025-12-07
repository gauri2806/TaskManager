import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Chip, BottomNavigation} from "@mui/material";
import axios from "axios";
import { API_URL } from "../config.js";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted}) => {
    
    if (!task) return null;
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "";
    return (
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        {task.title}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {task.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
                    <Chip label={task.priority} sx={{ textTransform: "capitalize" }} />
                    <Chip label={`Due: ${dueDate}`} color="default" />
                </Box>
            </CardContent>
            <BottomNavigation>
                <EditTask key={task._id + '-edit'} task={task} onTaskUpdated={onTaskUpdated} />
                <DeleteTask key={task._id + '-delete'} task={task} onTaskDeleted={onTaskDeleted} />
            </BottomNavigation>
        </Card>
    );
};

export default TaskCard;