import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// src/app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
