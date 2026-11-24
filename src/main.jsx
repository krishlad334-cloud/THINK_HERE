import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Force browser tab and credential managers to refresh the Option 2 favicon
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
    <App />
  </StrictMode>,
)
