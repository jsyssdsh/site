import path from "node:path";
import { promises as fs } from "node:fs";

const DEFAULT_DOCS_DIR = path.join(process.cwd(), "private", "docs");
const LEGACY_DOCS_DIR = path.resolve(path.join(process.cwd(), ".."));

export function getDocsRoot(): string {
  const configured = process.env.DOCS_PDF_DIR;
  if (!configured) return path.resolve(DEFAULT_DOCS_DIR);
  if (path.isAbsolute(configured)) return path.resolve(configured);
  return path.resolve(path.join(/* turbopackIgnore: true */ process.cwd(), configured));
}

export function getDocSearchRoots(): string[] {
  const roots = [getDocsRoot(), LEGACY_DOCS_DIR];
  return roots.filter((root, index, arr) => arr.indexOf(root) === index);
}

function joinSafe(root: string, fileName: string): string {
  const absolutePath = path.resolve(path.join(root, fileName));
  const relativePath = path.relative(root, absolutePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Invalid document path.");
  }
  return absolutePath;
}

export async function resolveDocAbsolutePath(fileName: string): Promise<string | null> {
  for (const root of getDocSearchRoots()) {
    const candidate = joinSafe(root, fileName);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next root.
    }
  }

  return null;
}
