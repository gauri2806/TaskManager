const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const path = require('path');
const connectDB = require(path.join(__dirname, 'config', 'db'));

const port = process.env.PORT || 8000; 

console.log("MONGO_URI:", process.env.DB_URI);

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/tasks/', require(path.join(__dirname, 'routes', 'taskRoutes.js')));
app.use("/api/ai", require(path.join(__dirname, 'routes', 'aiRoutes.js')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
