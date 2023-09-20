const express = require('express');
const mongoose = require('mongoose');

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

//  Mongoose schema and model for employees here
const employeeSchema = new mongoose.Schema({
  id: String,
  lastName: String,
  firstName: String,
  dateCreated: Date,
  department: String,
  checkInHistory: [
    {
      timestamp: Date,
      comment: String,
      type: String, // 'check-in' or 'check-out'
    },
  ],
});

const Employee = mongoose.model('Employee', employeeSchema);

// Define your Express routes here
// ...



// post endpoint
app.use(express.json());

app.post('/api/employees', async (req, res) => {
  try {
    const { id, lastName, firstName, dateCreated, department } = req.body;

    // Create a new employee object
    const newEmployee = new Employee({
      id,
      lastName,
      firstName,
      dateCreated,
      department,
    });
    // Save the employee to the database
    try {
      await newEmployee.save();
      console.log('was added');
    } catch (error) {
      console.error(error);
    }
    

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  GET endpoint to retrieve a list of all employees
app.get('/api/employees', async (req, res) => {
  try {
    // Get the "dateCreated" query parameter, if provided
    const dateCreatedParam = req.query.dateCreated;

    // Define a filter object based on the query parameter
    const filter = dateCreatedParam ? { dateCreated: dateCreatedParam } : {};

    // Fetch employees from the database based on the filter
    const employees = await Employee.find(filter);

    res.status(200).json(employees);
       // Log the list of employees (for server-side view)
       console.log(employees);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new employee check-in
app.post('/check-in', async (req, res) => {
  try {
    const { employeeId, comment } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Add the check-in entry to the employee's history
    employee.checkInHistory.push({
      timestamp: new Date(),
      comment,
      type: 'check-in',
    });

    // Save the updated employee document
    await employee.save();

    res.status(201).json({ message: 'Check-in recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new employee check-out
app.post('/check-out', async (req, res) => {
  try {
    const { employeeId, comment } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the last check-in entry for the employee
    const lastCheckInEntry = employee.checkInHistory
      .slice()
      .reverse()
      .find((entry) => entry.type === 'check-in');

    if (!lastCheckInEntry) {
      return res.status(400).json({ error: 'No matching check-in found' });
    }

    // Calculate the time difference between check-in and check-out
    const checkInTime = lastCheckInEntry.timestamp;
    const checkOutTime = new Date();
    const timeDifference = checkOutTime - checkInTime; // in milliseconds

    // Convert the time difference to minutes (or any other desired unit)
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // Add the check-out entry to the employee's history with the calculated duration
    employee.checkInHistory.push({
      timestamp: checkOutTime,
      comment,
      type: 'check-out',
      durationMinutes: minutesDifference,
    });

    // Save the updated employee document
    await employee.save();


    res.status(201).json({ message: 'Check-out recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
