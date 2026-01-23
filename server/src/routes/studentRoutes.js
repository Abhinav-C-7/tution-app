const express = require('express');
const router = express.Router();
const { getStudents, addStudent, updateStudent } = require('../controllers/studentController');

router.get('/', getStudents);
router.post('/', addStudent);
router.put('/:id', updateStudent);
module.exports = router;