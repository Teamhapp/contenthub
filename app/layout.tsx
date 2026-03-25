import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "The Digital Atelier - Premium Content Marketplace",
  description: "A high-end marketplace for premium digital assets, insightful content, and the visionaries who build them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased min-h-screen flex flex-col bg-[#faf8ff] text-[#151b29]`}>
        <Providers>
          <Navbar />
          <div className="flex-1 pt-14">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
