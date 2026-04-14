import { promises as fs } from "node:fs";
import { getDocSearchRoots, resolveDocAbsolutePath } from "@/lib/document-path";
import { hasMemberAccess } from "@/lib/member-auth";

export async function GET(request: Request) {
  if (!(await hasMemberAccess(request))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const fileName = "AI safety policy 2024.pdf";
  const pdfPath = await resolveDocAbsolutePath(fileName);
  if (!pdfPath) {
    return new Response(
      `${fileName} not found.\nExpected in one of:\n${getDocSearchRoots().join("\n")}`,
      { status: 404 },
    );
  }

  try {
    const fileBuffer = await fs.readFile(pdfPath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"AI safety policy 2024.pdf\"",
        "Cache-Control": "no-store",
        "Content-Length": String(fileBuffer.byteLength),
      },
    });
  } catch {
    return new Response(
      `${fileName} not found.\nExpected in one of:\n${getDocSearchRoots().join("\n")}`,
      { status: 404 },
    );
  }
}
