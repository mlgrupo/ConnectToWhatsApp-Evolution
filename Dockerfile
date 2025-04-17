FROM node:18-alpine as builder

# Instala dependências de build
RUN apk add --no-cache python3 make g++

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto dos arquivos
COPY . .

# Compila o projeto
RUN npm run build

# Imagem de produção
FROM nginx:alpine

# Instala curl para healthcheck
RUN apk add --no-cache curl

# Remove a configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados
COPY --from=builder /app/build /usr/share/nginx/html

# Configura o nginx para usar a porta 91
RUN sed -i 's/listen 80/listen 91/g' /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 91

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]
