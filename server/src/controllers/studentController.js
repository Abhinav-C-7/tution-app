const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: { tenantId: req.tenantId },
            include: { batch: true }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
};

const addStudent = async (req, res) => {
    const { name, dob, phone, parentName, parentPhone, batchId } = req.body;

    try {
        const newStudent = await prisma.student.create({
            data: {
                name,
                dob: new Date(dob),
                phone,
                parentName,
                parentPhone,
                parentPhone,
                batchId: parseInt(batchId),
                tenantId: req.tenantId
            }
        })
        res.json(newStudent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add student" });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { discount } = req.body;

        const updateData = {};
        if (discount !== undefined) updateData.discount = parseInt(discount);

        const student = await prisma.student.update({
            where: { id: parseInt(id), tenantId: req.tenantId },
            data: updateData,
        });
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update student" });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.student.delete({
            where: { id: parseInt(id), tenantId: req.tenantId }
        });
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete student" });
    }
};

module.exports = { getStudents, addStudent, updateStudent, deleteStudent };