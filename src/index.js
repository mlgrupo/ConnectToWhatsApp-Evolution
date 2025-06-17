import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, createTheme } from '@mui/material';
import App from './App';
import './index.css';
const theme = createTheme();
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(App, {})] }) }));
