# Etapa de build
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de produção
FROM node:18

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json ./

RUN npm install --only=production

CMD ["node", "dist/index.js"]
