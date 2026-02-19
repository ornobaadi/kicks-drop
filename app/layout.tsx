import type { Metadata } from "next";
import { Rubik, Open_Sans } from "next/font/google";
import { ReduxProvider } from "@/store/Provider";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-sans" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-body" });

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
    <html lang="en" className={`${rubik.variable} ${openSans.variable}`}>
      <body className="antialiased font-sans">
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
