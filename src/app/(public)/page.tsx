"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="px-6 py-25">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT – TEXT (vänsterjusterad) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Hi, I’m Moha.
            </h1>
            <p className="text-xl text-neutral-400 mb-6">
              Full-stack developer and Cybersecurity & Digital Forensics student
              based in Sweden.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-10 max-w-xl">
              Hi, I’m Moha, a Cybersecurity and Digital Forensics student based
              in southern Sweden, close to nature and the west coast. The calm
              environment gives me focus, creativity, and clarity in how I
              approach complex problems. With roots in the Middle East and a
              life shaped by the Scandinavian mindset of balance and structure,
              I bring a unique perspective to technology and security. My work
              focuses on building secure systems, forensic tools, and modern web
              applications where security, integrity, and reliability are not
              afterthoughts, they are the foundation. My goal is simple: to
              create solutions that actually matter in the real world.
            </p>

            <p className="text-neutral-500 leading-relaxed mb-10 max-w-xl">
              Working with: HTML5, CSS3, JavaScript, TS, React.js & React.Native
              & Redux, Next.js, SQL, PgAdmin, Docker, Node.js, Github & GitLab,
              and good skills in C#
            </p>

            <div className="flex gap-4">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-900"
                >
                  View projects
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-3 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-900"
                >
                  Contact
                </motion.button>
              </Link>
            </div>
          </motion.section>

          {/* RIGHT – IMAGE (höger, inte centrerad) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex justify-end"
          >
            <img
              src="/moha.jpg"
              alt="Cybersecurity illustration"
              className="w-full max-w-md rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
