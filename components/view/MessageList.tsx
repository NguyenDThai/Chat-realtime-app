import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { getMessage } from "@/src/api/message.api";
import type { ChatListType } from "@/types/list.chat.type";
import { useEffect, useRef, useState } from "react";

const MessageList = ({ selectedRoom }: { selectedRoom: ChatListType }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const socket = useSocket();

  // Hàm scroll xuống cuối tin nhắn
  const handleScrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    handleScrollBottom();
  }, [messages]);

  const fetchMessage = async () => {
    try {
      const res = await getMessage(selectedRoom._id);
      setMessages(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      fetchMessage();
      socket.emit("join_room", selectedRoom._id);
    }
  }, [selectedRoom]);

  // Lắng nghe tin nhắn mới từ socket

  useEffect(() => {
    const handleReceiveMessage = (newMessage: any) => {
      if (selectedRoom && newMessage.conversationId === selectedRoom._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("new_message", handleReceiveMessage);

    return () => {
      socket.off("new_message", handleReceiveMessage);
    };
  }, [socket, selectedRoom]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((message) => {
        const isMe = message.sender._id === user._id;
        return (
          <div
            key={message._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            {!isMe && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-800 flex items-center justify-center text-white text-xs font-bold uppercase border border-white/20">
                  {message.sender.avatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    message.sender.name.charAt(0)
                  )}
                </div>
              </div>
            )}
            <div className={`max-w-[70%] ${isMe ? "order-1" : ""}`}>
              {!isMe && (
                <p className="text-[10px] text-white/50 mb-1 ml-1">
                  {message.sender.name}
                </p>
              )}
              <div
                className={`rounded-2xl p-3 ${
                  isMe
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <p
                className={`text-[10px] text-white/40 mt-1 ${
                  isMe ? "text-right" : "text-left"
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
