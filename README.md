# Trabajo de Fin de Grado: Chatbot para la aclaración de dudas en el contexto del cultivo y la producción de algodón

## 🌱 Botanic Chatbot

Bienvenido al repositorio del proyecto **Botanic Chatbot**, un sistema conversacional basado en Inteligencia Artificial diseñado para ayudar a agricultores y técnicos en la gestión del cultivo de algodón y la identificación de plagas y enfermedades.  

Desarrollado como parte de un Trabajo Fin de Grado.

---

### 🚀 **¿Qué es Botanic Chatbot?**

Botanic Chatbot es una aplicación web que permite simular conversaciones con un asistente virtual especializado en el cultivo de algodón y la identificación de plagas. La comunicación puede ser por vía mensajes de texto o de voz. Las respuestas recibidas son generadas mediante IA.

---

### 🛠 **Tecnologías utilizadas**

- **Next.js** + **React** para el desarrollo del frontend.
- **Tailwind CSS** para el diseño de la interfaz.
- **TypeScript** para un desarrollo robusto y tipado.
- **Docker** para el despliegue.
- **APIs externas** para la generación de respuestas y transcripción. Proporcionadas por compañeros de la Universidad de Oviedo.

---

### ⚡ **Cómo funciona**

El usuario puede:
1️⃣ Seleccionar el tipo de chat desde un menú principal.  
2️⃣ Enviar preguntas o audios al chatbot.  
3️⃣ Reiniciar el historial del chat. 
4️⃣ Cambiar de chat cuando lo desee.  

Todo ello mediante una interfaz responsiva y accesible.

---

### 📦 **Despliegue**

El sistema está preparado para ejecutarse en contenedores Docker. También, el despliegue se puede automatizar mediante un pipeline con alguna sistema de control de versiones, como GitLab o GitHub, para simplificarlo.

---

## 📌 **Instalación rápida**

# Clona el repositorio
git clone <URL_DEL_REPO>

# Instala dependencias
cd <directorio-proyecto>
pnpm install

# Ejecuta en modo desarrollo
pnpm run dev
Observar en http://localhost:3000/ 

# Ejecuta en modo producción
pnpm run build
pnpm run start

# Usando Docker
docker-compose up --build
Observar en http://localhost:8080/ 
