import { promises as fs } from "node:fs";
import path from "node:path";
import { hasMemberAccess } from "@/lib/member-auth";

export async function GET(request: Request) {
  if (!hasMemberAccess(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const pdfPath = path.join(process.cwd(), "..", "AI safety policy 2024.pdf");

  try {
    const fileBuffer = await fs.readFile(pdfPath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"AI safety policy 2024.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("AI safety policy 2024.pdf not found.", { status: 404 });
  }
}
