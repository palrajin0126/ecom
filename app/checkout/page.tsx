"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

type FormFields = {
    customerName: string;
    apartment: string;
    block: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    email: string;
    mobile: string;
    paymentMethod: string;
};

export default function Checkout() {
    const [form, setForm] = useState<FormFields>({
        customerName: '',
        apartment: '',
        block: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
        email: '',
        mobile: '',
        paymentMethod: 'cash-on-delivery', // Default to cash-on-delivery
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('User is not authenticated');
            }

            const idToken = await user.getIdToken(true);

            const response = await axios.post('/api/Order/create', {
                ...form,
                idToken,
            });

            router.push(`/Order`);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(form).map((key) => (
                    key !== 'paymentMethod' && (
                        <div key={key} className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                                type="text"
                                name={key}
                                value={form[key as keyof FormFields]}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )
                ))}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash-on-delivery"
                            checked={form.paymentMethod === 'cash-on-delivery'}
                            onChange={handleChange}
                            className="form-radio"
                        />
                        <span className="ml-2 text-slate-700">Cash on Delivery</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Place Order
                </button>
            </form>
        </div>
    );
}
