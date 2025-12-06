import React from "react";
import TaskCard from "./TaskCard";

const StatusSection = ({ tasks = [], status }) => {
  const filteredTasks = tasks.filter(task => task.status === status);
  return (
    <div>
      {filteredTasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default StatusSection;