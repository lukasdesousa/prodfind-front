import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base64Files: string[] = body.files;

    if (!Array.isArray(base64Files) || base64Files.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const base64String of base64Files) {
      const matches = base64String.match(/^data:(.+);base64,(.+)$/);
      const data = matches ? matches[2] : base64String;

      const buffer = Buffer.from(data, "base64");

      const result = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fond_uploads", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            if (result?.secure_url) resolve(result.secure_url);
            else reject(new Error("Falha ao obter URL do Cloudinary"));
          }
        );
        stream.end(buffer);
      });

      uploadedUrls.push(result);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro ao enviar arquivos" }, { status: 500 });
  }
}
