"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  images: string[] | null;
  tech: string[] | null;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<"projects" | "add" | "messages">(
    "projects",
  );
  const [messages, setMessages] = useState<Message[]>([]);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // create / edit
  const [category, setCategory] = useState<"web" | "security">("web");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [techInput, setTechInput] = useState("");
  const [tech, setTech] = useState<string[]>([]);

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  // edit state
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // list projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* ---------------- LOAD PROJECTS ---------------- */

  const loadProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, description, link, images,tech")
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
  };

  useEffect(() => {
    if (session) loadProjects();
  }, [session]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, name, email, message, created_at,read")
      .order("created_at", { ascending: false });

    if (data) setMessages(data);
  };
  useEffect(() => {
    if (session && activeView === "messages") {
      loadMessages();
    }
  }, [session, activeView]);

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
  };
  const handleMarkAsRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);

    loadMessages();
  };

  /* ---------------- CREATE / UPDATE ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // UPDATE (edit)
    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update({
          title,
          description,
          link,
          tech,
          category,
        })
        .eq("id", editingProject.id);

      setLoading(false);

      if (error) {
        alert("Fel vid uppdatering");
        return;
      }

      setEditingProject(null);
      setTitle("");
      setDescription("");
      setLink("");
      setTech([]);
      setTechInput("");
      setFiles(null);
      loadProjects();
      setSuccessMessage("Project updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    // CREATE (new)
    if (!files || files.length === 0) {
      alert("Välj minst en bild");
      setLoading(false);
      return;
    }

    const imageUrls: string[] = [];

    for (const file of Array.from(files)) {
      const safeFileName = file.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.-]/g, "");
      const filePath = `${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        alert("Fel vid bilduppladdning");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("projects").getPublicUrl(filePath);

      imageUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("projects").insert({
      title,
      description,
      link,
      images: imageUrls,
      tech,
      category,
      published: true,
    });

    setLoading(false);

    if (error) {
      alert("Fel vid sparande");
      return;
    }

    setTitle("");
    setDescription("");
    setLink("");
    setTech([]);
    setTechInput("");
    setFiles(null);
    loadProjects();
    setSuccessMessage("Project published successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (project: Project) => {
    if (!confirm("Delete project?")) return;

    if (project.images?.length) {
      const paths = project.images.map((url) => {
        const parts = url.split("/");
        return parts[parts.length - 1];
      });
      await supabase.storage.from("projects").remove(paths);
    }

    await supabase.from("projects").delete().eq("id", project.id);
    loadProjects();
  };

  /* ---------------- UI ---------------- */

  // NOT LOGGED IN
  if (!session) {
    return (
      <main className="p-6 max-w-sm">
        <h1 className="text-3xl font-bold mb-6">Admin login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="border px-4 py-2 rounded w-full">Login</button>
        </form>
      </main>
    );
  }

  // LOGGED IN
  return (
    <main className="p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 underline"
        >
          Logga ut
        </button>
      </div>
      <nav className="flex gap-4 mb-8">
        <button onClick={() => setActiveView("projects")} className="underline">
          Projects
        </button>
        <button onClick={() => setActiveView("add")} className="underline">
          Add project
        </button>
        <button onClick={() => setActiveView("messages")} className="underline">
          Messages
        </button>
      </nav>

      {/* CREATE / EDIT */}
      {activeView === "add" && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <h2 className="text-xl font-semibold">
            {editingProject ? "Edit project" : "Add project"}
          </h2>

          <input
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Tech stack (comma separated)"
            value={techInput}
            onChange={(e) => {
              setTechInput(e.target.value);
              setTech(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              );
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "web" | "security")}
            className="w-full bg-black border border-neutral-800 p-2 rounded"
          >
            <option value="web">Web development</option>
            <option value="security">Cybersecurity / Forensics</option>
          </select>

          <textarea
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full bg-black border border-neutral-800 p-2 rounded"
            placeholder="Project link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          {!editingProject && (
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                console.log(e.target.files);
                setFiles(e.target.files);
              }}
            />
          )}
          {files && (
            <p className="text-xs text-neutral-400">
              {files.length} files selected
            </p>
          )}

          <button disabled={loading} className="border px-4 py-2 rounded">
            {editingProject ? "Update" : "Publish"}
          </button>
          {successMessage && (
            <p className="text-sm text-green-400">{successMessage}</p>
          )}
        </form>
      )}

      {/* LIST */}
      {activeView === "projects" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>

          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id} className="border border-neutral-800 rounded p-3">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-neutral-400">{p.description}</div>

                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => {
                      setEditingProject(p);
                      setTitle(p.title);
                      setDescription(p.description);
                      setLink(p.link || "");
                    }}
                    className="text-sm underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    className="text-sm text-red-400 underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {activeView === "messages" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Messages</h2>

          {messages.length === 0 ? (
            <p className="text-neutral-400">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`border border-neutral-800 rounded p-4 ${
                    !m.read ? "bg-neutral-900" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-neutral-400">
                        {new Date(m.created_at).toLocaleString()}
                      </div>

                      <div
                        className={`font-semibold ${!m.read ? "font-bold" : ""}`}
                      >
                        {m.name}
                      </div>
                      <div className="text-sm">{m.email}</div>
                    </div>

                    {!m.read && (
                      <span className="text-xs text-blue-400">Unread</span>
                    )}
                  </div>

                  <p className="mt-3 text-neutral-300 whitespace-pre-line">
                    {m.message}
                  </p>

                  <div className="mt-3 flex gap-4">
                    {!m.read && (
                      <button
                        onClick={() => handleMarkAsRead(m.id)}
                        className="text-sm underline"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="text-sm text-red-400 underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
