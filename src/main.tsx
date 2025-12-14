import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./index.css";
import App from "./App.tsx";
import { setupInterceptors } from "@/api/setupInterceptors";

// 初始化 API 攔截器
setupInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
