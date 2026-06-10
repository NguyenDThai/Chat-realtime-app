import { createMessage } from "@/src/api/message.api";
import type { RootState } from "@/src/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ChatInput = () => {
  const [text, setText] = useState("");
  const { selectedRoom } = useSelector((state: RootState) => state.chat);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createMessage({
        conversationId: selectedRoom._id,
        content: text.trim(),
      });

      setText("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="p-4 border-t border-white/20 bg-gradient-to-t from-emerald-900/30 to-transparent">
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-3"
      >
        <button
          type="button"
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Nhập tin nhắn của bạn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50"
        />
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-500/30"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
