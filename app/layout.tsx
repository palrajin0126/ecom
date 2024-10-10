import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from "../SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopStrider - Best Quality Electronics, Mobiles, Books & Groceries",
  description:
    "ShopStrider is your one-stop marketplace for the best quality electronics, mobile phones, books, and groceries at unbeatable prices. Discover amazing deals and top-notch products that guarantee satisfaction.",
  keywords:
    "ShopStrider, electronics, mobiles, books, groceries, best quality, cheapest prices, online shopping, eCommerce, buy electronics online, buy books online, grocery deals",
  openGraph: {
    title: "ShopStrider - Quality Electronics, Mobiles, Books & Groceries",
    description:
      "Shop the best deals on electronics, mobiles, books, and groceries at ShopStrider. We offer top-quality products at the most affordable prices. Satisfaction guaranteed!",
    url: "https://www.shopstrider.com",
    siteName: "ShopStrider",
    images: [
      {
        url: "https://github.com/palrajin0126/ecom/blob/main/public/logo.jpeg", // Replace with an actual image URL
        width: 1200,
        height: 630,
        alt: "ShopStrider - Best Deals on Electronics and More",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#4CAF50", // Use a brand-appropriate color
  alternates: {
    canonical: "https://www.shopstrider.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="w-full">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
