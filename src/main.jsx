import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import './index.css';
import App from './App.jsx';

// Configure native keyboard behavior on iOS & Android
if (Capacitor.isNativePlatform()) {
  Keyboard.setScroll({ isDisabled: false }).catch(() => {});
  Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {});
}

// Keep visual viewport synchronized
if (typeof window !== 'undefined') {
  const syncViewport = () => {
    if (window.visualViewport) {
      document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport.height}px`);
    }
  };

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewport);
    window.visualViewport.addEventListener('scroll', syncViewport);
    syncViewport();
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
