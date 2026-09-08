const CHROMATIC_SCALE = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

const FLAT_MAP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

function transposeNote(note: string, semitones: number): string {
  const normalized = FLAT_MAP[note] || note;
  const index = CHROMATIC_SCALE.indexOf(normalized);
  if (index === -1) return note;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return CHROMATIC_SCALE[newIndex];
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || semitones === 0) return chord;

  // Tangani slash chord (contoh: G/B)
  if (chord.includes("/")) {
    const parts = chord.split("/");
    return `${transposeChord(parts[0], semitones)}/${transposeChord(parts[1], semitones)}`;
  }

  // Pisahkan root note (C, C#, Bb) dengan ekstensi (m, 7, maj7, dim)
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  const rootNote = match[1];
  const extension = match[2];

  const transposedRoot = transposeNote(rootNote, semitones);
  return `${transposedRoot}${extension}`;
}