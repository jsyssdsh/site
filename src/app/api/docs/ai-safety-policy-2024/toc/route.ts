import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { hasMemberAccess } from "@/lib/member-auth";

export const runtime = "nodejs";

type TocSubItem = {
  id: string;
  title: string;
  page: number;
};

type TocSection = {
  id: string;
  title: string;
  page: number;
  items: TocSubItem[];
};

let tocCache: TocSection[] | null = null;

function normalizeLine(input: string): string {
  return input
    .replace(/[•]/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNoiseLine(line: string): boolean {
  if (!line) return true;
  if (line.length < 4 || line.length > 120) return true;
  if (/^\d+$/.test(line)) return true;
  if (/^[-–—]+$/.test(line)) return true;
  if (/^(Prompt|출처|http|https)/i.test(line)) return true;
  return false;
}

function makeId(prefix: string, value: string): string {
  return `${prefix}-${value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function addUniqueItem(section: TocSection, item: TocSubItem) {
  const exists = section.items.some((it) => it.title === item.title);
  if (!exists) {
    section.items.push(item);
  }
}

function extractTocFromText(text: string): TocSection[] {
  const pages = text.split("\f");
  const sections: TocSection[] = [];
  let currentSection: TocSection | null = null;
  const seenTitles = new Set<string>();

  for (let i = 0; i < pages.length; i += 1) {
    const pageNumber = i + 1;
    const lines = pages[i]
      .split("\n")
      .map(normalizeLine)
      .filter((line) => !isNoiseLine(line));

    for (const line of lines) {
      const partMatch = line.match(/^PART\s*(\d+)\s+(.+)$/i);
      if (partMatch) {
        const title = `PART ${partMatch[1]} ${partMatch[2]}`.trim();
        if (seenTitles.has(title)) {
          const existing = sections.find((sec) => sec.title === title);
          currentSection = existing ?? null;
          continue;
        }

        const section: TocSection = {
          id: makeId("part", title),
          title,
          page: pageNumber,
          items: [],
        };
        sections.push(section);
        seenTitles.add(title);
        currentSection = section;
        continue;
      }

      const numericMatch = line.match(/^(\d{1,2})\.\s+(.+)$/);
      if (numericMatch && currentSection) {
        const title = `${numericMatch[1]}. ${numericMatch[2]}`.trim();
        addUniqueItem(currentSection, {
          id: makeId(currentSection.id, title),
          title,
          page: pageNumber,
        });
      }
    }
  }

  return sections
    .map((section) => ({
      ...section,
      items: section.items.sort((a, b) => a.page - b.page).slice(0, 24),
    }))
    .filter((section) => section.items.length > 0)
    .sort((a, b) => a.page - b.page)
    .slice(0, 10);
}

export async function GET(request: Request) {
  if (!hasMemberAccess(request)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (tocCache) {
    return Response.json({ toc: tocCache });
  }

  const pdfPath = path.join(process.cwd(), "..", "AI safety policy 2024.pdf");

  try {
    const fileBuffer = await fs.readFile(pdfPath);
    const parser = new PDFParse({ data: fileBuffer });
    const parsed = await parser.getText();
    const toc = extractTocFromText(parsed.text);
    await parser.destroy();

    if (toc.length === 0) {
      return Response.json({ toc: [], message: "No TOC entries extracted." });
    }

    tocCache = toc;
    return Response.json({ toc });
  } catch {
    return new Response("Failed to extract TOC from AI safety policy 2024.pdf.", {
      status: 500,
    });
  }
}
