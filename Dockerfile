FROM node:18-alpine

# Criar usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências e configura permissões
RUN npm install serve -g && \
    npm install axios && \
    npm install && \
    mkdir -p /app/.cache && \
    chown -R appuser:appgroup /app /app/.cache

# Copia o resto dos arquivos
COPY . .

# Compila o projeto e ajusta permissões
RUN npm run build && \
    chown -R appuser:appgroup /app

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 91

# Iniciar servidor com opções de cache
CMD ["serve", "-s", "build", "-l", "91", "--no-clipboard", "--symlinks"]
