"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string | null;
}
export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) {
          throw new Error("Search failed");
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error(error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);
  return (
    <div className="relative z-50 mx-auto mt-8 max-w-xl">
      {" "}
      {/* Search Input */}{" "}
      <div className="relative">
        {" "}
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />{" "}
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul lagu, nama artis, atau potongan lirik..."
          className="h-11 rounded-xl border-border bg-surface pl-10 text-sm shadow-inner focus:border-primary"
        />{" "}
      </div>{" "}
      {/* Search Results as Card Grid */}
      {query && (
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Mencari...</p>
          ) : songs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Lagu tidak ditemukan</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {songs.map((song) => (
                <a
                  key={song.id}
                  href={`/songs/${song.slug}`}
                  className="group block border border-border bg-card/60 backdrop-blur transition-all duration-200 hover:border-primary-border hover:bg-surface hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {song.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {song.artist || "Artis Kerinci"}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}{" "}
    </div>
  );
}
