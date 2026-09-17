"use client";

import React, { useState } from "react";
import { parseChordPro } from "@/lib/chord-parser";
import { transposeChord } from "@/lib/chord-transposer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, RotateCcw, Sliders } from "lucide-react";

interface ChordRendererProps {
  content: string;
}

export function ChordRenderer({ content }: ChordRendererProps) {
  const [semitones, setSemitones] = useState(0);
  const parsedLines = parseChordPro(content);

  return (
    <div className="space-y-6 font-sans">
      {/* Control Bar Transpose Modern shadcn style */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/90 p-3 border border-zinc-800 backdrop-blur shadow-sm">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Transpose Nada:
          </span>
          <Badge
            variant={semitones === 0 ? "secondary" : "default"}
            className="font-mono text-xs font-bold"
          >
            {semitones === 0
              ? "Original"
              : semitones > 0
              ? `+${semitones} Semitone`
              : `${semitones} Semitone`}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSemitones((prev) => prev - 1)}
            className="h-8 rounded-lg px-2.5 gap-1 text-xs font-bold"
            title="Turunkan 1/2 nada (semitone)"
          >
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            <span>Down</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSemitones(0)}
            disabled={semitones === 0}
            className="h-8 rounded-lg px-2.5 gap-1 text-xs text-zinc-400 hover:text-white"
            title="Reset ke nada awal"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSemitones((prev) => prev + 1)}
            className="h-8 rounded-lg px-2.5 gap-1 text-xs font-bold"
            title="Naikkan 1/2 nada (semitone)"
          >
            <ChevronUp className="h-3.5 w-3.5 text-primary" />
            <span>Up</span>
          </Button>
        </div>
      </div>

      {/* Render Lirik & Chord Presisi */}
      <div className="space-y-4 leading-relaxed select-text py-2">
        {parsedLines.map((lineTokens, lineIdx) => {
          if (
            lineTokens.length === 0 ||
            (lineTokens.length === 1 &&
              !lineTokens[0].chord &&
              !lineTokens[0].text.trim())
          ) {
            return <div key={lineIdx} className="h-4" />;
          }

          return (
            <div
              key={lineIdx}
              className="flex flex-wrap items-end gap-x-0 leading-none py-1"
            >
              {lineTokens.map((token, tokenIdx) => {
                const transposed = token.chord
                  ? transposeChord(token.chord, semitones)
                  : undefined;

                return (
                  <span
                    key={tokenIdx}
                    className="inline-flex flex-col items-start min-w-[0.5rem]"
                  >
                    <span className="text-sm font-bold text-primary select-none font-mono h-5 pr-1.5 min-h-[1.25rem]">
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