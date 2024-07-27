import prisma from '@/../../lib/prisma';
import { authAdmin } from '@/../../lib/firebaseAdmin';

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const orders = await prisma.customerOrder.findMany({
            where: { userId },
            select: {
                orderNumber: true,
                customerName: true,
                apartment: true,
                block: true,
                locality: true,
                city: true,
                state: true,
                pincode: true,
                email: true,
                mobile: true,
                orderTotal: true,
                orderItems: true,
            },
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
