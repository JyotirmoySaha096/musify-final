FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=/musify-api
ENV NEXT_PUBLIC_BASE_PATH=/musify
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
