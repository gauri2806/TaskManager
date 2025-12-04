const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title']
        },
        description: {
            type: String,
        },
        status: { //"To Do", "In Progress", "Completed"
            type: String,
            required: true,
            default: 'To Do'
        },
        priority: { //"Low", "Medium", "High
            type: String,
            default: 'Medium'
        },
        dueDate: {
            type: Date
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Task', taskSchema);