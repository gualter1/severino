import { promises as fs } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export async function getHtmlUI(): Promise<string> {
  const htmlPath = join(__dirname, "..", "..", "public", "index.html");
  return fs.readFile(htmlPath, "utf-8");
}