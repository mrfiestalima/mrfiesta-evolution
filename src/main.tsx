import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./media.css";
import "./event-media.css";
import "./celebration-modal.css";
import "./controls.css";
import "./commercial.css";
import "./responsive-media.css";

const root = document.getElementById("root")!;
const initial = JSON.parse(
  document.getElementById("site-data")?.textContent || "null",
);
const app = (
  <StrictMode>
    <App initial={initial} />
  </StrictMode>
);
if (initial && !location.search.includes("preview=")) hydrateRoot(root, app);
else createRoot(root).render(app);

import "./evolution.css";
