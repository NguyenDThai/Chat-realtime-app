import ReactionDetailModal from "@/components/modal/ReactionDetailModal";
import MessageContent from "@/components/view/MessageContent";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useSocket } from "@/hooks/useSocket";
import {
  deleteMessageApi,
  getMessage,
  reactToMessage,
  recallMessageApi,
} from "@/src/api/message.api";
import type { RootState } from "@/src/store";
import {
  deleteMessage,
  prependMessages,
  recallMessage,
  setReplyMessage,
} from "@/src/store/slides/chatSlide";
import type { ReactionType } from "@/types/message.type";
import { formatDataSeparator } from "@/utils/formatDateSeparator";
import axios from "axios";
import {
  CornerDownRight,
  Loader2,
  Reply,
  RotateCcw,
  ThumbsUp,
  Trash,
} from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<
    ReactionType[] | null
  >(null);
  // Để biết còn tin nhắn để load tiếp không
  const [hasMore, setHasMore] = useState<boolean>(true);
  // trạng thái đang call api để lấy tin nhắn cũ
  const [isLoadingOlder, setIsLoadingOlder] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Để lưu lại chiều cao scroll trước khi load tin nhắn cũ
  const prevScrollHeightRef = useRef<number>(0);
  const isPrependingRef = useRef<boolean>(false);
  const { selectedRoom, message } = useSelector(
    (state: RootState) => state.chat,
  );

  const { user } = useAuth();
  const { fetchMessage } = useData();
  const socket = useSocket();
  const dispatch = useDispatch();

  // Hàm scroll xuống cuối tin nhắn
  const handleScrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Call api action message
  const handleActionMessage = async (messageId: string, emoji: string) => {
    try {
      await reactToMessage(messageId, emoji);
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  const handleRecallMessage = async (messageId: string) => {
    try {
      const res = await recallMessageApi(messageId);
      if (res) {
        dispatch(recallMessage(messageId));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "Không thể thu hồi tin nhắn",
        );
      }
    }
  };

  const handlDeleteMessage = async (messageId: string) => {
    try {
      const res = await deleteMessageApi(messageId);
      if (res) {
        dispatch(deleteMessage(messageId));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Không thể xóa tin nhắn");
      }
    }
  };

  // Hàm load tin nhắn cũ
  const loadOlderMessages = async () => {
    if (isLoadingOlder || !hasMore || !selectedRoom || message.length === 0)
      return;

    const container = scrollContainerRef.current;
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight;
    }
    setIsLoadingOlder(true);

    try {
      const oldestMessage = message[0];
      const cursor = oldestMessage.createdAt;

      const newMessage = await getMessage(selectedRoom._id, cursor, 20);

      if (newMessage.length < 20) {
        setHasMore(false);
      }

      if (newMessage.length > 0) {
        isPrependingRef.current = true;
        dispatch(prependMessages(newMessage));
      }
    } catch (error) {
      console.error("Error loading older messages:", error);
    } finally {
      setIsLoadingOlder(false);
    }
  };

  // Hàm cuộn tới tin nhắn góc khi click vào field reply
  const handleScrollToOriginal = (messageId: string) => {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add(
        "bg-emerald-500/20",
        "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      );

      setTimeout(() => {
        element.classList.remove(
          "bg-emerald-500/20",
          "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        );
      }, 1000);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Khi cuộn sát lên top (scrollTop === 0) hoặc cách top 1 khoảng nhỏ (e.g. <= 50px)
    if (container.scrollTop <= 50 && !isLoadingOlder && hasMore) {
      loadOlderMessages();
    }
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (isPrependingRef.current) {
      const scrollDiff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = container.scrollTop + scrollDiff;
      isPrependingRef.current = false;
    } else {
      handleScrollBottom();
    }
  }, [message]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessage();
      socket.emit("join_room", selectedRoom._id);
    }
  }, [selectedRoom, fetchMessage, socket]);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 py-6 bg-emerald-700/5 space-y-4 px-6 overflow-y-auto overflow-x-hidden custom-scrollbar"
    >
      {isLoadingOlder && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-white/50" size={24} />
        </div>
      )}
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
              id={`msg-${msg._id}`}
              className={`flex items-center ${isMe ? "justify-end" : "justify-start"} animate-fade-in group rounded-2xl transition-all duration-300 p-1`}
            >
              {/* Action message */}
              {isMe && !msg.isRecalled && (
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      dispatch(setReplyMessage(msg));
                      handleScrollBottom();
                    }}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <Reply size={18} />
                  </button>

                  <button
                    onClick={() => handleRecallMessage(msg._id)}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => handlDeleteMessage(msg._id)}
                    className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                  >
                    <Trash size={18} />
                  </button>
                </div>
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

                {msg.replyTo && (
                  <div
                    onClick={() =>
                      msg.replyTo && handleScrollToOriginal(msg.replyTo._id)
                    }
                    className={`mb-2 px-3 py-1.5 bg-black/20 rounded-lg border-l-[3px] border-emerald-400 text-xs flex flex-col min-w-0 select-none cursor-pointer ${isMe ? "ml-auto" : "mr-auto"}`}
                  >
                    <div className="flex items-center gap-1 font-semibold text-emerald-300 text-[10px] mb-0.5">
                      <span className="text-[12px] font-bold">
                        <CornerDownRight size={12} />
                      </span>
                      <span>{msg.replyTo.sender?.name || "Người dùng"}</span>
                    </div>
                    <span className="text-white/50 text-[11px] leading-relaxed truncate max-w-[280px]">
                      {msg.replyTo.content}
                    </span>
                  </div>
                )}

                <div
                  className={`flex min-w-0 items-center ${isMe ? "ml-auto justify-end" : "mr-auto justify-start"}`}
                >
                  <div
                    className={`relative rounded-2xl p-3 min-w-0 ${
                      isMe
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none"
                        : "bg-white/10 border border-white/20 text-white rounded-tl-none"
                    }`}
                  >
                    {msg.isRecalled ? (
                      <p className="text-sm italic text-white select-none">
                        Tin nhắn đã bị thu hồi
                      </p>
                    ) : (
                      <MessageContent content={msg.content} isMe={isMe} />
                    )}
                    {/* Hiển thị danh sách reaction đã thả khi không hover */}
                    {!msg.isRecalled &&
                      msg.reactions &&
                      msg.reactions.length > 0 && (
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
                          {Array.from(
                            new Set(msg.reactions.map((r) => r.emoji)),
                          )
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

                    {!msg.isRecalled && (
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
                              onClick={() =>
                                handleActionMessage(msg._id, emoji)
                              }
                              className="hover:scale-135 active:scale-95 transition-transform duration-100 text-xl cursor-pointer select-none px-0.5"
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action message */}
                  {!isMe && !msg.isRecalled && (
                    <div className="flex items-center">
                      <button
                        onClick={() => dispatch(setReplyMessage(msg))}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                      >
                        <Reply size={16} />
                      </button>
                      <button
                        onClick={() => handlDeleteMessage(msg._id)}
                        className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
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
        reactions={selectedReaction || []}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
