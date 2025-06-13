
FROM node:18


RUN corepack enable && corepack prepare pnpm@latest --activate


WORKDIR /app


COPY package.json pnpm-lock.yaml ./


COPY prisma ./prisma


RUN pnpm install


RUN npx prisma generate


COPY . .


EXPOSE 5000


CMD ["pnpm", "run", "dev"]