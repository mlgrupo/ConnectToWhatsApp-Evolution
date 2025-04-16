import axios from 'axios';
import { Instance, ConnectionState } from '../types/Instance';

const api = axios.create({
    baseURL: process.env.REACT_APP_EVOLUTION_BASE_URL,
    headers: {
        'apikey': process.env.REACT_APP_EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
    }
});

// Log para verificar as configurações
console.log('API Config:', {
    baseURL: process.env.REACT_APP_EVOLUTION_BASE_URL,
    apiKey: process.env.REACT_APP_EVOLUTION_API_KEY
});

export const getInstances = async (): Promise<Instance[]> => {
    try {
        console.log('Fazendo requisição para obter instâncias...');
        const response = await api.get('/instance/fetchInstances');
        console.log('Resposta recebida:', response.data);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na requisição:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
        } else {
            console.error('Erro ao obter instâncias:', error);
        }
        throw error;
    }
};

export const connectInstance = async (instanceName: string): Promise<{ qrcode?: string; state: ConnectionState }> => {
    // Função para tentar obter o QR code com timeout
    const getQRCodeWithTimeout = async (): Promise<{ qrcode?: string; state: ConnectionState }> => {
        const timeoutPromise = new Promise<{ qrcode?: string; state: ConnectionState }>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao gerar QR code')), 40000); // 40 segundos
        });

        const connectPromise = (async () => {
            try {
                // Tenta desconectar primeiro
                await api.delete(`/instance/logout/${instanceName}`).catch(err => {
                    // Ignora erro de desconexão pois pode ser que a instância já esteja desconectada
                });

                // Pequena pausa
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Tenta conectar
                const response = await api.get(`/instance/connect/${instanceName}`);


                if (response.data.base64) {
                    return {
                        qrcode: response.data.base64,
                        state: 'pairing' as ConnectionState
                    };
                }

                // Se não tem QR code, tenta novamente
                await new Promise(resolve => setTimeout(resolve, 1000));
                const retryResponse = await api.get(`/instance/connect/${instanceName}`);
                
                if (retryResponse.data.base64) {
                    return {
                        qrcode: retryResponse.data.base64,
                        state: 'pairing' as ConnectionState
                    };
                }

                throw new Error('Não foi possível gerar o QR code');
            } catch (error) {
                throw error;
            }
        })();

        try {
            // Retorna o que completar primeiro: ou o QR code ou o timeout
            return await Promise.race([connectPromise, timeoutPromise]);
        } catch (error) {

            throw error;
        }
    };

    try {
        return await getQRCodeWithTimeout();
    } catch (error) {

        return { state: 'close' };
    }
};

export const checkInstanceConnection = async (instanceName: string): Promise<ConnectionState> => {
    try {
        const response = await api.get(`/instance/connectionState/${instanceName}`);
        console.log('Estado da conexão:', response.data);

        if (response.data.state === 'open') {
            return 'open';
        }

        // Se não está open mas tem código, considera como fechado
        return 'close';
    } catch (error) {

        return 'close';
    }
};
