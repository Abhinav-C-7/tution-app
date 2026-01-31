const { Webhook } = require('svix');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const handleWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send('Error occured -- no svix headers');
    }

    // Get the body (raw buffer → string)
    const payload = req.body;
    const body = payload.toString('utf8');

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).send('Error occured');
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, username } = evt.data;
        const email = email_addresses[0].email_address;
        const name =
            first_name && last_name
                ? `${first_name} ${last_name}`
                : username || email;

        const tenantName =
            username || email.split('@')[0] || name.replace(/\s+/g, '-').toLowerCase();

        try {
            // Create Tenant
            const tenant = await prisma.tenant.create({
                data: {
                    name: tenantName,
                }
            });

            // Create User
            const user = await prisma.user.create({
                data: {
                    clerkId: id,
                    email: email,
                    name: name,
                }
            });

            // Create Relation
            await prisma.userTenantRole.create({
                data: {
                    userId: user.id,
                    tenantId: tenant.id,
                    role: 'ADMIN',
                }
            });

            console.log(`User ${email} and Tenant ${tenantName} created successfully.`);
        } catch (error) {
            console.error('Error saving user/tenant to database:', error);
            return res.status(500).json({ error: 'Database error' });
        }
    }

    return res.status(200).json({
        success: true,
        message: 'Webhook received'
    });
};

module.exports = { handleWebhook };
