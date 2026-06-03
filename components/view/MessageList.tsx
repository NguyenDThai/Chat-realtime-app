import React, { useState } from "react";

interface MessageType {
  id: string;
  sender: "user" | "bot" | string;
  senderName?: string;
  text: string;
  time: string;
}

const MessageList = ({ isTyping }: { isTyping: boolean }) => {
  const [messages] = useState<MessageType[]>([
    {
      id: "1",
      sender: "bot",
      senderName: "Bot Hỗ Trợ",
      text: "Xin chào! Đây là tin nhắn mẫu để hiển thị giao diện.",
      time: "10:00 AM",
    },
    {
      id: "2",
      sender: "user",
      text: "Chào bạn! Mình muốn test thử giao diện khung chat này.",
      time: "10:01 AM",
    },
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
        >
          {message.sender === "bot" && (
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
          )}
          <div
            className={`max-w-[70%] ${message.sender === "user" ? "order-1" : ""}`}
          >
            <div
              className={`rounded-2xl p-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            <p
              className={`text-xs text-white/50 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
            >
              {message.time}
            </p>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
