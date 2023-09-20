// schemas/employee.js
const mongoose = require('mongoose');


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

module.exports = mongoose.model('Employee', employeeSchema);
