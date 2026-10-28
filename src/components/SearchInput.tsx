"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { Search, X, Loader2, Music2 } from "lucide-react";

interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string | null;
  originalKey?: string | null;
  capo?: number | null;
  content?: string;
}

/**
 * Membuat cuplikan lirik sederhana mirip snippet Google Search
 */
function getSnippet(content?: string, query?: string): string {
  if (!content) return "";

  // Hapus tag chord format [C], [Am], dst
  const plainText = content
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!query || !query.trim()) {
    return plainText.slice(0, 110) + (plainText.length > 110 ? "..." : "");
  }

  const cleanQuery = query.trim().toLowerCase();
  const lowerText = plainText.toLowerCase();
  const matchIndex = lowerText.indexOf(cleanQuery);

  if (matchIndex === -1) {
    return plainText.slice(0, 110) + (plainText.length > 110 ? "..." : "");
  }

  const start = Math.max(0, matchIndex - 25);
  const end = Math.min(plainText.length, matchIndex + cleanQuery.length + 65);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < plainText.length ? "..." : "";

  return `${prefix}${plainText.slice(start, end).trim()}${suffix}`;
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const inputId = useId();

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
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
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setSongs([]);
  };

  return (
    <div className="relative z-30 mx-auto mt-6 max-w-2xl text-left">
      {/* Google-like Search Bar */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 flex items-center text-muted-foreground">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul lagu, artis, atau potongan lirik..."
          autoComplete="off"
          className="h-12 w-full rounded-full border border-border bg-surface/90 pl-11 pr-11 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground active:scale-95"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Google-like Vertical Search Results */}
      {query.trim() && (
        <div className="mt-5 rounded-2xl border border-border/80 bg-surface/80 p-4 sm:p-5 backdrop-blur-md shadow-xl">
          {/* Status info bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground">
            <span>
              {loading
                ? "Mencari lagu..."
                : `Menampilkan ${songs.length} hasil untuk "${query}"`}
            </span>
            {songs.length > 0 && !loading && (
              <span className="hidden sm:inline text-[11px] text-muted">
                Ketuk untuk membuka chord
              </span>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="divide-y divide-border/40 py-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse space-y-2 py-3.5">
                  <div className="h-3 w-36 rounded bg-surface-hover" />
                  <div className="h-4 w-3/5 rounded bg-surface-hover" />
                  <div className="h-3 w-4/5 rounded bg-surface-hover" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && songs.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-foreground">
                Lagu tidak ditemukan
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                Tidak ada lagu atau lirik yang cocok dengan &quot;{query}&quot;. Coba periksa ejaan atau cari kata kunci lain.
              </p>
              <div className="mt-4">
                <Link
                  href="/request"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Request lagu ini sekarang &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Results List - Memanjang ke bawah gaya Google */}
          {!loading && songs.length > 0 && (
            <div className="divide-y divide-border/50">
              {songs.map((song) => {
                const snippet = getSnippet(song.content, query);

                return (
                  <Link
                    key={song.id}
                    href={`/songs/${song.slug}`}
                    className="group block py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-surface-hover/50 active:bg-surface-hover"
                  >
                    {/* Breadcrumb Google Style */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                      <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Music2 className="h-2.5 w-2.5" />
                      </div>
                      <span className="font-medium text-muted">chordkerinci.id</span>
                      <span>›</span>
                      <span className="text-muted-foreground truncate max-w-[180px] sm:max-w-xs">
                        {song.slug}
                      </span>
                    </div>

                    {/* Judul Lagu (Tautan Biru / Primary seperti Google) */}
                    <h3 className="text-base sm:text-lg font-semibold text-primary group-hover:underline group-hover:text-primary-hover transition-colors line-clamp-1">
                      Chord {song.title} - {song.artist || "Artis Kerinci"}
                    </h3>

                    {/* Cuplikan Lirik / Snippet Google Style */}
                    <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                      {snippet ? (
                        <>
                          <span className="text-muted-foreground font-medium">Lirik: </span>
                          &ldquo;{snippet}&rdquo;
                        </>
                      ) : (
                        `Kunci gitar & lirik lagu ${song.title}. Mainkan dengan mudah dengan fitur transpose chord otomatis.`
                      )}
                    </p>

                    {/* Meta info ringan */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center rounded bg-surface px-1.5 py-0.5 border border-border font-medium">
                        Key: <span className="ml-1 text-foreground">{song.originalKey || "C"}</span>
                      </span>
                      {song.capo ? (
                        <span className="inline-flex items-center rounded bg-surface px-1.5 py-0.5 border border-border font-medium">
                          Capo: <span className="ml-1 text-foreground">{song.capo}</span>
                        </span>
                      ) : null}
                      {song.artist && (
                        <span className="text-muted">
                          Penyanyi: <strong className="font-medium text-foreground">{song.artist}</strong>
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
