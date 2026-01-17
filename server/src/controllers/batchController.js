const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();



const getBatches = async (req, res) => {
    try {
        const batches = await prisma.batch.findMany({
            include: {
                _count: {
                    select: { students: true }
                }
            }
        });
        res.json(batches);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch batches' });
    }
};

// Replaces getBatchStudents
const getBatchDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch Batch AND Students together
        const batch = await prisma.batch.findUnique({
            where: {
                id: parseInt(id) // 👈 IMPORTANT: Convert string to number
            },
            include: {
                students: true   // 👈 The "Backpack": Include the student list
            }
        });

        // 2. Handle case where batch doesn't exist
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        res.json(batch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch batch details' });
    }
};

const createBatch = async (req, res) => {
    try {
        const { name, fee, subjects, schedule } = req.body;
        const batch = await prisma.batch.create({
            data: { name, fee, subjects, schedule },
        });
        res.json(batch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create batch' });
    }
};

module.exports = {
    getBatches,
    createBatch,
    getBatchDetails
};
