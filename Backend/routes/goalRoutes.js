const express = require('express');
const router = express.Router();
const path = require('path');
const { getGoals, setGoal, updateGoal, deleteGoal } = require(path.join('../controllers', 'goalControllers.js')); 

// router.get('/', getGoals);

// router.post('/', setGoal);

// router.put('/:id', updateGoal);

// router.delete('/:id', deleteGoal);

router.route('/')
    .get(getGoals)
    .post(setGoal);

router.route('/:id')
    .put(updateGoal)
    .delete(deleteGoal);

module.exports = router;