"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const baseLink =
    "relative px-4 py-2 rounded-md text-sm transition duration-300 text-neutral-400 hover:text-green-700 hover:drop-shadow-[0_0_6px_#22c55e]";

  return (
<nav className="sticky top-0 z-50 bg-black border-b border-neutral-800">      <div className="w-full px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-mono">
            <span className="text-green-700">&lt;</span>
            Moha<span className="text-green-700">mm</span>ad
            <span className="text-green-700"> /&gt;</span>
          </span>

          <span className="text-sm text-green-700 font-mono">
            Fullstack developer and cyber security student
          </span>
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
                    className="absolute left-3 right-3 -bottom-1 h-[2px] bg-green-700 rounded-full shadow-[0_0_6px_#22c55e]"
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
                  isActive(item.href) ? "text-white" : "hover:bg-neutral-900"
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
