const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addPayment = async (req, res) => {
    try {
        const { studentId, batchId, amount, date, remarks } = req.body;

        const payment = await prisma.payment.create({
            data: {
                amount: parseInt(amount),
                date: new Date(date),
                remarks,
                studentId: parseInt(studentId),
                batchId: parseInt(batchId)
            }
        });



        const batch = await prisma.batch.findUnique({ where: { id: parseInt(batchId) } });
        const batchFee = batch.fee;

        // Calculate total payments for this student
        const allPayments = await prisma.payment.findMany({
            where: {
                studentId: parseInt(studentId),
                batchId: parseInt(batchId)
            }
        });

        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

        let newStatus = 'Pending';
        if (totalPaid >= batchFee) {
            newStatus = 'Paid';
        } else if (totalPaid > 0) {
            newStatus = 'Partial';
        }

        // Update student status
        await prisma.student.update({
            where: { id: parseInt(studentId) },
            data: { feeStatus: newStatus }
        });

        res.json({ payment, newStatus });

    } catch (error) {
        console.error("Error adding payment:", error);
        res.status(500).json({ error: 'Failed to add payment' });
    }
};

const getBatchPayments = async (req, res) => {
    try {
        const { batchId } = req.params;
        const payments = await prisma.payment.findMany({
            where: { batchId: parseInt(batchId) },
            include: {
                student: {
                    select: { name: true, id: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

const getStudentPayments = async (req, res) => {
    try {
        const { studentId } = req.params;
        const payments = await prisma.payment.findMany({
            where: { studentId: parseInt(studentId) },
            orderBy: { date: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        console.error("Error fetching student payments:", error);
        res.status(500).json({ error: 'Failed to fetch student payments' });
    }
};

module.exports = {
    addPayment,
    getBatchPayments,
    getStudentPayments
};
