FROM node:18-alpine

# Criar usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install serve -g && \
    npm install axios && \
    npm install

# Copia o resto dos arquivos
COPY . .

# Compila o projeto
RUN npm run build && \
    chown -R appuser:appgroup /app

# Mudar para usuário não-root
USER appuser

# Expõe a porta 91
EXPOSE 91

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]
