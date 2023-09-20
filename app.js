const express = require('express');
const mongoose = require('mongoose');
// Importing schemas, routes, and controllers

const employeeRoutes = require('./routes/employeeRoutes');



const app = express();
const port = process.env.PORT || 3000; // port number


//  MongoDB Atlas connection URL
const uri = 'mongodb+srv://khalilladjal:123biboo987e@cluster0.todxuvc.mongodb.net/node-rest-api?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;

// show error
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.use(express.json());

// routing 
app.use('/api/employees', employeeRoutes); 

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
