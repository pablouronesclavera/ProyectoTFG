import { Dispatch, SetStateAction } from "react";

/**
 * Hook que devuelve el handler para reiniciar el chat.
 * @param setChatHistory Setter del chatHistory
 * @param setMessage Setter del mensaje
 * @param setIsRecording Setter del estado de grabación
 */
export function useRestartChat(
  setChatHistory: Dispatch<SetStateAction<any[]>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setIsRecording: Dispatch<SetStateAction<boolean>>
) {
  const restartChat = () => {
    const confirmed = window.confirm("¿Estás seguro de que quieres reiniciar el chat?");
    if (!confirmed) return;

    setChatHistory([
      {
        sender: "ia",
        text: "¡Hola! ¿En qué puedo ayudarte?",
      },
    ]);
    setMessage("");
    setIsRecording(false);
  };

  return { restartChat };
}
