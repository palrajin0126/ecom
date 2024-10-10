"use client";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CategoriesLayout from "./CategoriesLayout";
import Head from "next/head";
import { db } from "@/app/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type Product = {
  id: string;
  productName: string;
  images: string[];
  price: number;
  brand: string;
};

const CategoryPage = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      const productCollection = collection(db, "products");
      const q = query(productCollection, where("category", "==", categoryName));
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

  const filterProducts = () => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [minPrice, maxPrice, searchQuery]);

  const handleSearch = () => {
    router.push(`/searchProduct?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Ensure categoryName is a string and provide a default value if it's undefined
  const pageTitle = categoryName
    ? `${categoryName} - Category Page`
    : "Category Page";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore a wide range of products in the ${categoryName || ""} category. Find the best deals and offers on your favorite products.`}
        />
        <meta
          name="keywords"
          content={`e-commerce, ${categoryName || ""}, buy online, best prices, special offers`}
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <CategoriesLayout>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="flex flex-col sm:flex-row justify-between items-center">
              <h2 className="text-xl font-bold text-black sm:text-3xl">
                Product Collection
              </h2>
              <div className="mt-4 sm:mt-0 flex space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="px-4 py-2 border rounded-md text-black font-bold"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition"
                >
                  Search
                </button>
              </div>
            </header>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group block overflow-hidden border p-4 rounded-lg"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-[200px] sm:h-[250px]">
                      {product.images && product.images.length > 0 && (
                        <Image
                          src={product.images[0]} // Display the first image
                          alt={product.productName}
                          layout="fill"
                          objectFit="contain" // Ensures the image fits within the box
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="pt-3">
                      <h3 className="text-sm text-black font-bold">
                        {product.productName}
                      </h3>
                      <p className="mt-2 text-black font-bold">
                        Rs {product.price}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </CategoriesLayout>
    </>
  );
};

export default CategoryPage;
