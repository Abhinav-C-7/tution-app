const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addPayment = async (req, res) => {
    try {
        const { studentId, batchId, amount, date, remarks, feeRequestId } = req.body;

        const payment = await prisma.payment.create({
            data: {
                amount: parseInt(amount),
                date: new Date(date),
                remarks,
                studentId: parseInt(studentId),
                batchId: parseInt(batchId),
                feeRequestId: parseInt(feeRequestId)
            }
        });



        // Update StudentFee status for this specific request
        // First find the StudentFee record
        const studentFeeRecord = await prisma.studentFee.findUnique({
            where: {
                studentId_feeRequestId: {
                    studentId: parseInt(studentId),
                    feeRequestId: parseInt(feeRequestId)
                }
            }
        });

        if (studentFeeRecord) {
            // Recalculate total paid for this REQUEST
            // We need to fetch payments linked to this feeRequestId
            const requestPayments = await prisma.payment.findMany({
                where: {
                    studentId: parseInt(studentId),
                    feeRequestId: parseInt(feeRequestId)
                }
            });

            const totalPaidForRequest = requestPayments.reduce((sum, p) => sum + p.amount, 0);

            // Get the FeeRequest amount to check if full
            const feeRequest = await prisma.feeRequest.findUnique({ where: { id: parseInt(feeRequestId) } });

            let newStatus = 'Pending';
            if (totalPaidForRequest >= feeRequest.amount) {
                newStatus = 'Paid';
            } else if (totalPaidForRequest > 0) {
                newStatus = 'Partial';
            }

            await prisma.studentFee.update({
                where: { id: studentFeeRecord.id },
                data: {
                    status: newStatus,
                    amountPaid: totalPaidForRequest
                }
            });

            // Also return the new status
            res.json({ payment, newStatus });
        } else {
            // Fallback if odd state
            res.json({ payment });
        }


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
