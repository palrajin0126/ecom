"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaShoppingCart } from 'react-icons/fa';

type CartProduct = {
    productId: string;
    quantity: number;
    productName: string;
    price: number;
    images: string[];
};

type Cart = {
    products: CartProduct[];
    totalCartValue: number;
};

export default function Cart() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    setUserId(user.uid);
                } else {
                    setUserId(null);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
                router.push('/login');
            }
        };
        fetchUserId();
    }, [router]);

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                if (userId) {
                    const auth = getAuth();
                    const user = auth.currentUser;
                    const idToken = user ? await user.getIdToken(true) : null;
                    const response = await axios.get(`/api/cart`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`
                        }
                    });
                    const cartData = response.data;

                    const productDetailsPromises = cartData.products.map(
                        async (product: CartProduct) => {
                            const productDoc = doc(db, 'products', product.productId);
                            const productSnap = await getDoc(productDoc);
                            return productSnap.exists()
                                ? {
                                    ...product,
                                    ...(productSnap.data() as CartProduct),
                                }
                                : null;
                        }
                    );

                    const productsWithDetails = (
                        await Promise.all(productDetailsPromises)
                    ).filter(Boolean) as CartProduct[];

                    setCart({
                        ...cartData,
                        products: productsWithDetails,
                    });
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const idToken = user ? await user.getIdToken(true) : null;

            await axios.delete(`/api/cart`, {
                data: {
                    productId,
                    idToken
                }
            });

            setCart((prevCart) => {
                if (!prevCart) return prevCart;

                const updatedProducts = prevCart.products.filter(
                    (product) => product.productId !== productId
                );

                const totalCartValue = updatedProducts.reduce(
                    (total, item) => total + item.quantity * parseFloat(item.price.toString()),
                    0
                );

                return {
                    ...prevCart,
                    products: updatedProducts,
                    totalCartValue: totalCartValue,
                };
            });
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const idToken = user ? await user.getIdToken(true) : null;

            await axios.put(`/api/cart`, {
                productId,
                quantity,
                idToken,
            });

            setCart((prevCart) => {
                if (!prevCart) return prevCart;

                const updatedProducts = prevCart.products.map((product) =>
                    product.productId === productId
                        ? { ...product, quantity }
                        : product
                );

                const totalCartValue = updatedProducts.reduce(
                    (total, item) => total + item.quantity * parseFloat(item.price.toString()),
                    0
                );

                return {
                    ...prevCart,
                    products: updatedProducts,
                    totalCartValue: totalCartValue,
                };
            });
        } catch (error) {
            console.error('Error updating product quantity:', error);
        }
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cart || cart.products.length === 0) {
        return <div>Your cart is empty</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cart.products.map((product) => (
                <div key={product.productId} className="flex items-center mb-4 p-4 border rounded-lg shadow-md">
                    {product.images && product.images.length > 0 && (
                        <Image
                            src={product.images[0]}
                            alt={product.productName}
                            width={100}
                            height={100}
                            className="mr-4"
                        />
                    )}
                    <div className="flex-grow">
                        <h2 className="text-lg font-semibold">{product.productName}</h2>
                        <p className="text-gray-600">Price: Rs {product.price}</p>
                        <div className="flex items-center mt-2">
                            <button
                                className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
                                onClick={() => handleUpdateQuantity(product.productId, product.quantity - 1)}
                                disabled={product.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="mx-2 text-slate-700">{product.quantity}</span>
                            <button
                                className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
                                onClick={() => handleUpdateQuantity(product.productId, product.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() => handleRemoveFromCart(product.productId)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex justify-end items-center mt-4 p-4 border-t border-gray-200">
                <h2 className="text-slate-700 font-bold mr-4">Total: Rs {cart.totalCartValue}</h2>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
