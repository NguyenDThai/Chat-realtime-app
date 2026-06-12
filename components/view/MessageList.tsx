import ReactionDetailModal from "@/components/modal/ReactionDetailModal";
import MessageContent from "@/components/view/MessageContent";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useSocket } from "@/hooks/useSocket";
import { reactToMessage } from "@/src/api/message.api";
import type { RootState } from "@/src/store";
import type { ReactionType } from "@/types/message.type";
import { formatDataSeparator } from "@/utils/formatDateSeparator";
import { Reply, ThumbsUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<
    ReactionType[] | null
  >(null);
  const { selectedRoom, message } = useSelector(
    (state: RootState) => state.chat,
  );

  const { user } = useAuth();
  const { fetchMessage } = useData();
  const socket = useSocket();

  // Hàm scroll xuống cuối tin nhắn
  const handleScrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleActionMessage = async (messageId: string, emoji: string) => {
    try {
      await reactToMessage(messageId, emoji);
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  useEffect(() => {
    handleScrollBottom();
  }, [message]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessage();
      socket.emit("join_room", selectedRoom._id);
    }
  }, [selectedRoom, fetchMessage, socket]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 custom-scrollbar">
      {message.map((msg, index) => {
        const isMe = msg.sender._id === user?._id;
        const prevMessage = message[index - 1];
        const showDateSeparator =
          !prevMessage ||
          new Date(msg.createdAt).toDateString() !==
            new Date(prevMessage.createdAt).toDateString();
        const myReaction = msg.reactions?.find(
          (r) =>
            (typeof r.user === "string" ? r.user : r.user._id) === user?._id,
        );
        return (
          <React.Fragment key={msg._id}>
            {/* Tag ngày tháng */}
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="text-[11px] bg-white/5 text-white/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm select-none">
                  {formatDataSeparator(msg.createdAt)}
                </span>
              </div>
            )}
            <div
              className={`flex items-center ${isMe ? "justify-end" : "justify-start"} animate-fade-in group`}
            >
              {/* Action message */}
              {isMe && (
                <button className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0">
                  <Reply size={18} />
                </button>
              )}
              {!isMe && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-800 flex items-center justify-center text-white text-xs font-bold uppercase border border-white/20">
                    {msg.sender.avatar ? (
                      <img
                        src={msg.sender.avatar}
                        alt={msg.sender.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      msg.sender.name.charAt(0)
                    )}
                  </div>
                </div>
              )}
              <div className={`max-w-[70%] min-w-0 ${isMe ? "order-1" : ""}`}>
                {!isMe && (
                  <p className="text-[10px] text-white/50 mb-1 ml-1">
                    {msg.sender.name}
                  </p>
                )}
                <div className="flex min-w-0 items-center">
                  <div
                    className={`relative rounded-2xl p-3 min-w-0 ${
                      isMe
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none"
                        : "bg-white/10 border border-white/20 text-white rounded-tl-none"
                    }`}
                  >
                    <MessageContent content={msg.content} isMe={isMe} />
                    {/* Hiển thị danh sách reaction đã thả khi không hover */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`absolute z-10 -bottom-3.5 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-white/20 shadow-md text-[10px] select-none cursor-pointer`}
                        style={{
                          left: isMe ? "-16px" : "auto",
                          right: !isMe ? "-16px" : "auto",
                        }}
                        onClick={() =>
                          setSelectedReaction(msg.reactions || null)
                        }
                      >
                        {Array.from(new Set(msg.reactions.map((r) => r.emoji)))
                          .slice(0, 3)
                          .map((emoji) => (
                            <span key={emoji} className="text-xs">
                              {emoji}
                            </span>
                          ))}
                        {msg.reactions.length > 0 && (
                          <span className="text-[10px] text-white/80 font-medium ml-1">
                            {msg.reactions.length}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className="group/reactions absolute z-10 -bottom-4 group-hover:flex hidden items-center justify-center w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 border border-white/20 shadow-md text-white/90 cursor-pointer transition-all duration-150"
                      style={{
                        left: isMe ? "auto" : "-16px",
                        right: isMe ? "-16px" : "auto",
                      }}
                    >
                      {myReaction ? (
                        <span
                          className="text-[15px] select-none flex items-center justify-center"
                          onClick={() =>
                            handleActionMessage(msg._id, myReaction.emoji)
                          }
                        >
                          {myReaction.emoji}
                        </span>
                      ) : (
                        <ThumbsUp
                          size={18}
                          onClick={() => handleActionMessage(msg._id, "👍")}
                        />
                      )}
                      {/* Bảng chọn Emoji hiển thị khi hover vào nút Like */}
                      <div
                        className={`absolute bottom-full mb-1.5 ${isMe ? "right-4" : "left-4"} hidden group-hover/reactions:flex items-center gap-3 px-3 py-2 rounded-full bg-emerald-955/95 border border-white/25 backdrop-blur-md shadow-2xl animate-fade-in z-50 before:absolute before:h-3 before:w-full before:top-full before:left-0 before:content-['']`}
                      >
                        {["👍", "❤️", "😆", "😮", "😢", "😡"].map((emoji) => (
                          <span
                            key={emoji}
                            onClick={() => handleActionMessage(msg._id, emoji)}
                            className="hover:scale-135 active:scale-95 transition-transform duration-100 text-xl cursor-pointer select-none px-0.5"
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>{" "}
                  </div>

                  {/* Action message */}
                  {!isMe && (
                    <button className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0">
                      <Reply size={16} />
                    </button>
                  )}
                </div>
                <p
                  className={`text-[10px] text-white/40 mt-4 ${
                    isMe ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <ReactionDetailModal
        isOpen={!!selectedReaction}
        isClose={() => {
          setSelectedReaction(null);
        }}
        reactions={selectedReaction}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
