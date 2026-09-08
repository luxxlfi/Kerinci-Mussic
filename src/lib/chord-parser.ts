export interface ChordToken {
  chord?: string;
  text: string;
}

export type LineToken = ChordToken[];

/**
 * Mengurai teks lirik bernotasi [CHORD] menjadi array token per baris.
 * Contoh: "Aku [C]cinta [G]kamu"
 * Hasil: [
 *   { text: "Aku " },
 *   { chord: "C", text: "cinta " },
 *   { chord: "G", text: "kamu" }
 * ]
 */
export function parseChordPro(content: string): LineToken[] {
  if (!content) return [];

  const lines = content.split("\n");

  return lines.map((line) => {
    const tokens: ChordToken[] = [];
    const regex = /\[(.*?)\]/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let currentChord: string | undefined = undefined;

    while ((match = regex.exec(line)) !== null) {
      const matchIndex = match.index;
      const textBefore = line.slice(lastIndex, matchIndex);

      if (tokens.length === 0 && textBefore.length > 0) {
        tokens.push({ text: textBefore });
      } else if (tokens.length > 0 && textBefore.length > 0) {
        tokens[tokens.length - 1].text += textBefore;
      }

      currentChord = match[1].trim();

      // Tambahkan token baru dengan chord ini
      tokens.push({
        chord: currentChord,
        text: "",
      });

      lastIndex = regex.lastIndex;
    }

    const remainingText = line.slice(lastIndex);
    if (tokens.length > 0) {
      tokens[tokens.length - 1].text += remainingText;
    } else if (remainingText.length > 0) {
      tokens.push({ text: remainingText });
    }

    return tokens;
  });
}