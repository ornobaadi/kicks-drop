import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/store/Provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "KICKS — Premium Sneakers & Athletic Footwear",
  description:
    "Shop the latest sneakers and athletic footwear at KICKS. Free shipping & returns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
