import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: "Moha – Fullstack Developer & Cybersecurity",
  description:
    "Cybersecurity and Digital Forensics student based in Sweden. Focused on secure systems, forensic tools, and modern web applications.",

  openGraph: {
    title: "Moha – Cybersecurity & Digital Forensics",
    description:
      "Building secure systems, forensic tools, and modern web applications with a real-world security mindset.",
    url: "https://din-domän.se",
    siteName: "Moha Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moha – Cybersecurity & Digital Forensics",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "Moha – Cybersecurity & Digital Forensics",
  //   description:
  //     "Cybersecurity and Digital Forensics portfolio focused on secure systems and real-world problem solving.",
  //   images: ["/og-image.png"],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
    ${geistSans.className}
    antialiased
    min-h-screen
    flex
    flex-col
  `}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
