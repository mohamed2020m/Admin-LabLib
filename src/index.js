import React from 'react';
import {createRoot} from 'react-dom/client';

import './css/index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
      <ContextProvider>
          <App />
      </ContextProvider>
  </React.StrictMode>
);
