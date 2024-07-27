// pages/categories/[categoryName].tsx
"use client";

import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import CategoriesLayout from './CategoriesLayout';
import Head from 'next/head';

type Product = {
  id: string;
  productName: string;
  images: string[];
  price: string;
  brand: string;
};

const CategoryPage = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      const productCollection = collection(db, 'products');
      const q = query(productCollection, where('category', '==', categoryName));
      const productSnapshot = await getDocs(q);

      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        productName: doc.data().productName,
        images: doc.data().images,
        price: doc.data().price,
        brand: doc.data().brand,
      }));

      setProducts(productList);
      setFilteredProducts(productList);

    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const filterProducts = (productsToFilter: Product[]) => {
    let filtered = productsToFilter;
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filtered = filtered.filter((product) => Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1]);
    }
    if (brandFilter !== '') {
      filtered = filtered.filter((product) => product.brand === brandFilter);
    }
    setFilteredProducts(filtered);
  };

  const handlePriceChange = (event: any, newValue: number[]) => {
    setPriceRange(newValue);
    filterProducts(products);
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrandFilter(event.target.value);
    filterProducts(products);
  };

  return (
    <>
      <Head>
        <title>{categoryName} - Category Page</title>
        <meta
          name="description"
          content={`Explore a wide range of products in the ${categoryName} category. Find the best deals and offers on your favorite brands.`}
        />
        <meta
          name="keywords"
          content={`e-commerce, ${categoryName}, buy online, best prices, special offers`}
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <CategoriesLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-black">Category: {categoryName}</h1>

          {/* Filter Options */}
          <div className="mb-4">
            {/* ... your price and brand filter components ... */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-md p-4 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out" // Tailwind classes for card styling
              >
                <div className="relative h-48">
                  {product.images.length > 0 && (
                    <Image
                      src={product.images[0]}
                      alt={`Product image ${product.productName}`}
                      fill
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="px-4 py-2"> {/* Add padding to content within card */}
                  <h3 className="text-lg font-bold mt-2 text-black">{product.productName}</h3>
                  <p className="text-gray-600 font-bold">Price: Rs {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CategoriesLayout>
    </>
  );
};

export default CategoryPage;
