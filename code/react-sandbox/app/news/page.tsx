import Link from "next/link";
import RevalidateButton from "./_components/RevalidateButton";

export const revalidate = 0; // disable page cache; we’ll control per-fetch data cache

type HNHit = {
    objectID: string;
    title: string;
    url: string;
    author: string;
    points: number;
}

async function getFrontPage() {
    const res = await fetch(
        "https://hn.algolia.com/api/v1/search?tags=front_page",
        { next: { revalidate: 60, tags: ["hn:front"]}}
    );

    if (!res.ok) throw new Error("Failed to fetch HN front page");
    const data = await res.json();

    return data.hits as HNHit[];
}

export default async function NewsPage() {
    const hits = await getFrontPage();

    return (
        <main className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Hacker News — Front Page</h1>
            <RevalidateButton />
          </div>
    
          <ul className="space-y-3">
            {hits.map((h) => (
              <li key={h.objectID} className="rounded-lg border p-4">
                <div className="font-medium">
                  <Link href={`/news/${h.objectID}`} className="underline">
                    {h.title || "Untitled"}
                  </Link>
                </div>
                <div className="text-sm opacity-75">
                  {h.points} points · by {h.author}
                </div>
                {h.url && (
                  <a href={h.url} target="_blank" rel="noreferrer" className="text-sm underline">
                    external link
                  </a>
                )}
              </li>
            ))}
          </ul>
        </main>
    );
}