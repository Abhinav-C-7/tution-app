const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const clerkAuth = ClerkExpressRequireAuth();

const injectTenant = async (req, res, next) => {
    if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ error: 'Unauthorized - No Auth Data' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: req.auth.userId },
            include: {
                tenants: {
                    select: { tenantId: true }
                }
            }
        });

        if (!user) {
            console.error(`User not found for Clerk ID: ${req.auth.userId}`);
            return res.status(401).json({ error: 'User not found in system' });
        }

        if (user.tenants && user.tenants.length > 0) {
            // Assume single tenant context for now based on user's first tenant
            req.tenantId = user.tenants[0].tenantId;
            next();
        } else {
            console.error(`No tenant found for User ID: ${user.id}`);
            return res.status(403).json({ error: 'No tenant associated with user' });
        }
    } catch (error) {
        console.error('Error in injectTenant middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = [clerkAuth, injectTenant];
