import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "https://chat-algodon-425033219033.europe-southwest1.run.app/chat",
      },
      {
        source: "/api/voice_chat_stream",
        destination:
          "https://chat-algodon-425033219033.europe-southwest1.run.app/voice_chat_stream",
      },
      {
        source: "/api/conversar",
        destination: "https://prototipofinal-425033219033.europe-southwest1.run.app/conversar",
      },
      {
        source: "/api/process_audio",
        destination: "https://prototipofinal-425033219033.europe-southwest1.run.app/process_audio",
      },
    ];
  },
};

export default nextConfig;
