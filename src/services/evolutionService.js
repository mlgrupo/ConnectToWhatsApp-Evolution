import axios from 'axios';
// Type Guard manual para detectar erro do axios
function isAxiosError(error) {
    return error.isAxiosError !== undefined;
}
const api = axios.create({
    baseURL: import.meta.env.VITE_EVOLUTION_BASE_URL,
    headers: {
        'apikey': import.meta.env.VITE_EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
    }
});
export const getInstances = async () => {
    try {
        const response = await api.get('/instance/fetchInstances');
        return response.data;
    }
    catch (error) {
        if (isAxiosError(error)) {
            const axiosError = error;
            console.error('Erro na requisição:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers
            });
        }
        else if (error instanceof Error) {
            console.error('Erro ao obter instâncias:', error.message);
        }
        else {
            console.error('Erro desconhecido ao obter instâncias:', error);
        }
        throw error;
    }
};
export const connectInstance = async (instanceName) => {
    const getQRCodeWithTimeout = async () => {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao gerar QR code')), 40000);
        });
        const connectPromise = (async () => {
            try {
                await api.delete(`/instance/logout/${instanceName}`).catch(() => {
                    // Ignora erro de desconexão
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await api.get(`/instance/connect/${instanceName}`);
                if (response.data.base64) {
                    return {
                        qrcode: response.data.base64,
                        state: 'pairing'
                    };
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                const retryResponse = await api.get(`/instance/connect/${instanceName}`);
                if (retryResponse.data.base64) {
                    return {
                        qrcode: retryResponse.data.base64,
                        state: 'pairing'
                    };
                }
                throw new Error('Não foi possível gerar o QR code');
            }
            catch (error) {
                throw error;
            }
        })();
        return Promise.race([connectPromise, timeoutPromise]);
    };
    try {
        return await getQRCodeWithTimeout();
    }
    catch (error) {
        return { state: 'close' };
    }
};
export const checkInstanceConnection = async (instanceName) => {
    try {
        const response = await api.get(`/instance/connectionState/${instanceName}`);
        return response.data.state === 'open' ? 'open' : 'close';
    }
    catch (error) {
        return 'close';
    }
};
