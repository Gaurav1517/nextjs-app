"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_URL } from "@/constants/constants";

export default function AddTopic() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("Active");
  const [priority, setPriority] = useState("Medium");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    try {
      const res = await fetch(`${SITE_URL}/api/topics`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, author, category, status, priority }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to create a topic");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />

      <input
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Author Name"
      />

      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        className="border border-slate-500 px-8 py-2"
      >
        <option value="General">General</option>
        <option value="Technology">Technology</option>
        <option value="Business">Business</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <select
        onChange={(e) => setStatus(e.target.value)}
        value={status}
        className="border border-slate-500 px-8 py-2"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Archived">Archived</option>
      </select>

      <select
        onChange={(e) => setPriority(e.target.value)}
        value={priority}
        className="border border-slate-500 px-8 py-2"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <button
        type="submit"
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
      >
        Add Topic
      </button>
    </form>
  );
}
