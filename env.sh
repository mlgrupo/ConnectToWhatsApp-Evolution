#!/bin/sh

# Substitui as variáveis de ambiente no arquivo de configuração
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Executa o nginx
exec nginx -g 'daemon off;'
