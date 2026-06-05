import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { SocketProvider } from "@/context/SocketContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ConfirmProvider>
        <SocketProvider>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" />
        </SocketProvider>
      </ConfirmProvider>
    </AuthProvider>
  </StrictMode>,
);
