# 📂 Estructura principal del proyecto

- `public/`: Archivos públicos como imágenes o iconos accesibles desde el navegador.
- `src/`: Código fuente de la aplicación.
  - `app/`: Componentes principales y vistas del frontend.
  - `services/`: Lógica de comunicación con las APIs.
- `docker-compose.yml`: Configuración para el despliegue con Docker.
- `Dockerfile`: Imagen de Docker para el frontend.
- `next.config.ts`: Configuración de Next.js.
- `package.json`: Dependencias y scripts del proyecto.
- `pnpm-lock.yaml`: Bloqueo de versiones de las dependencias.
- `tailwind.config.ts`: Configuración de Tailwind CSS.
- `tsconfig.json`: Configuración de TypeScript.
- `README.md`: Este archivo, guía del frontend.




# Instrucciones relevantes

## Ejecuta en modo desarrollo
pnpm run dev

Observar en http://localhost:3000/ 

## Ejecuta en modo producción
pnpm run build

pnpm run start

## Usando Docker
docker-compose up --build

Observar en http://localhost:8080/ 

### Más información

Para obtener más información sobre Next.js, consulta los siguientes recursos:

- Documentación de Next.js](https://nextjs.org/docs): información sobre las funciones y la API de Next.js.
- Learn Next.js](https://nextjs.org/learn) - un tutorial interactivo de Next.js.

Puedes consultar [el repositorio GitHub de Next.js](https://github.com/vercel/next.js) - ¡tus comentarios y contribuciones son bienvenidos!

### Despliegue en Vercel

La forma más sencilla de desplegar tu aplicación Next.js es utilizar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Echa un vistazo a nuestra [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.
