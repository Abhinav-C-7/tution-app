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


const getBatchDetails = async (req, res) => {
    try {
        const { id } = req.params;


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
        const { name, subjects, schedule, fee, admissionFee, billingCycle, customDuration } = req.body;
        const batch = await prisma.batch.create({
            data: {
                name,
                subjects,
                schedule,
                fee: fee ? parseInt(fee) : 0,
                admissionFee: admissionFee ? parseInt(admissionFee) : 0,
                billingCycle,
                customDuration: customDuration ? parseInt(customDuration) : null
            },
        });
        res.json(batch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create batch' });
    }
};

const updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subjects, schedule, fee, admissionFee, billingCycle, customDuration } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (subjects) updateData.subjects = subjects;
        if (schedule) updateData.schedule = schedule;
        if (fee !== undefined) updateData.fee = parseInt(fee);
        if (admissionFee !== undefined) updateData.admissionFee = parseInt(admissionFee);
        if (billingCycle) updateData.billingCycle = billingCycle;
        if (customDuration !== undefined) updateData.customDuration = customDuration ? parseInt(customDuration) : null;

        const batch = await prisma.batch.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.json(batch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update batch' });
    }
};

module.exports = {
    getBatches,
    createBatch,
    getBatchDetails,
    updateBatch
};
