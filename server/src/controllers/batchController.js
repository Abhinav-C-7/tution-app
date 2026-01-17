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
};
