"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    const res = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setIsDeleting(false);
      setError("Failed to delete group");
      return;
    }

    router.push("/groups");
    router.refresh();
  }

  return (
    <div>
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        className="whitespace-nowrap rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
      >
        {isDeleting ? "Deleting..." : "Delete Group"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}