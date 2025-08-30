import type { Metadata } from "next";


export const revalidate = 300;

type HNItem = {
    id: number;
    title: string;
    url: string;
    by: string;
    score: number;
}

async function getItem(id: string) {
    // use official HN API for item details (fast, no key)
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
      // revalidate inherits from page export; we won’t add tags here
    });
    if (!res.ok) throw new Error("Item fetch failed");
    return (await res.json()) as HNItem | null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const item = await getItem(id);
    return { title: item?.title ?? "HN Story" };
}

export default async function StoryPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const item = await getItem(id);
    if (!item) {
      return (
        <main className="p-6">
          <h1 className="text-xl font-semibold">Story not found</h1>
        </main>
      );
    }
  
    return (
      <main className="p-6 space-y-3">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-sm opacity-75">
          {item.score ?? 0} points · by {item.by ?? "unknown"}
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" className="underline">
            external link
          </a>
        )}
        <p className="text-sm opacity-70">
          Page-level ISR: first hit after 5 min gets stale, Next regenerates in the background.
        </p>
      </main>
    );
}