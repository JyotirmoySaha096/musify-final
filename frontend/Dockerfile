FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=/musify-api
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
