"use client";

import { useTransition } from "react";

export function RevalidateButton() {
    const [pending, start] = useTransition();

    async function revalidate() {
        await fetch("/api/revalidate/catalog", { method: "POST" });
    }


    return (
        <button onClick={revalidate} disabled={pending}>
            {pending ? "Revalidating..." : "Revalidate"}
        </button>
    )
}