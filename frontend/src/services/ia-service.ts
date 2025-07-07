import { NextApiRequest, NextApiResponse } from "next";

export async function fetchFromIA(chatInput: string): Promise<{ output: string; error?: string }> {
  try {
    const response = await fetch(
      `http://localhost:5678/webhook/knowledge-base/enquiry?chatInput=${encodeURIComponent(chatInput)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al obtener la respuesta");
    }

    const data = await response.json();
    return { output: data.output || "" };
  } catch (error) {
    console.error("Error en fetchFromIA:", error);
    return { output: "", error: (error as Error).message };
  }
}

export async function fetchFromAlgodonAPI(message: string, signal?: AbortSignal) {
  //const response = await fetch("https://chat-algodon-425033219033.europe-southwest1.run.app/chat", {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
  }

  const data = await response.json();

  // Extraer y devolver solo el texto
  return { response: data.response_text };
}

export async function fetchFromPlagasAPI(
  mensaje_usuario: string,
  historial: string,
  signal?: AbortSignal
) {
  //const response = await fetch("https://prototipofinal-425033219033.europe-southwest1.run.app/conversar", {
  const response = await fetch("/api/conversar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ mensaje_usuario, historial }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
  }

  const data = await response.json();

  // Extraer y devolver solo el texto
  return { response: data.respuesta };
}

// Endpoint accesible desde el Backend
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  // Obtener datos del cuerpo de la solicitud
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Se requiere un mensaje." });
  }

  // Simular una respuesta de la IA o procesamiento de datos
  const response = {
    success: true,
    response: `Mensaje recibido: ${message}`,
    timestamp: new Date().toISOString(),
  };

  // Responder con datos
  res.status(200).json(response);
}
