const express = require('express');
const router = express.Router();
const path = require('path');
const { getTasks, getTask, addTask, updateTask, deleteTask } = require(path.join('../controllers', 'taskControllers.js')); 

// router.get('/', getGoals);

// router.post('/', setGoal);

// router.put('/:id', updateGoal);

// router.delete('/:id', deleteGoal);

router.route('/')
    .get(getTasks)
    .post(addTask);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;