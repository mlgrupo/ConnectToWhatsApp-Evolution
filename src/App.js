import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, TextField } from '@mui/material';
import InstanceCard from './components/InstanceCard';
import { getInstances, connectInstance, checkInstanceConnection } from './services/evolutionService';
function App() {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const apiKey = import.meta.env.VITE_EVOLUTION_API_KEY;
    const baseUrl = import.meta.env.VITE_EVOLUTION_BASE_URL;
    useEffect(() => {
        loadInstances();
    }, []);
    const loadInstances = async () => {
        try {
            const data = await getInstances();
            if (Array.isArray(data)) {
                setInstances(data);
            }
            else {
                setError('Formato de dados inválido');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar instâncias');
        }
        finally {
            setLoading(false);
        }
    };
    const handleConnect = async (instanceName) => {
        try {
            const result = await connectInstance(instanceName);
            // Atualiza o estado da instância na lista
            setInstances(instances.map(inst => {
                if (inst.name === instanceName) {
                    return { ...inst, connectionStatus: result.state };
                }
                return inst;
            }));
            return result;
        }
        catch (error) {
            console.error('Erro ao conectar instância:', error);
            throw error;
        }
    };
    const handleCheckConnection = async (instanceName) => {
        try {
            const state = await checkInstanceConnection(instanceName);
            // Atualiza o estado da instância na lista
            setInstances(instances.map(inst => {
                if (inst.name === instanceName) {
                    return { ...inst, connectionStatus: state };
                }
                return inst;
            }));
            return state;
        }
        catch (error) {
            console.error('Erro ao verificar conexão:', error);
            throw error;
        }
    };
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: _jsx(CircularProgress, {}) }));
    }
    if (!apiKey || !baseUrl) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: _jsxs(Alert, { severity: "warning", sx: { maxWidth: 600, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h6", component: "h2", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "ATEN\u00C7\u00C3O" }), "Configure seu .env com as informa\u00E7\u00F5es necess\u00E1rias"] }) }));
    }
    if (error) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: _jsx(Typography, { color: "error", children: error }) }));
    }
    return (_jsxs(Container, { maxWidth: "xl", sx: { py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 4 } }, children: [_jsxs(Box, { sx: {
                    maxWidth: '800px',
                    mx: 'auto',
                    mb: { xs: 3, sm: 4 },
                    textAlign: 'center'
                }, children: [_jsx(Typography, { variant: "h3", component: "h1", sx: {
                            fontSize: { xs: '1.75rem', sm: '2.25rem' },
                            fontWeight: 600,
                            mb: { xs: 2, sm: 3 },
                            color: '#1a1a1a'
                        }, children: "WHATSAPPS RECONECTA" }), _jsx(TextField, { fullWidth: true, variant: "outlined", placeholder: "Pesquisar inst\u00E2ncias...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), sx: {
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        } })] }), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: { xs: 2, sm: 3 },
                    width: '100%',
                    maxWidth: '1400px',
                    mx: 'auto',
                    px: { xs: 1, sm: 2 },
                    '& > div': {
                        justifySelf: 'center',
                        width: '100%',
                        maxWidth: '320px'
                    }
                }, children: instances
                    .filter(instance => (instance.profileName || instance.name)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
                    .map((instance) => (_jsx(Box, { children: _jsx(InstanceCard, { instance: instance, onConnect: handleConnect, onCheckConnection: handleCheckConnection }) }, instance.name))) })] }));
}
export default App;
