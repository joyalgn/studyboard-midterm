"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/lib/data";

export default function TaskItem({
  task,
  isOwner,
  groupId,
}: {
  task: Task;
  isOwner: boolean;
  groupId: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(task.done);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (!isOwner) return;

    const previous = done;
    const newValue = !previous;

    setDone(newValue);
    setError("");

    const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: newValue }),
    });

    if (!res.ok) {
      setDone(previous);
      setError("Failed to update task");
    }
  }

  async function handleDelete() {
    if (!isOwner) return;

    setIsDeleting(true);
    setError("");

    const res = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setIsDeleting(false);
      setError("Failed to delete task");
      return;
    }

    router.refresh();
  }

  return (
    <li className="flex items-center gap-3 rounded-md border px-3 py-2">
      <input
        type="checkbox"
        checked={done}
        onChange={handleToggle}
        disabled={!isOwner}
        className="h-4 w-4"
      />

      <span className={done ? "line-through text-gray-400" : ""}>
        {task.title}
      </span>

      {isOwner && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-auto rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  );
}