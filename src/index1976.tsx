import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Ennorath1976 from './pages/ennorath1976';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <Ennorath1976 />
  </StrictMode>
);
