import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Could not find root element');

const rootElement = ReactDOM.createRoot(root);
rootElement.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
