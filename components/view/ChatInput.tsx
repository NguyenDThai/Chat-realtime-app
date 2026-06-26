import { createMessage } from "@/src/api/message.api";
import type { RootState } from "@/src/store";
import { setReplyMessage } from "@/src/store/slides/chatSlide";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatInput = () => {
  const [text, setText] = useState("");
  const { selectedRoom, replyingMessage } = useSelector(
    (state: RootState) => state.chat,
  );
  const dispatch = useDispatch();

  if (!selectedRoom) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createMessage({
        conversationId: selectedRoom._id,
        content: text.trim(),
        replyTo: replyingMessage?._id,
      });

      setText("");
      dispatch(setReplyMessage(null));
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="p-4 border-t border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-[#1A1A1A]">
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-3"
      >
        <button
          type="button"
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <svg
            className="w-6 h-6 text-slate-500 dark:text-white/70"
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
          className="flex-1 px-2 py-2 bg-slate-100 dark:bg-zinc-900 border rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]/50 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
        />
        <button
          type="submit"
          className="p-3 bg-[var(--color-theme-primary)] rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
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
