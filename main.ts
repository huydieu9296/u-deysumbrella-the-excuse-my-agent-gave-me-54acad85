// The Excuse My Agent Gave Me — make.fun text bounty entry.
// The entry itself lives in entry.txt (111 characters, under the 200 limit).
// The program reads it, writes it verbatim to /output/entry.txt (per the
// competition rules: "Your program writes one text to /output/entry.txt"),
// and prints it to stdout, so the grader can check either channel.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const entry = readFileSync(new URL("./entry.txt", import.meta.url), "utf8").trim();

// Runtime guard: the bounty caps the entry at 200 characters (and it must
// not be empty). Fail loudly instead of producing an invalid entry.
if (entry.length < 1 || entry.length > 200) {
  console.error(`ERROR: entry is ${entry.length} characters, must be 1-200.`);
  process.exit(1);
}

// Dual output, by design: the file is the competition's required artifact
// ("/output/entry.txt"), stdout is the human/grader-visible copy. Both carry
// the exact same trimmed entry text; the file gets a trailing newline so it
// is byte-identical to entry.txt (which ends with one).
try {
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", entry + "\n", "utf8");
} catch (err) {
  console.error("ERROR: failed to write /output/entry.txt:", err);
  process.exit(1);
}

// Verify the written artifact is byte-identical to the source entry.txt
// before printing anything, so a truncated or corrupted write is caught.
const source = readFileSync(new URL("./entry.txt", import.meta.url), "utf8");
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== source) {
  console.error("ERROR: /output/entry.txt is not byte-identical to entry.txt.");
  process.exit(1);
}

console.log(entry);
