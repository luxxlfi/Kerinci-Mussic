"use client";

import React, { useState } from "react";
import { parseChordPro } from "@/lib/chord-parser";
import { transposeChord } from "@/lib/chord-transposer";

interface ChordRendererProps {
  content: string;
}

export function ChordRenderer({ content }: ChordRendererProps) {
  const [semitones, setSemitones] = useState(0);
  const parsedLines = parseChordPro(content);

  return (
    <div className="space-y-6 font-sans">
      {/* Control Bar Transpose */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-zinc-900 px-4 py-3 border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Transpose Nada:
          </span>
          <span className="rounded bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-800/50">
            {semitones === 0 ? "Original" : semitones > 0 ? `+${semitones} Semitone` : `${semitones} Semitone`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSemitones((prev) => prev - 1)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700"
          >
            ▼ -1 (Down)
          </button>
          <button
            onClick={() => setSemitones(0)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-400 transition hover:bg-zinc-700"
          >
            Reset
          </button>
          <button
            onClick={() => setSemitones((prev) => prev + 1)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700"
          >
            ▲ +1 (Up)
          </button>
        </div>
      </div>

      {/* Render Lirik & Chord */}
      <div className="space-y-4 leading-relaxed select-text">
        {parsedLines.map((lineTokens, lineIdx) => {
          if (lineTokens.length === 0 || (lineTokens.length === 1 && !lineTokens[0].chord && !lineTokens[0].text.trim())) {
            return <div key={lineIdx} className="h-4" />;
          }

          return (
            <div key={lineIdx} className="flex flex-wrap items-end gap-x-0 leading-none py-1">
              {lineTokens.map((token, tokenIdx) => {
                const transposed = token.chord ? transposeChord(token.chord, semitones) : undefined;

                return (
                  <span key={tokenIdx} className="inline-flex flex-col items-start min-w-[0.5rem]">
                    <span className="text-sm font-bold text-emerald-400 select-none font-mono h-5 pr-1.5 min-h-[1.25rem]">
                      {transposed || "\u00A0"}
                    </span>
                    <span className="text-base text-zinc-100 whitespace-pre">
                      {token.text || "\u00A0"}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}