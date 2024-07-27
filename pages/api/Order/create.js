import prisma from '@/../../lib/prisma';
import { getAuth } from 'firebase-admin/auth';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        customerName,
        apartment,
        block,
        locality,
        city,
        state,
        pincode,
        email,
        mobile,
        paymentMethod,
        idToken,
    } = req.body;

    try {
        const auth = getAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Fetch cart items
        const cart = await prisma.cart.findFirst({
            where: { userId: userId },
        });

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create order
        const order = await prisma.customerOrder.create({
            data: {
                userId: userId,
                customerName: customerName,
                apartment: apartment,
                block: block,
                locality: locality,
                city: city,
                state: state,
                pincode: pincode,
                email: email,
                mobile: mobile,
                orderTotal: cart.totalCartValue,
                orderItems: cart.products,
                orderNumber: `ORD-${Date.now()}`,
                seller: '',
                quantity: 0,
                amount: cart.totalCartValue,
                providerReferenceId: '',
                merchantId: '',
                transactionId: '',
                providerId: '',
                responseCode: '',
            },
        });

        // Clear the cart
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                products: [],
                totalCartValue: 0,
                isPaid: false,
            },
        });

        res.status(200).json({ orderId: order.id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
