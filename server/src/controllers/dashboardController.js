

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
    try {
        // 1. Run all 3 queries in parallel for speed
        const [studentCount, batchCount, pendingCount] = await Promise.all([
            prisma.student.count(),
            prisma.batch.count(),
            prisma.student.count({
                where: { feeStatus: 'Pending' }
            })
        ]);

        // 2. Send the numbers back
        res.json({
            totalStudents: studentCount,
            totalBatches: batchCount,
            pendingFees: pendingCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};
module.exports = { getDashboardStats };