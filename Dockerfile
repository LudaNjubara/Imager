FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY .env.local ./.env.local
COPY next.config.js ./next.config.js

CMD ["npm", "run", "dev"]