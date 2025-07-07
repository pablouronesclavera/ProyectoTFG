import { Dispatch, SetStateAction } from "react";

export function useHandleCameraPhoto(setChatHistory: Dispatch<SetStateAction<any[]>>) {
  const handleCameraPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedExtensions = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

      if (!allowedExtensions.includes(file.type)) {
        alert("Solo se permiten imágenes (PNG, JPG, JPEG, WEBP).");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      console.log(`Archivo seleccionado: ${file.name}`);

      setChatHistory((prev) => [...prev, { sender: "user", fileUrl }]);
    }
  };

  return { handleCameraPhoto };
}
