import axios from 'axios';
import { Instance, ConnectionState } from '../types/Instance';

// Declaração manual dos tipos porque sua versão antiga do axios não exporta AxiosError e AxiosInstance
type AxiosInstance = ReturnType<typeof axios.create>;

type AxiosError = {
    isAxiosError: boolean;
    response?: {
        status?: number;
        data?: any;
        headers?: any;
    };
};

// Declaração global (mantendo como estava)
declare global {
    interface Window {
        _env_: {
            VITE_EVOLUTION_API_KEY: string;
            VITE_EVOLUTION_BASE_URL: string;
        };
    }
}

// Type Guard manual para detectar erro do axios
function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_EVOLUTION_BASE_URL,
    headers: {
        'apikey': import.meta.env.VITE_EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
    }
});

export const getInstances = async (): Promise<Instance[]> => {
    try {
        const response = await api.get('/instance/fetchInstances');
        return response.data as Instance[];
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Erro na requisição:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers
            });
        } else if (error instanceof Error) {
            console.error('Erro ao obter instâncias:', error.message);
        } else {
            console.error('Erro desconhecido ao obter instâncias:', error);
        }
        throw error;
    }
};

export const connectInstance = async (instanceName: string): Promise<{ qrcode?: string; state: ConnectionState }> => {
    const getQRCodeWithTimeout = async (): Promise<{ qrcode?: string; state: ConnectionState }> => {
        const timeoutPromise = new Promise<{ qrcode?: string; state: ConnectionState }>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao gerar QR code')), 40000);
        });

        const connectPromise = (async (): Promise<{ qrcode?: string; state: ConnectionState }> => {
            try {
                await api.delete(`/instance/logout/${instanceName}`).catch(() => {
                    // Ignora erro de desconexão
                });

                await new Promise(resolve => setTimeout(resolve, 1000));

                const response = await api.get<{ base64?: string }>(`/instance/connect/${instanceName}`);

                if (response.data.base64) {
                    return {
                        qrcode: response.data.base64,
                        state: 'pairing' as ConnectionState
                    };
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                const retryResponse = await api.get<{ base64?: string }>(`/instance/connect/${instanceName}`);

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

        return Promise.race([connectPromise, timeoutPromise]);
    };

    try {
        return await getQRCodeWithTimeout();
    } catch (error) {
        return { state: 'close' };
    }
};

export const checkInstanceConnection = async (instanceName: string): Promise<ConnectionState> => {
    try {
        const response = await api.get<{ state: string }>(`/instance/connectionState/${instanceName}`);
        return response.data.state === 'open' ? 'open' : 'close';
    } catch (error) {
        return 'close';
    }
};
