import { NextApiRequest, NextApiResponse } from "next";

export async function fetchFromAlgodonAPI(message: string, signal?: AbortSignal) {
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
