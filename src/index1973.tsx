import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Ennorath1973 from './pages/ennorath1973';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <Ennorath1973 />
  </StrictMode>
);
