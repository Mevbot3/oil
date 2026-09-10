import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const file = await readFile(
    join(process.cwd(), "public/brand/x-banner-field.png"),
  );

  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="oil-x-banner.png"',
      "Cache-Control": "no-store",
    },
  });
}
