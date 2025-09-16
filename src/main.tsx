import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppInitializer } from './services/initializeApp'

// Initialize the application without blocking render
AppInitializer.initialize().catch((error) => {
  console.warn('App initialization failed (non-critical):', error);
});

// Render app immediately - don't wait for storage initialization
createRoot(document.getElementById("root")!).render(<App />);
