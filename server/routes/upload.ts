/**
 * Image Upload API Route
 */

import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.post("/upload", (req: Request, res: Response) => {
  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: "Missing filename or data." });
    }

    // Tipe data diharapkan berupa Base64 data URL: "data:image/jpeg;base64,/9j/4..."
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Format data base64 tidak valid." });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Validasi tipe file (harus gambar)
    if (!mimeType.startsWith("image/")) {
      return res.status(400).json({ error: "Hanya file gambar yang diperbolehkan." });
    }

    // Buat folder uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Buat nama file unik
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = path.extname(filename);
    if (!ext) {
      const parts = mimeType.split("/");
      ext = parts[1] ? `.${parts[1]}` : ".jpg";
    }
    const safeFilename = `img-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, safeFilename);

    // Konversi base64 ke buffer biner dan tulis ke disk
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${safeFilename}`;
    console.log(`[Upload] File berhasil disimpan: ${safeFilename}`);

    return res.json({ url: fileUrl });
  } catch (err: any) {
    console.error("[Upload] Error memproses upload file:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
