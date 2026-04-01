import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  // Referer 체크 — 자체 사이트에서만 접근 허용
  const referer = req.headers.referer || "";
  const origin = req.headers.origin || "";
  const allowed = "dmp-portal.vercel.app";

  if (!referer.includes(allowed) && !origin.includes(allowed)) {
    return res.status(403).json({ error: "Forbidden: Direct access not allowed" });
  }

  const file = req.query.file;
  if (!file || /[^a-zA-Z0-9._-]/.test(file)) {
    return res.status(400).json({ error: "Invalid file parameter" });
  }

  // 허용된 파일만
  const ALLOWED_FILES = ["parts.json", "vehicle.json", "rental.json", "service.json"];
  if (!ALLOWED_FILES.includes(file)) {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    const filePath = join(process.cwd(), "public", "data", file);
    const data = readFileSync(filePath, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    return res.status(200).send(data);
  } catch {
    return res.status(404).json({ error: "Not found" });
  }
}
