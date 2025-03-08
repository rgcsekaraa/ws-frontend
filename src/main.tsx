import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import CreatorCredit from './CreatorCredit.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CreatorCredit />
  </StrictMode>
);
