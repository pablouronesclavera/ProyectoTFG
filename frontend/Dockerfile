FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN apt-get update && apt-get install -y ffmpeg
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
