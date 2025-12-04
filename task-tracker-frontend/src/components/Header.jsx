import React from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddTask from "./AddTask.jsx";

export default function Header() {
  return (

<Stack direction="row" spacing={6} alignItems="center" justifyContent="center">
  <Typography variant="h3" gutterBottom>All Tasks</Typography>
  <AddTask />
</Stack>

  );
}