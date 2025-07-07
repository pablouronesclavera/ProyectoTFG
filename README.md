# ProyectoTFG

## 🌱 Botanic Chatbot: Asistente conversacional para el cultivo de algodón y control de plagas

Bienvenido al repositorio del proyecto **Botanic Chatbot**, un sistema conversacional basado en Inteligencia Artificial diseñado para ayudar a agricultores y técnicos en la gestión del cultivo de algodón y la identificación de plagas y enfermedades.  

Desarrollado como parte de un Trabajo Fin de Grado, este proyecto combina tecnologías modernas del ecosistema web y prácticas DevOps para ofrecer una solución práctica y escalable.

---

### 🚀 **¿Qué es Botanic Chatbot?**

Botanic Chatbot es una aplicación web que permite:
- Simular conversaciones con un asistente virtual especializado en el cultivo de algodón y la identificación de plagas.
- Enviar mensajes de texto o de voz y obtener respuestas generadas mediante IA.
- Cambiar entre distintos dominios temáticos (algodón / plagas) desde un menú intuitivo.
- Visualizar y formatear mensajes de manera clara y accesible.
- Gestionar errores de comunicación y mostrar indicadores visuales de carga y respuesta.

---

### 🛠 **Tecnologías utilizadas**

- **Next.js 15** + **React 19** para el desarrollo del frontend.
- **Tailwind CSS 3** para el diseño de la interfaz.
- **TypeScript** para un desarrollo robusto y tipado.
- **Docker** y **GitLab CI/CD** para el despliegue y la integración continua.
- **FFmpeg** para el tratamiento de audio en el reconocimiento por voz.
- **APIs externas** (Algodón y Plagas) para la generación de respuestas y transcripción.

---

### ⚡ **Cómo funciona**

El usuario puede:
1️⃣ Seleccionar el tipo de chat desde un menú principal.  
2️⃣ Enviar preguntas o audios al chatbot.  
3️⃣ Visualizar las respuestas generadas o las transcripciones.  
4️⃣ Reiniciar o cambiar de chat cuando lo desee.  

Todo ello mediante una interfaz responsiva y accesible.

---

### 📦 **Despliegue**

El sistema está preparado para ejecutarse en contenedores Docker y su despliegue está automatizado mediante un pipeline en GitLab CI/CD. Esto garantiza una instalación y puesta en marcha rápida y consistente.

---

## 📌 **Instalación rápida**
```bash
# Clona el repositorio
git clone <URL_DEL_REPO>

# Instala dependencias
pnpm install

# Ejecuta en modo desarrollo
pnpm run dev

# Ejecuta en modo producción
pnpm run build
pnpm run start

#Usando Docker
docker-compose up -build
