import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './ui/App';
import { startGame } from './render/Game';

if (typeof window !== 'undefined') {
  startGame(document.getElementById('game-root')!);
}

createRoot(document.getElementById('hud-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
