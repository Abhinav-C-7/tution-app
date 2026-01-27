const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getBatchAttendance = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { date } = req.query;

        const whereClause = {
            batchId: parseInt(batchId)
        };

        if (date) {


            const targetDate = new Date(date);
            const nextDay = new Date(targetDate);
            nextDay.setDate(targetDate.getDate() + 1);

            whereClause.date = {
                gte: targetDate,
                lt: nextDay
            };
        }

        const attendance = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        res.json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};


const markBatchAttendance = async (req, res) => {
    try {
        const { batchId, date, records } = req.body;
        // records: [{ studentId, status }]

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ error: 'Invalid records format' });
        }

        const formattedDate = new Date(date);


        const operations = records.map(record => {


            return prisma.attendance.create({
                data: {
                    batchId: parseInt(batchId),
                    studentId: record.studentId,
                    date: formattedDate,
                    status: record.status
                }
            });
        });



        await prisma.$transaction([
            prisma.attendance.deleteMany({
                where: {
                    batchId: parseInt(batchId),
                    date: {
                        equals: formattedDate

                    },
                    studentId: {
                        in: records.map(r => r.studentId)
                    }
                }
            }),
            ...operations
        ]);

        res.json({ message: 'Attendance marked successfully' });

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
};

module.exports = {
    getBatchAttendance,
    markBatchAttendance
};
