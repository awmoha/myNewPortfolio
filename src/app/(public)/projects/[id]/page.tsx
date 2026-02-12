"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { notFound, useParams } from "next/navigation";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  images: string[] | null;
  tech: string[] | null;
};


export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // lightbox state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!params?.id) return;

    const loadProject = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, link, images,tech")
        .eq("id", params.id)
        .maybeSingle();

      if (!data) {
        notFound();
        return;
      }

      setProject(data);
      setLoading(false);
    };

    loadProject();
  }, [params.id]);

  if (loading || !project) return null;

const displayImages = project.images
  ? [...project.images].reverse()
  : [];
  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {project.title}
        </h1>

        <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl">
          {project.description}
        </p>
        {project.tech && (
          <section className="mb-8 mt-6">
            <h3 className="text-sm font-semibold text-neutral-300 mb-2">
              Tech stack
            </h3>

            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="text-xs px-3 py-1 rounded-full border border-neutral-800 text-neutral-400"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}
      </header>

      {/* IMAGE GRID */}
      {/* {project.images && project.images.length > 0 && (
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-12">
          {project.images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="overflow-hidden rounded-lg border border-neutral-800"
            >
              <img
                src={img}
                alt={`${project.title} image ${i + 1}`}
                className="w-full h-full object-cover cursor-pointer"
              />
            </button>
          ))}
        </section>
      )} */}
      {project.images && project.images.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
{displayImages.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="group overflow-hidden rounded-lg border border-neutral-800"
            >
              <img
                src={img}
                alt={`${project.title} image ${i + 1}`}
                loading="lazy"
                className="
            w-full h-56 object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
              />
            </button>
          ))}
        </section>
      )}

      {/* LINK */}
      {project.link?.trim() && (
  <div className="mt-8 flex justify-center">
    <motion.a
      href={project.link}
      target="_blank"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="inline-block border border-neutral-700 px-6 py-3 rounded-lg text-sm"
    >
      View project
    </motion.a>
  </div>
)}


      {/* LIGHTBOX */}
      {open && project.images && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
slides={displayImages.map((src) => ({ src }))}
        />
      )}
    </main>
  );
}
