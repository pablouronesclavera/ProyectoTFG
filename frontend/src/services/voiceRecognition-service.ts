type VoiceStreamResponseAlgodon = {
  userText: string;
  responseText: string;
  audioUrl: string;
  language: string;
  error?: string;
};

type VoiceStreamResponsePlagas = {
  transcription: string;
  language: string;
  audioContent: string;
  error?: string;
};

export class VoiceRecognitionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) return reject("No se está grabando.");

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  async sendRecordedAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "audio.webm");

    try {
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await response.json();
      return data.transcription || "No se pudo obtener la transcripción.";
    } catch (error) {
      console.error("Error al enviar el audio:", error);
      return "Error en la transcripción.";
    }
  }

  // api de altube
  async sendVoiceStreamToAlgodon(audioBlob: Blob): Promise<VoiceStreamResponseAlgodon> {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "audio.webm"); // nombre clave esperado por el backend

      const response = await fetch("/api/voice_chat_stream", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return {
        userText: data.user_text || "",
        responseText: data.response_text || "",
        audioUrl: data.audio_file || "",
        language: data.detected_language || "",
      };
    } catch (error) {
      console.error("Error al enviar audio a Algodón API:", error);
      return {
        userText: "",
        responseText: "",
        audioUrl: "",
        language: "",
        error: "Error en la transcripción",
      };
    }
  }

  async sendVoiceStreamToPlagas(audioBlob: Blob): Promise<VoiceStreamResponsePlagas> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm"); // nombre clave esperado por el backend

      const response = await fetch("/api/process_audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return {
        transcription: data.transcription || "",
        language: data.idioma_detectado || "",
        audioContent: data.audio_content || "",
      };
    } catch (error) {
      console.error("Error al enviar audio a Algodón API:", error);
      return {
        transcription: "",
        language: "",
        audioContent: "",
        error: "Error en la transcripción",
      };
    }
  }
}
