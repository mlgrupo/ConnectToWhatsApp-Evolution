# Reconecta WhatsApp

Interface web para gerenciamento de instâncias do WhatsApp usando a Evolution API.

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
REACT_APP_EVOLUTION_API_KEY=sua_chave_api
REACT_APP_EVOLUTION_BASE_URL=http://seu_servidor:porta
```

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start
```

## Deploy com Docker

```bash
# Construir e iniciar contêiner
docker-compose up -d --build
```

## Deploy no Portainer

1. Faça login no Portainer
2. Vá em Stacks > Add stack
3. Cole o conteúdo do `docker-compose.yml`
4. Configure as variáveis de ambiente:
   - REACT_APP_EVOLUTION_API_KEY
   - REACT_APP_EVOLUTION_BASE_URL
5. Deploy the stack

## Segurança

- Todas as credenciais sensíveis devem ser configuradas via variáveis de ambiente
- O arquivo `.env` nunca deve ser commitado no repositório
- A aplicação usa HTTPS por padrão em produção
- Headers de segurança configurados no nginx
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
