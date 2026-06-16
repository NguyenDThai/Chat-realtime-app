/* eslint-disable react-refresh/only-export-components */
import { socket } from "@/config/socket";
import { useAuth } from "@/hooks/useAuth";
import { createContext, useEffect } from "react";

export const SocketContext = createContext<typeof socket | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.auth = { userId: user._id };
      // Tu dong ket noi socket
      socket.connect();
      console.warn("Socket connected globally for user:", user.name);
    } else {
      // Ngat ket noi socket khi logout
      socket.disconnect();
      console.warn("Socket disconnected globally");
    }

    // Cleanup function khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
