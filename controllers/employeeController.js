// controllers/employeeController.js
const Employee = require('../schemas/employee');
// Importing schemas, routes, and controllers
const Employee = require('./schemas/employee');


// Function to create a new employee
exports.createEmployee = async (req, res) => {
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
      console.log('Employee was added');
    } catch (error) {
      console.error(error);
    }

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//  GET endpoint to retrieve a list of all employees
exports.getEmployees = async (req, res) => {
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
};

// Function to handle employee check-in
exports.checkIn = async (req, res) => {
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
};

// Function to handle employee check-out
exports.checkOut = async (req, res) => {
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
};
