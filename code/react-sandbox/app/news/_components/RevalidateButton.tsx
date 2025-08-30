"use client";

import { useTransition } from "react";

export default function RevalidateButton() {
  const [pending, start] = useTransition();

  async function hit() {
    await fetch("/api/revalidate/hn-front", { method: "POST" });
  }

  return (
    <button
      onClick={() => start(hit)}
      disabled={pending}
      className="rounded-md border px-3 py-2"
    >
      {pending ? "Refreshing…" : "Revalidate (tag)"}
    </button>
  );
}
