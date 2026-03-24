import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveFile(
  file: File,
  subfolder: "content" | "avatars" = "content"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".bin";
  const filename = `${uuidv4()}${ext}`;
  const dir = path.join(UPLOAD_DIR, subfolder);

  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);

  return `/uploads/${subfolder}/${filename}`;
}

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  article: [],
  video: [".mp4", ".webm", ".mov", ".avi"],
  file: [".pdf", ".zip", ".rar", ".png", ".jpg", ".jpeg", ".gif", ".psd", ".ai", ".doc", ".docx"],
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
