import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ojb6jwvu0a36hbex.us.auth0.com"
      clientId="OypGzh938aWgJuR9jWMwJtApLO9OEXvr"
      authorizationParams={{
        redirect_uri: "http://localhost:5173/profile"
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
)