import React from "react";
import { useChat } from "@/hooks/useChat";

const ChatInitializer = ({ children }: { children: React.ReactNode }) => {
  useChat();
  return <>{children}</>;
};

export default ChatInitializer;
