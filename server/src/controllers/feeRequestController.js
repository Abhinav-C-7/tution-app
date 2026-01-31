const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new fee request
// @route   POST /api/feerequests
// @access  Public
const createFeeRequest = async (req, res) => {
    const { name, amount, dueDate, batchId } = req.body;

    // Basic validation
    if (!name || !amount || !dueDate || !batchId) {
        return res.status(400).json({ message: 'Please provide name, amount, dueDate, and batchId' });
    }

    try {
        const newFeeRequest = await prisma.feeRequest.create({
            data: {
                name,
                amount,
                dueDate,
                batch: {
                    connect: { id: batchId }
                },
                tenant: {
                    connect: { id: req.tenantId }
                }
            }
        });

        // This is a crucial step: Create a StudentFee record for every student in the batch
        const studentsInBatch = await prisma.student.findMany({
            where: { batchId: batchId, tenantId: req.tenantId }
        });

        for (const student of studentsInBatch) {
            await prisma.studentFee.create({
                data: {
                    studentId: student.id,
                    feeRequestId: newFeeRequest.id,
                    status: 'Pending',
                    amountPaid: 0,
                    tenantId: req.tenantId
                }
            });
        }

        res.status(201).json(newFeeRequest);
    } catch (error) {
        console.error("Error creating fee request:", error);
        res.status(500).json({ message: 'Server error while creating fee request.' });
    }
};

// @desc    Get all fee requests for a batch
// @route   GET /api/feerequests/batch/:batchId
// @access  Public
const getFeeRequestsByBatch = async (req, res) => {
    const { batchId } = req.params;

    try {
        const feeRequests = await prisma.feeRequest.findMany({
            where: { batchId: parseInt(batchId), tenantId: req.tenantId },
            include: {
                studentFees: {
                    include: {
                        student: {
                            select: { id: true, name: true, parentName: true, phone: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(feeRequests);
    } catch (error) {
        console.error("Error fetching fee requests:", error);
        res.status(500).json({ message: 'Server error while fetching fee requests.' });
    }
};

module.exports = {
    createFeeRequest,
    getFeeRequestsByBatch
};