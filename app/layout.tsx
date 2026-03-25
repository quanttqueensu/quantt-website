import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
  description:
    "Bridging academic research and industry practice through collaboration, research, and real-world application in quantitative finance.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
    description:
      "Bridging academic research and industry practice in quantitative finance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} scroll-smooth`}>
      <body className="font-body antialiased">
        <Navbar />
        <AnnouncementPopup />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
