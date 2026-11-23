// gta6-meme-x-01 entry — copies POST.json (the verified X post for this
// make.fun bounty) from the repo directory into the output directory.
// Node 22+, standard library only.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir =
  process.env.MAKEFUN_BOT_DIR ??
  dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const postPath = join(repoDir, "POST.json");

// Validate POST.json before copying: it must parse as JSON and its `url`
// field must be a string shaped like an X post URL.
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  throw new Error(`POST.json is not valid JSON (${postPath}): ${(err as Error).message}`);
}
if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+\/?$/.test(
    (post as { url: string }).url,
  )
) {
  throw new Error(
    `POST.json is invalid: expected a "url" string shaped like an X post URL (https://x.com/<user>/status/<id>), got: ${JSON.stringify(post)}`,
  );
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(postPath, join(outputDir, "POST.json"));

console.log(`POST.json copied to ${join(outputDir, "POST.json")}`);
