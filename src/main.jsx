import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import './index.css';
import App from './App.jsx';

// Configure native keyboard and scrolling behavior on iOS & Android
if (Capacitor.isNativePlatform()) {
  Keyboard.setScroll({ isDisabled: true }).catch(() => {});
  Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {});
}

// Keep visual viewport synchronized & prevent unwanted WKWebView document jumps
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

  // Prevent background rubber-band scrolling when any modal is active
  window.addEventListener('scroll', () => {
    if (document.body.dataset.modalOpen === 'true' && window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }, { passive: true });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
