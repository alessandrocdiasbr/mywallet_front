import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';


// Verifique se o 'root' existe no HTML antes de tentar renderizar.
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Elemento root não encontrado no HTML!');
}
