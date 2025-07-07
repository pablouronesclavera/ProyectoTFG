import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "No se envió audio" }, { status: 400 });
    }

    // Convertir el audio a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Crear un nuevo FormData para reenviar el archivo
    const forwardData = new FormData();
    forwardData.append("audio", new Blob([buffer]), "audio.wav");

    // Reenviar el archivo al backend externo
    const response = await fetch(
      "https://prototipofinal-425033219033.europe-southwest1.run.app/process_audio",
      {
        method: "POST",
        body: forwardData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al reenviar: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error al reenviar a /process_audio:", error);
    return NextResponse.json({ error: "Error interno al reenviar el audio" }, { status: 500 });
  }
}
