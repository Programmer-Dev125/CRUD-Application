import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { useEffect } from "react";

useEffect(() => {
  const toSource = new EventSource(
    "https://crud-application-nine-kohl.vercel.app/api/mongo/toApiKey",
    { withCredentials: true }
  );
  toSource.addEventListener("message", () => {
    toSource.close();
  });
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
