"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/app/firebase"; // Adjust the import according to your project structure
import { doc, getDoc } from "firebase/firestore";
import ProductsLayout from "./ProductsLayout";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Head from "next/head";

type Product = {
  productName: string;
  images: string[];
  price: string;
  marketPrice: string; // Changed from discountedPrice to marketPrice
  brand: string;
  description: string;
  stock: number;
  deliveryInfo: string;
  emi: string;
  seller: string;
};

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const productDoc = doc(db, "products", productId as string);
          const productSnapshot = await getDoc(productDoc);
          if (productSnapshot.exists()) {
            setProduct(productSnapshot.data() as Product);
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserUUID(user.uid);
      } else {
        setUserUUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const idToken = await user.getIdToken(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId, idToken: idToken }), // Make sure productId is in the body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Product added to cart:", data.cart);

      // Display confirmation dialog
      if (confirm("Product added to cart. Click OK to view your cart.")) {
        router.push("/Cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Loading Product Details.....</div>;
  }

  return (
    <>
      <Head>
        <title>{product.productName} - Product Details</title>
        <meta
          name="description"
          content={`Buy ${product.productName} from our e-commerce platform. Explore product details, prices, and special offers.`}
        />
        <meta
          name="keywords"
          content="e-commerce, product details, buy online, best prices, special offers"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <ProductsLayout>
        <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold mb-4 text-black">
              {product.productName}
            </h1>
            <div className="mb-4">
              <div className="group relative block overflow-hidden">
                <button className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75">
                  <span className="sr-only">Wishlist</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  useKeyboardArrows
                  autoPlay
                >
                  {product.images.map((imageUrl, index) => (
                    <div key={index}>
                      <Image
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        width={600}
                        height={600}
                        layout="responsive"
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="relative border border-gray-100 bg-white p-6">
              <span className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs font-medium">
                New
              </span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {product.productName}
              </h3>
              <p className="mt-1.5 text-sm text-gray-700">
                Price: {product.price}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                Market Price: {product.marketPrice}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                Brand: {product.brand}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                Description: {product.description}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                Delivery Info : {product.deliveryInfo}
              </p>
              <p className="mt-1.5 text-sm text-gray-700">
                Seller: {product.seller}
              </p>
            </div>
            <button
              onClick={addToCart}
              className="block w-full rounded bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </ProductsLayout>
    </>
  );
}
