import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/common/AppErrorBoundary.jsx'

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.addEventListener(
    'pageshow',
    () => window.requestAnimationFrame(() => window.scrollTo(0, 0)),
    { once: true },
  );
}

if (typeof document !== 'undefined') {
  const updateFavicon = () => {
    const existing = document.querySelectorAll("link[rel*='icon']");
    existing.forEach(el => el.remove());

    const svgLink = document.createElement('link');
    svgLink.rel = 'icon';
    svgLink.type = 'image/svg+xml';
    svgLink.href = `/favicon.svg?v=${Date.now()}`;
    document.head.appendChild(svgLink);

    const icoLink = document.createElement('link');
    icoLink.rel = 'alternate icon';
    icoLink.type = 'image/x-icon';
    icoLink.href = `/favicon.ico?v=${Date.now()}`;
    document.head.appendChild(icoLink);
  };

  try {
    updateFavicon();
  } catch {}
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
