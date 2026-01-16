// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getStudents, addStudent } = require('../controllers/studentController');

router.get('/', getStudents);   // GET /api/students
router.post('/', addStudent);   // POST /api/students

module.exports = router;