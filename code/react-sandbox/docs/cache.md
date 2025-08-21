# The 3 caches you care about in Next.js (App Router)

1. Request Memoization (per render):
  - During a single server render, identical `fetch()` calls are deduped so you dont refetch the same URL twice in that render. 
  - Scope: one render only. Doesn't persist between requests.
  - You don't control this just know it exists
2. Data Cache (fetch-level):
  - When you call `fetch(url, { next: revalidate: N, tags: [...] }, cache: 'force-cache' | 'no-store)}` 
    you’re telling Next how long to keep the response and how to invalidate it.
  - Key knobs:
    - next.revalidate: number → ISR for that request (e.g., 60s).
    - next.tags: string[] → label the cached response; later you can call revalidateTag('that-tag') to bust them all.
    - cache: 'force-cache' → keep it cached;
    - cache: 'no-store' → skip caching (always dynamic; revalidateTag can’t help then).
3. Full Route Cache (page-level)
  - Next can cache the HTML/RSC payload of your page (the rendered result).
  - You can bust it with revalidatePath('/some-page'). That forces the page to be regenerated on next request.
Think:
- Data Cache = cached responses from fetch.
- Full Route Cache = cached rendered page.
  You can use either—or both.

## The 4 levers you’ll actually use
***
In caching, TTL (Time To Live) is the duration that cached data is considered valid and can be used without checking with the origin server
***
1. Segment ISR (page-wide TTL)

`export const revalidate = 60; // page-level TTL; applies to fetches using default caching`
- Good when the whole page’s data can be treated with the same TTL.

2. Fetch ISR (request-level TTL)

`await fetch(url, { next: { revalidate: 60 } }); // per-request TTL`
- Good when different fetches on the same page need different TTLs.

3. Tag-based invalidation

```
await fetch(url, { next: { revalidate: 60, tags: ['bookings'] } });
// later in a server action or route:
revalidateTag('bookings');

```
- Busts all cached responses that carry that tag—across pages, layouts, and routes.

4. Path-based invalidation
```
// later in a server action or route:
revalidatePath('/dashboard');
```
- Busts the rendered page cache for that path (and it will re-render on next hit).

### When to use what (practical heuristics)

- Only one page shows the data?
Use revalidatePath('/that-page'). It’s simple and targeted.

- Same dataset appears in multiple places (dashboard widget, landing, admin)?
Use tags. Tag all related fetch() calls (e.g., 'bookings') and call revalidateTag('bookings') after a write.

- You never want stale data (admin forms, money movement)?
Use cache: 'no-store' (fully dynamic). Don’t tag—there’s nothing cached to bust.

- You want auto-refresh after a short period with no button?
Use ISR (revalidate: N) at the fetch or segment level.

What actually happens on a request (flow)

Your server component runs.

It hits fetch(...). If cached (Data Cache), Next serves it; otherwise it fetches and stores it with TTL/tags.

Next may also cache the rendered result (Full Route Cache) if the route is static or ISR-enabled.

When you call:

revalidateTag('X') → Data Cache entries with tag X are invalidated immediately.

revalidatePath('/p') → the Full Route Cache for /p is invalidated; on next request it re-renders (and will re-hit fetches, which can also warm Data Cache again).

Common gotchas

Using dynamic features (cookies/headers/no-store) makes the route dynamic and can disable page-level caching. That’s fine—just be intentional.

revalidateTag does nothing if the fetch wasn’t cached (e.g., no-store or you didn’t set ISR/force-cache).

Tag names are arbitrary strings—choose stable names (e.g., 'bookings', 'inventory:tenant-123').

InflateMate examples (to anchor it)

Bookings appear on multiple pages (tenant dashboard + admin + widget):
Tag every bookings fetch with 'bookings:tenantId'. After creating/canceling a booking, call revalidateTag('bookings:tenantId').

A marketing page that lists a few featured rentals:
It’s a single page → revalidatePath('/[domain]/catalog') after you change inventory.

Admin tables you’re editing:
Use cache: 'no-store' for the form submit path. For lists, you can still show cached data + a manual “Refresh” that triggers revalidation.