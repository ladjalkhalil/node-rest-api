// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Define your routes using the router object
router.post('/api/employees', employeeController.createEmployee);
router.get('/api/employees', employeeController.getEmployees);
router.post('/check-in', employeeController.checkIn);
router.post('/check-out', employeeController.checkOut);

module.exports = router;
