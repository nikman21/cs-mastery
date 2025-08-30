// Shown while the server component fetch runs
export default function Loading() {
    return (
      <main className="p-6 space-y-3">
        <div className="h-6 w-64 rounded bg-gray-200" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded bg-gray-100" />
          ))}
        </div>
      </main>
    );
  }
  