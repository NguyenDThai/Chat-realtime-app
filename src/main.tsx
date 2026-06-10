import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/src/store";
import { router } from "./routes";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { SocketProvider } from "@/context/SocketContext";
import ChatInitializer from "@/components/share/ChatInitializer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ConfirmProvider>
          <SocketProvider>
            <ChatInitializer>
              <RouterProvider router={router} />
              <ToastContainer position="bottom-right" />
            </ChatInitializer>
          </SocketProvider>
        </ConfirmProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
