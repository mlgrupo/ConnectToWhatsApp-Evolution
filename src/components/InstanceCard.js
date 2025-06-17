import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, CircularProgress, Typography } from '@mui/material';
import ProfileIcon from './ProfileIcon';
import './InstanceCard.css';
const InstanceCard = ({ instance, onConnect, onCheckConnection }) => {
    const [openQR, setOpenQR] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectionState, setConnectionState] = useState(instance.connectionStatus || 'close');
    const [error, setError] = useState('');
    const [checkCount, setCheckCount] = useState(0);
    const [timeoutMessage, setTimeoutMessage] = useState(false);
    const handleConnect = async () => {
        if (connectionState === 'open') {
            return;
        }
        setLoading(true);
        setOpenQR(true);
        setTimeoutMessage(false);
        setCheckCount(0);
        try {
            const result = await onConnect(instance.name);
            setConnectionState(result.state);
            if (result.qrcode && result.state !== 'open') {
                instance.qrcode = result.qrcode;
            }
            else {
                instance.qrcode = undefined;
                setOpenQR(false);
            }
            // Se estiver em processo de pareamento ou conectando, inicia polling
            if (result.state === 'pairing' || result.state === 'connecting') {
                setCheckCount(0); // Reseta o contador
                const checkInterval = setInterval(async () => {
                    const state = await onCheckConnection(instance.name);
                    setConnectionState(state);
                    if (state === 'open') {
                        clearInterval(checkInterval);
                        instance.qrcode = undefined;
                        setOpenQR(false);
                        return;
                    }
                    // Incrementa o contador
                    setCheckCount(prev => {
                        const newCount = prev + 1;
                        // Se atingiu 12 checagens (2 minutos)
                        if (newCount >= 12) {
                            clearInterval(checkInterval);
                            setTimeoutMessage(true);
                            return prev;
                        }
                        return newCount;
                    });
                }, 10000); // Verifica a cada 10 segundos
            }
        }
        catch (error) {
            setError('Erro ao conectar instância');
            setConnectionState('close');
            setOpenQR(false);
            instance.qrcode = undefined;
        }
        finally {
            // Só remove o loading quando tiver o QR code ou der erro
            if (instance.qrcode || error) {
                setLoading(false);
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "instance-card", children: [_jsxs("div", { className: "profile-image", children: [instance.profilePicUrl ? (_jsx("img", { src: instance.profilePicUrl, alt: instance.name, loading: "lazy", onError: (e) => {
                                    const target = e.target;
                                    target.style.display = 'none';
                                } })) : null, _jsx("div", { className: "profile-icon", style: { display: instance.profilePicUrl ? 'none' : 'flex' }, children: _jsx(ProfileIcon, {}) })] }), _jsxs("div", { className: "profile-info", children: [_jsx("div", { className: "profile-name", children: instance.profileName || instance.name }), _jsx("div", { className: `profile-status ${connectionState === 'open' ? 'status-connected' :
                                    connectionState === 'connecting' ? 'status-connecting' :
                                        connectionState === 'pairing' ? 'status-pairing' :
                                            'status-disconnected'}`, children: connectionState === 'open' ? 'Conectado' :
                                    connectionState === 'connecting' ? 'Conectando...' :
                                        connectionState === 'pairing' ? 'Aguardando QR Code...' :
                                            'Desconectado' }), _jsx("button", { className: `connect-button ${connectionState === 'open' ? 'connected' : 'disconnected'}`, onClick: handleConnect, disabled: false, children: connectionState === 'open' ? 'Conectado' :
                                    connectionState === 'connecting' ? 'Reconectar' :
                                        connectionState === 'pairing' ? 'Reconectar' :
                                            'Conectar' })] })] }), _jsxs(Dialog, { open: openQR, onClose: () => {
                    if (!loading)
                        setOpenQR(false);
                }, "aria-labelledby": "qr-dialog-title", "aria-describedby": "qr-dialog-description", keepMounted: false, disablePortal: false, disableScrollLock: false, disableEscapeKeyDown: loading, style: { pointerEvents: loading ? 'none' : 'auto' }, children: [_jsx(DialogTitle, { id: "qr-dialog-title", children: "Conectar Inst\u00E2ncia" }), _jsx(DialogContent, { id: "qr-dialog-description", children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }, children: (loading || !instance.qrcode) ? (_jsxs("div", { style: { textAlign: 'center', padding: '20px' }, children: [_jsx(CircularProgress, { "aria-label": "Gerando QR Code" }), _jsx(Typography, { style: { marginTop: '15px' }, children: "Gerando QR Code..." })] })) : timeoutMessage ? (_jsxs("div", { style: { textAlign: 'center', padding: '20px' }, children: [_jsx(Typography, { variant: "h6", style: { color: '#f44336', marginBottom: '15px' }, children: "Infelizmente n\u00E3o foi poss\u00EDvel conectar" }), _jsx(Typography, { style: { marginBottom: '20px', color: '#666' }, children: "Por favor, tente novamente mais tarde." }), _jsx("button", { className: "success-button", onClick: () => {
                                            setOpenQR(false);
                                            setTimeoutMessage(false);
                                        }, style: {
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '1em'
                                        }, children: "Fechar" })] })) : connectionState === 'open' ? (_jsxs("div", { className: "success-content", children: [_jsx("img", { src: instance.profilePicUrl || '/default-profile.png', alt: instance.profileName || instance.name, style: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px' } }), _jsx(Typography, { variant: "h6", style: { color: '#4CAF50', marginBottom: '10px' }, children: "Inst\u00E2ncia Conectada!" }), _jsx(Typography, { variant: "body1", style: { marginBottom: '20px' }, children: instance.profileName || instance.name }), _jsx("button", { className: "success-button", onClick: () => setOpenQR(false), style: {
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '1em'
                                        }, children: "OK" })] })) : instance.qrcode ? (_jsxs(_Fragment, { children: [_jsx("img", { src: instance.qrcode, alt: "QR Code para conex\u00E3o", style: { width: '256px', height: '256px' } }), _jsx(Typography, { children: "Escaneie o QR Code no WhatsApp" }), _jsxs(Typography, { variant: "caption", style: { color: '#666' }, children: ["Tentativa ", checkCount, "/12"] })] })) : (_jsx("div", { role: "alert", children: "QR Code n\u00E3o dispon\u00EDvel" })) }) })] }), _jsxs(Dialog, { open: !!error, onClose: () => setError(''), "aria-labelledby": "error-dialog-title", "aria-describedby": "error-dialog-description", keepMounted: false, disablePortal: true, children: [_jsx(DialogTitle, { id: "error-dialog-title", children: "Aviso" }), _jsx(DialogContent, { id: "error-dialog-description", children: _jsx("div", { role: "alert", children: error }) })] })] }));
};
export default InstanceCard;
