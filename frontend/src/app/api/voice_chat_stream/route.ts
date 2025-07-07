import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { readFile, unlink, stat } from "fs/promises";
import { execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import { Readable } from "stream";
import type { Files } from "formidable";
import type { IncomingMessage } from "http";

const execFile = promisify(execFileCallback);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // 1. Detectar si estamos en desarrollo o producción
    let ffmpegPath: string;
    if (process.env.NODE_ENV === "development") {
      const ffmpegStatic = await import("ffmpeg-static");
      ffmpegPath = ffmpegStatic.default as string;
    } else {
      ffmpegPath = "ffmpeg"; // Producción debe tenerlo instalado globalmente
    }

    const buffer = await req.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    const fakeReq = Object.assign(stream, {
      headers: {
        "content-type": req.headers.get("content-type") || "",
        "content-length": buffer.byteLength.toString(),
      },
    });

    const form = formidable({ multiples: false });

    const { files }: { files: Files } = await new Promise((resolve, reject) => {
      const typedReq = fakeReq as IncomingMessage;
      form.parse(typedReq, (err, _, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });

    const inputFile = (files.audio_file as formidable.File[])[0].filepath;
    const convertedPath = path.join(os.tmpdir(), `converted-${Date.now()}.wav`);

    console.log("📂 Archivo de entrada:", inputFile);
    await stat(inputFile); // Verifica que exista

    // 2. Ejecutar FFMPEG con logs
    try {
      await execFile(ffmpegPath, [
        "-y",
        "-i",
        inputFile,
        "-ar",
        "16000",
        "-ac",
        "1",
        "-acodec",
        "pcm_s16le",
        convertedPath,
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ FFMPEG ERROR:");
      console.error("stderr:", err.stderr?.toString());
      console.error("stdout:", err.stdout?.toString());
      throw new Error("FFmpeg failed");
    }

    const fileBuffer = await readFile(convertedPath);
    console.log("✅ Conversión completada. Bytes:", fileBuffer.byteLength);

    const formData = new FormData();
    formData.append("audio_file", new Blob([fileBuffer]), "audio.wav");

    // 3. Llamada al backend
    const response = await fetch(
      "https://algodon-425033219033.europe-southwest1.run.app/voice_chat_stream",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error respuesta de la API externa:", errorText);
      throw new Error("Error en respuesta de la API externa");
    }

    const result = await response.json();

    await unlink(inputFile);
    await unlink(convertedPath);

    return NextResponse.json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error general:", error);
    return NextResponse.json(
      { error: "Error al convertir o reenviar el archivo" },
      { status: 500 }
    );
  }
}
