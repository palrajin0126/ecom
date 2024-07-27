import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from './SessionProvider';

const inter = Inter({ subsets: ["latin"] });

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider> 
        <Navbar />
        {children} 
      </SessionProvider> 
  );
}