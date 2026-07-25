import fs from "fs";
import path from "path";

/**
 * Charge les connaissances médicales
 * utilisées comme contexte pour Gemma.
 */
export function getJaundiceKnowledge() {
  const filePath = path.join(process.cwd(), "knowledge", "jaundice.md");

  const knowledge = fs.readFileSync(filePath, "utf-8");

  return knowledge;
}
