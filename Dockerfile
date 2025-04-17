FROM node:18-alpine as builder

# Instala dependências de build
RUN apk add --no-cache python3 make g++ git

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências com cache limpo
RUN npm cache clean --force && \
    npm ci

# Copia o resto dos arquivos
COPY . .

# Compila o projeto
RUN npm run build && \
    npm cache clean --force

# Imagem de produção
FROM nginx:alpine

# Instala dependências e configura nginx
RUN apk add --no-cache curl && \
    rm -rf /usr/share/nginx/html/* && \
    sed -i 's/listen 80/listen 91/g' /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados
COPY --from=builder /app/build /usr/share/nginx/html

# Configurações do nginx para melhor performance
RUN echo '\
server {\
    listen 91;\
    server_name localhost;\
    root /usr/share/nginx/html;\
    index index.html;\
    location / {\
        try_files $uri $uri/ /index.html;\
        add_header Cache-Control "no-store, no-cache, must-revalidate";\
    }\
    location /static/ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
    gzip on;\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\
}' > /etc/nginx/conf.d/default.conf

# Expõe a porta 91
EXPOSE 91

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]
