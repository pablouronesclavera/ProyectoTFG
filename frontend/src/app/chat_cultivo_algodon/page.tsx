"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, useRef } from "react";
import { fetchFromAlgodonAPI } from "@/services/ia-service";
import { VoiceRecognitionService } from "@/services/voiceRecognition-service";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  FileUp,
  Mic,
  MicOff,
  SendHorizontal,
  ChevronLeft,
  ListRestart,
  CircleStop,
} from "lucide-react";
import { cleanMarkdownResponse } from "../utils/function";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { useHandleCameraPhoto } from "../hooks/useHandleCameraPhoto";
import { useRestartChat } from "../hooks/useRestartChat";
import { useHandleStopResponse } from "../hooks/useHandleStopResponse";

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; text?: string; imageUrl?: string; fileName?: string; fileType?: string }[]
  >([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const audioServiceRef = useRef<VoiceRecognitionService | null>(null);

  const { handleFileUpload } = useHandleFileUpload(setChatHistory);
  const { handleCameraPhoto } = useHandleCameraPhoto(setChatHistory);
  const { restartChat } = useRestartChat(setChatHistory, setMessage, setIsRecording);
  const { handleStopResponse } = useHandleStopResponse(abortController, setAbortController);

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          sender: "ia",
          text: "¡Hola! ¿En qué puedo ayudarte?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    audioServiceRef.current = new VoiceRecognitionService();
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const handleChatAlgodon = async () => {
    if (!message.trim()) return;

    const controller = new AbortController();
    setAbortController(controller);

    const actualMessage = message;
    console.log("Enviando mensaje:", actualMessage);
    setChatHistory((prev) => [...prev, { sender: "user", text: actualMessage }]);
    setMessage("");

    setIsWaitingResponse(true);
    try {
      const response = await fetchFromAlgodonAPI(actualMessage, controller.signal);

      if (!response?.response) {
        throw new Error("Sin respuesta");
      }

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ia",
          text: cleanMarkdownResponse(response.response),
        },
      ]);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setChatHistory((prev) => [...prev, { sender: "ia", text: "Respuesta cancelada." }]);
      } else {
        console.error("Error al obtener respuesta:", error);
        setChatHistory((prev) => [...prev, { sender: "ia", text: "No se recibió respuesta" }]);
      }
    } finally {
      setIsWaitingResponse(false);
      setAbortController(null);
    }

    setMessage("");
  };

  // Manejar tecla Enter para enviar el mensaje
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChatAlgodon();
    }
  };

  const handleMicClickAlgodon = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await audioServiceRef.current?.startRecording();
    } else {
      setIsRecording(false);
      setIsTranscribing(true);
      const audioBlob = await audioServiceRef.current?.stopRecording();
      const result = await audioServiceRef.current?.sendVoiceStreamToAlgodon(audioBlob!);
      setIsTranscribing(false);

      if (!result || result.error) {
        console.error("Error en transcripción o resultado inválido:", result?.error);
        setChatHistory((prev) => [...prev, { sender: "ia", text: "Error en la transcripción" }]);
        return;
      }

      console.log("📝 Transcripción:", result.userText);
      console.log("💬 Respuesta IA:", result.responseText);

      // Mostrar texto del usuario
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", text: cleanMarkdownResponse(result.userText) },
      ]);

      // Mostrar respuesta de IA
      setChatHistory((prev) => [
        ...prev,
        { sender: "ia", text: cleanMarkdownResponse(result.responseText) },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
      <div className="w-full bg-white rounded-lg shadow-md h-full p-3 relative border border-gray-300 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 pr-2 pl-1">
          <button
            onClick={() => router.push("/")}
            accessKey="b"
            aria-keyshortcuts="Alt+B"
            title="Reiniciar chat (Alt + B)"
            className="text-gray-500 text-xl"
          >
            <ChevronLeft />
          </button>
          <span className="text-teal-500 font-bold text-lg">Botanic</span>
          <button
            onClick={restartChat}
            accessKey="r"
            aria-keyshortcuts="Alt+R"
            title="Reiniciar chat (Alt + R)"
            className={`text-gray-500 text-xl ${
              isTranscribing || isWaitingResponse ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isTranscribing || isWaitingResponse}
          >
            <ListRestart />
          </button>
        </div>

        <div
          id="chat-container"
          className="flex-1 overflow-y-auto w-full p-2 bg-gray-50 rounded-md border border-gray-300"
          ref={messagesContainerRef}
        >
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-3 rounded-lg  ${
                  chat.sender === "user"
                    ? "bg-green-500 max-w-xs text-white"
                    : "text-black w-4/5 max-w-full"
                }`}
              >
                <div
                  className={
                    chat.sender === "ia"
                      ? "prose max-w-none text-black text-[15px] leading-relaxed whitespace-pre-wrap"
                      : ""
                  }
                >
                  {chat.fileName && chat.sender === "user" && (
                    <div className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300">
                      <FileUp className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">{chat.fileName}</span>
                    </div>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: (props) => <h1 className="text-2xl font-bold mt-1 mb-1" {...props} />,
                      h2: (props) => <h2 className="text-xl font-semibold mt-1 mb-1" {...props} />,
                      h3: (props) => <h3 className="text-lg font-semibold mt-1 mb-1" {...props} />,
                      p: (props) => (
                        <p className="text-base leading-snug text-gray-900 mb-0" {...props} />
                      ),
                      ul: (props) => (
                        <ul className="list-disc pl-3 text-gray-900 mt-0 mb-0" {...props} />
                      ),
                      ol: (props) => (
                        <ol className="list-decimal pl-3 text-gray-900 mt-0 mb-0" {...props} />
                      ),
                      li: (props) => <li className="text-base leading-snug mt-0 mb-0" {...props} />,
                      strong: (props) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                    }}
                  >
                    {cleanMarkdownResponse(chat.text || "")}
                  </ReactMarkdown>
                </div>
                {chat.imageUrl && (
                  <img
                    src={chat.imageUrl}
                    alt="Imagen enviada"
                    className="mt-2 rounded-lg max-w-full"
                  />
                )}
              </div>
            </div>
          ))}
          {isTranscribing && (
            <div className="flex justify-end mb-2">
              <div className="bg-green-500 text-black px-4 py-2 rounded-xl max-w-xs text-base font-semibold flex items-center gap-1">
                <span>Transcribiendo</span>
                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                <span className="animate-bounce">.</span>
              </div>
            </div>
          )}
          {isWaitingResponse && (
            <div className="flex justify-start ml-2">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl max-w-xs text-2xl flex gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                <span className="animate-bounce">.</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center border-t pt-3">
          <div className="relative flex-1">
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                isTranscribing || isWaitingResponse
                  ? "opacity-50 cursor-not-allowed"
                  : "text-teal-500"
              }`}
              onClick={handleMicClickAlgodon}
              accessKey="m"
              aria-keyshortcuts="Alt+M"
              title="Micrófono (Alt + M)"
              disabled={isTranscribing || isWaitingResponse}
            >
              {isRecording ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <span className="text-sm">Grabando</span>
                  <MicOff size={22} />
                </>
              ) : (
                <Mic size={22} />
              )}
            </button>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTranscribing || isWaitingResponse}
              className={`w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-gray-900 ${
                isTranscribing || isWaitingResponse ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          {isWaitingResponse ? (
            <button
              onClick={handleStopResponse}
              accessKey="c"
              aria-keyshortcuts="Alt+C"
              title="Parar respuesta (Alt + C)"
              className="text-red-500 text-xl mr-2 ml-2 hover:text-red-600"
            >
              <CircleStop size={24} />
            </button>
          ) : (
            <button
              onClick={handleChatAlgodon}
              accessKey="s"
              aria-keyshortcuts="Alt+S"
              title="Enviar mensaje (Alt + S)"
              disabled={!message.trim()}
              className={`text-xl mr-2 ml-2 ${
                !message.trim()
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-teal-500 hover:text-teal-600"
              }`}
            >
              <SendHorizontal size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
