import { Dispatch, SetStateAction } from "react";

export function useHandleFileUpload(setChatHistory: Dispatch<SetStateAction<any[]>>) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedExtensions = ["application/pdf", "text/plain", "text/markdown"];

      if (!allowedExtensions.includes(file.type)) {
        alert("Solo se permiten documentos (PDF, Markdown, TXT).");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      console.log(`Archivo seleccionado: ${file.name}`);

      if (file.type.startsWith("image/")) {
        setChatHistory((prev) => [...prev, { sender: "user", imageUrl: fileUrl }]);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setChatHistory((prev) => [
            ...prev,
            { sender: "user", fileName: file.name, fileType: file.type },
          ]);
        };
        reader.readAsText(file);
      }
    }
  };

  return { handleFileUpload };
}
