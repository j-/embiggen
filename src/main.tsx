import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './update-svh';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
