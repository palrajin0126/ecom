"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";

type Category = {
  categoryName: string;
  images: string[];
};

type Product = {
  id: string; // Add id field to Product type
  name: string;
  image: string;
  price: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoryCollection);
      const categoryList = categorySnapshot.docs.map((doc) => doc.data() as Category);
      setCategories(categoryList);
    };

    const fetchFeaturedProducts = async () => {
      const productCollection = collection(db, "products");
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map((doc) => {
        const productData = doc.data();
        return {
          id: doc.id, // Get the document ID
          name: productData.featuredproductName, // Use productName from the database
          image: productData.images[0], // Access the first image from the array
          price: productData.price,
        } as Product;
      });
      setFeaturedProducts(productList);
    };

    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Home - Discover Top Deals and Categories</title>
        <meta
          name="description"
          content="Explore top deals and categories on our e-commerce platform. Find the best products under ₹699 and today's special deals."
        />
        <meta
          name="keywords"
          content="e-commerce, top deals, categories, best products, affordable prices, today's deals, online shopping"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-8 w-full">
        <div className="container mx-auto py-8">
          <section className="mb-8 relative z-10"> {/* Add z-index to banner */}
            <div className="relative w-full h-64">
              <Image
                src="/banner.jpeg"
                alt="Banner Image"
                layout="fill"
                objectFit="cover"
                className="z-0"
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h2 className="text-4xl font-bold">Under ₹699</h2>
                <button className="ml-4 px-4 py-2 bg-black text-white rounded">Shop Now</button>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link href={`/categories/${category.categoryName}`} key={index}>
                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    <h3 className="font-bold mb-2">{category.categoryName}</h3>
                    {category.images.map((image, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={image}
                        alt={`${category.categoryName} image ${imgIndex + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-24 object-cover bg-gray-200 rounded-md"
                      />
                    ))}
                    <button className="mt-2 text-blue-500">{category.categoryName}</button>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Today's Deals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="cursor-pointer h-48 text-slate-700 bg-gray-200 flex flex-col items-center justify-center rounded-lg shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    <Image
                      src={product.image}
                      alt={`${product.name} image`}
                      width={200}
                      height={200}
                      className="w-full h-24 object-cover bg-gray-200 rounded-md"
                    />
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-sm">Rs {product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/featuredproducts">
              <button className="mt-4 text-blue-500">See all deals</button>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
