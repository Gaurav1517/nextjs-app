"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_URL } from "@/constants/constants";

export default function EditTopicForm({ id, title, description, author, category, status, priority }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newAuthor, setNewAuthor] = useState(author);
  const [newCategory, setNewCategory] = useState(category);
  const [newStatus, setNewStatus] = useState(status);
  const [newPriority, setNewPriority] = useState(priority);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription, newAuthor, newCategory, newStatus, newPriority }),
      });

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Title"
      />

      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Topic Description"
      />

      <input
        onChange={(e) => setNewAuthor(e.target.value)}
        value={newAuthor}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Author Name"
      />

      <select
        onChange={(e) => setNewCategory(e.target.value)}
        value={newCategory}
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
        onChange={(e) => setNewStatus(e.target.value)}
        value={newStatus}
        className="border border-slate-500 px-8 py-2"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Archived">Archived</option>
      </select>

      <select
        onChange={(e) => setNewPriority(e.target.value)}
        value={newPriority}
        className="border border-slate-500 px-8 py-2"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
        Update Topic
      </button>
    </form>
  );
}
