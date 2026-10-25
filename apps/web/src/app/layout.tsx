import React from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BRAND_NAME } from "@naqshlab/shared";

export const metadata = {
  title: `${BRAND_NAME} — Me'moriy Tiklash, Kashi va Ganch Muhandisligi`,
  description:
    "Tarixiy obidalarni tiklash, arxitektura va hashamatli loyihalar uchun an'anaviy kashi (mayolika) va ganch o'ymakorligining sertifikatlangan, metrik yuqori aniqlikdagi me'moriy ashyolari.",
  keywords: "Archeon, me'moriy restavratsiya, kashi, ganch, mayolika, girih, islimi, Samarqand kashisi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz-Latn">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
