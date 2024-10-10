"use client";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState<null | User>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDropdownOpen) {
      timer = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isDropdownOpen]);

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* SEO Meta Tags */}
        <title>
          Shop Electronics, Mobiles, Grocery, and Books - Amazing Deals!
        </title>
        <meta
          name="description"
          content="Your one-stop-shop for electronics, mobiles, grocery, and books. Get exclusive deals on Apple iPhones, PC parts, grocery items, and books for competitive exams!"
        />
        <meta
          name="keywords"
          content="electronics, mobiles, grocery, books, Apple iPhones, PC parts, competitive exam books, grocery deals, online shopping"
        />
        <meta name="author" content="Your Company Name" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags for Social Media Sharing */}
        <meta
          property="og:title"
          content="Shop Electronics, Mobiles, Grocery, and Books - Amazing Deals!"
        />
        <meta
          property="og:description"
          content="Exclusive deals on Apple iPhones, PC parts, grocery items, and books for competitive exams. Shop electronics, mobiles, groceries, and books online."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yourwebsite.com" />
        <meta
          property="og:image"
          content="https://www.yourwebsite.com/path-to-image.jpg"
        />
        <meta property="og:site_name" content="Your E-Commerce Store" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Shop Electronics, Mobiles, Grocery, and Books - Amazing Deals!"
        />
        <meta
          name="twitter:description"
          content="Get the best deals on Apple iPhones, PC parts, grocery items, and books for competitive exams!"
        />
        <meta
          name="twitter:image"
          content="https://www.yourwebsite.com/path-to-image.jpg"
        />
        <meta name="twitter:site" content="@yourcompany" />
        <meta name="twitter:creator" content="@yourcompany" />

        {/* Canonical Tag for SEO */}
        <link rel="canonical" href="https://www.yourwebsite.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <header className="bg-white shadow">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/cv_6.jpeg"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-bold text-black">
              {!user && (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="transition hover:text-black/75"
                    >
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/policy"
                      className="transition hover:text-black/75"
                    >
                      Policy
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="/account"
                  className="transition hover:text-black/75"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-black/75"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/Cart" className="transition hover:text-black/75">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/Order" className="transition hover:text-black/75">
                  Orders
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation & User Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDropdown}
              className="md:hidden block rounded bg-gray-100 p-2.5 text-black transition hover:text-black/75"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* User Auth & Dropdown Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="hidden md:block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:inline-block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden md:inline-block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-bold text-teal-600 transition hover:text-teal-600/75"
                  >
                    Register
                  </Link>
                </>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <nav className="p-4">
                    <ul className="space-y-2 text-black font-bold">
                      {!user ? (
                        <>
                          <li>
                            <Link
                              href="/login"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Login
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/signup"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Register
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link
                              href="/account"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/contact"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/Cart"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Cart
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/Order"
                              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75"
                            >
                              Orders
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 rounded-lg px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black/75"
                            >
                              Logout
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
