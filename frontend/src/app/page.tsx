"use client";
import { useRouter } from "next/navigation";
import {
  Bot,
  MessageCircleQuestion,
  MessagesSquare,
  Sprout,
  Biohazard,
  MessageSquareMore,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white-50 rounded-2xl p-6 w-[350px] shadow-md border border-teal-400 flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <Bot className="text-teal-500 w-8 h-8 mb-1" />
          <h1 className="text-lg font-bold text-teal-700">Botanic</h1>
          <p className="text-sm text-gray-700 mt-1">¡Hola! ¿Cómo puedo ayudarte?</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mb-5">
          {/* <button
            onClick={() => router.push("/chat")}
            className="bg-teal-100 hover:bg-teal-500 rounded-xl p-3 shadow-sm text-sm text-left text-gray-800 flex flex-col items-start"
          >
            <div className="w-10 h-10 mb-5 flex items-center justify-center rounded-full bg-white border-2 border-teal-500">
              <MessageCircleQuestion className="w-6 h-6 text-teal-500" />
            </div>
            Empezar nuevo chat
          </button> */}
          <button
            onClick={() => router.push("/chat_cultivo_algodon")}
            className="bg-teal-100 hover:bg-teal-500 rounded-xl p-3 shadow-sm text-sm text-left text-gray-800 flex flex-col items-start"
          >
            <div className="w-10 h-10 mb-5 flex items-center justify-center rounded-full bg-white border-2 border-teal-500">
              <Sprout className="w-6 h-6 text-teal-500" />
            </div>
            Sobre cultivo <br />
            de algodón
          </button>
          <button
            onClick={() => router.push("/chat_plagas")}
            className="bg-teal-100 hover:bg-teal-500 rounded-xl p-3 shadow-sm text-sm text-left text-gray-800 flex flex-col items-start"
          >
            <div className="w-10 h-10 mb-5 flex items-center justify-center rounded-full bg-white border-2 border-teal-500">
              <Biohazard className="w-6 h-6 text-teal-500" />
            </div>
            Plagas y enfermedades
          </button>
        </div>

        {/* <button
          onClick={() => router.push("/chat")}
          className="bg-teal-500 hover:bg-teal-600 w-full text-white px-5 py-2 rounded-full text-sm flex justify-between items-center shadow-md"
        >
          <span>Empezar nuevo chat</span>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black border border-teal-500">
            <MessageSquareMore className="w-6 h-6 text-white" />
          </div>
        </button> */}
      </div>
    </div>
  );
}
