"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="w-full px-6 py-6 flex flex-col items-center gap-4">
        {/* ICONS */}
        <div className="flex gap-6 text-neutral-400">
          <motion.a
            href="https://github.com/awmoha"
            target="_blank"
            whileHover={{ y: -2 }}
            className="hover:text-white"
          >
            <Github size={20} />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/mohammad-awad-03b619201/"
            target="_blank"
            whileHover={{ y: -2 }}
            className="hover:text-white"
          >
            <Linkedin size={20} />
          </motion.a>

          <motion.a
            href="mailto:mohammad.awad0110@gmail.com"
            whileHover={{ y: -2 }}
            className="hover:text-white"
          >
            <Mail size={20} />
          </motion.a>
        </div>

        {/* COPYRIGHT */}
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} Moha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
