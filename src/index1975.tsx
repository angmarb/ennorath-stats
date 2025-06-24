import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Ennorath1975 from './pages/ennorath1975';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <Ennorath1975 />
  </StrictMode>
);
