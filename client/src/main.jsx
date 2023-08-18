import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './Context/ContextForSocket'


ReactDOM.createRoot(document.getElementById('root')).render(
    //making "app" child
    <SocketProvider>
    <App />
    </SocketProvider>
)
