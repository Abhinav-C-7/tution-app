// controllers/studentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get all students
const getStudents = async (req, res) => {
    try {
        // Fetch students AND their batch details
        const students = await prisma.student.findMany({
            include: { batch: true }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

// 2. Add a new student
const addStudent = async (req, res) => {
    const { name, parentName, parentPhone, batchId } = req.body;

    try {
        const newStudent = await prisma.student.create({
            data: {
                name,
                parentName,
                parentPhone,
                batchId: parseInt(batchId) // Ensure this is a number
            }
        });
        res.json(newStudent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add student" });
    }
};

module.exports = { getStudents, addStudent };