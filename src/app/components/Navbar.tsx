"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const baseLink =
    "relative px-4 py-2 rounded-md text-sm transition text-neutral-400 hover:text-white";

  return (
    <nav className="border-b border-neutral-800 relative">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="font-bold tracking-tight">
          Full stack developer and cybersecutity student
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex gap-2 text-sm">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={baseLink}>
              {item.label}

              {/* ANIMATED UNDERLINE */}
              <AnimatePresence>
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-3 right-3 -bottom-1 h-[2px] bg-white rounded-full"
                  />
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-neutral-300 hover:text-white"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-6 pb-4 space-y-2"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`${baseLink} block ${
                  isActive(item.href)
                    ? "text-white"
                    : "hover:bg-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
