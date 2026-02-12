"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  images: string[] | null;
  tech: string[] | null;
  category: "web" | "security";
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<"all" | "web" | "security">("all");

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, link, images, tech, category")
        .order("created_at", { ascending: false });

      if (data) setProjects(data as Project[]);
    };

    loadProjects();
  }, []);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold mb-8">Projects</h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded border ${
            activeCategory === "all"
              ? "bg-neutral-900 text-white"
              : "border-neutral-800 text-neutral-400"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveCategory("web")}
          className={`px-4 py-2 rounded border ${
            activeCategory === "web"
              ? "bg-neutral-900 text-white"
              : "border-neutral-800 text-neutral-400"
          }`}
        >
          Web Development
        </button>

        <button
          onClick={() => setActiveCategory("security")}
          className={`px-4 py-2 rounded border ${
            activeCategory === "security"
              ? "bg-neutral-900 text-white"
              : "border-neutral-800 text-neutral-400"
          }`}
        >
          Cybersecurity
        </button>
      </div>

      {/* PROJECT GRID */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="border border-neutral-800 rounded-lg overflow-hidden block hover:bg-neutral-900 transition"
          >
            {p.images?.[0] && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={p.images[p.images.length - 1]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold text-lg">{p.title}</h2>
              <p className="text-sm text-neutral-400 mt-2">
                {p.description}
              </p>

              {p.tech && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tech.map((t: string) => (
                    <li
                      key={t}
                      className="text-xs px-2 py-1 rounded border border-neutral-800 text-neutral-400"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
