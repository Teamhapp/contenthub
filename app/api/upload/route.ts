import { NextRequest, NextResponse } from "next/server";
import { requireAuthNotBanned } from "@/lib/api-handler";
import { saveFile, MAX_FILE_SIZE } from "@/lib/upload";

const ALLOWED_SUBFOLDERS = ["content", "avatars"] as const;
type AllowedSubfolder = (typeof ALLOWED_SUBFOLDERS)[number];

export async function POST(req: NextRequest) {
  try {
    // Auth + banned check
    const authResult = await requireAuthNotBanned();
    if (authResult instanceof NextResponse) return authResult;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawSubfolder = (formData.get("subfolder") as string) || "content";

    // Strict subfolder validation to prevent path traversal
    if (!ALLOWED_SUBFOLDERS.includes(rawSubfolder as AllowedSubfolder)) {
      return NextResponse.json({ error: "Invalid subfolder" }, { status: 400 });
    }
    const subfolder = rawSubfolder as AllowedSubfolder;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 });
    }

    const url = await saveFile(file, subfolder);
    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
