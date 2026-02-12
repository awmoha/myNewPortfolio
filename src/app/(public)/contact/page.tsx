"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      name,
      email,
      message,
    });

    setLoading(false);

    if (error) {
      alert("Something went wrong");
      return;
    }

    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="px-6 pt-8 pb-24">
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              <input
                className="w-full bg-black border border-neutral-800 p-2 rounded"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                className="w-full bg-black border border-neutral-800 p-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <textarea
                className="w-full bg-black border border-neutral-800 p-2 rounded"
                placeholder="Message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.04 } : undefined}
                whileTap={!loading ? { scale: 0.97 } : undefined}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`
                  inline-block px-6 py-3 rounded-lg text-sm
                  border border-neutral-700
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-900"}
                `}
              >
                {loading ? "Sending..." : "Send"}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-8"
            >
              <h2 className="text-2xl font-semibold mb-2">Thank you</h2>
              <p className="text-neutral-400">
                Your message has been sent successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
