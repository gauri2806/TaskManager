const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

// @desc   Get Tasks
// @route  GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
});

// @desc   Get Task
// @route  GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }else {
        res.status(200).json(task);
    }
});

// @desc   Add Task
// @route  POST /api/tasks
const addTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate
    });
    res.status(201).json(task);
});

// @desc   Update Task
// @route  PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
});

// @desc   Delete Task
// @route  DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask
};
