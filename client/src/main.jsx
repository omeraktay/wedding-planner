import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
<Auth0Provider
  domain="your-domain.auth0.com"
  clientId="your-client-id"
  authorizationParams={{ redirect_uri: window.location.origin }}
>
  <App />
</Auth0Provider>
)
