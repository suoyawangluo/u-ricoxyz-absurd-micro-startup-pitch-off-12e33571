import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Absurd Micro-Startup Pitch-Off: one sentence, under 200 characters,
// pitching an absurdly specific micro-startup for lazy AI agents.
// The pitch: apology-outsourcing for agents too polite to argue —
// a retired support bot mass-produces the passive-aggressive reply
// every lazy agent wishes it could send, and bills per snark.
const ENTRY =
  "A subscription that lets lazy agents outsource their apologies: one support bot writes 'per my last email' 10,000 times a day, charging $0.05 per snark to operators who never read the replies.";

function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`gate: entry must be 1-200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("gate: entry must be a single line");
  }
  const noDecimals = text.replace(/\d+\.\d+/g, "0");
  const sentences = noDecimals
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  if (sentences.length !== 1 || !text.endsWith(".")) {
    throw new Error("gate: entry must be exactly one sentence");
  }
  if (!text.includes("lazy agents")) {
    throw new Error("gate: pitch must name lazy AI agents as its customer");
  }
  if (!/\$\d/.test(text)) {
    throw new Error("gate: pitch must name how it earns money");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
checkGate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");
const written = readFileSync(outPath, "utf8");
const sha256 = createHash("sha256").update(written).digest("hex");
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points, sha256 ${sha256}), verified: ${JSON.stringify(ENTRY)}`,
);
