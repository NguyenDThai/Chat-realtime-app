import type { ReactionType } from "@/types/message.type";
import type { UserType } from "@/types/user.type";
import { X } from "lucide-react";
import { useState } from "react";

interface ReactionDetailType {
  isOpen: boolean;
  isClose: () => void;
  reactions: ReactionType[];
}

const ReactionDetailModal = ({
  isOpen,
  isClose,
  reactions,
}: ReactionDetailType) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (!isOpen) return null;

  const emojiGroups = reactions.reduce(
    (acc, curr) => {
      const emoji = curr.emoji;
      if (!acc[emoji]) {
        acc[emoji] = [];
      }
      acc[emoji].push(curr);
      return acc;
    },
    {} as Record<string, ReactionType[]>,
  );

  //   Danh sách các emoji  duy nhất có trong reactions
  const uniqueEmoji = Object.keys(emojiGroups);

  // Lọc danh sách dựa trên tab đã chọn
  const displayActions =
    activeTab === "all" ? reactions : emojiGroups[activeTab] || [];

  // Lấy ra tất cả các emoji mà một người đã thả cụ thể của tin nhắn này
  //   const getUserAllEmojis = (userId: string) => {
  //     return reactions
  //       .filter((r) => {
  //         const rUserId = typeof r.user === "string" ? r.user : r.user._id;
  //         return rUserId === userId;
  //       })
  //       .map((r) => r.emoji);
  //   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Box */}
      <div className="relative w-full max-w-lg h-[400px] flex flex-col bg-emerald-950/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden text-white animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold">Biểu cảm</h3>
          <button
            onClick={() => {
              isClose();
              setActiveTab("all");
            }}
            className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* Content Body */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar bên trái - Các Tab emoji */}
          <div className="w-1/3 border-r border-white/10 overflow-y-auto custom-scrollbar">
            {/* Tab Tất cả */}
            <button
              onClick={() => setActiveTab("all")}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors text-left ${
                activeTab === "all"
                  ? "bg-white/10 border-l-4 border-emerald-400 font-bold"
                  : "hover:bg-white/5"
              }`}
            >
              <span>Tất cả</span>
              <span className="text-xs text-white/50">{reactions.length}</span>
            </button>
            {/* Các Tab emoji lẻ */}
            {uniqueEmoji.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setActiveTab(emoji)}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm transition-colors text-left ${
                  activeTab === emoji
                    ? "bg-white/10 border-l-4 border-emerald-400 font-bold"
                    : "hover:bg-white/5"
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span className="text-xs text-white/50 text-right">
                  {emojiGroups[emoji].length}
                </span>
              </button>
            ))}
          </div>
          {/* Danh sách User bên phải */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
            {displayActions.map((reaction, index) => {
              const u = reaction.user as UserType;
              if (!u || typeof u === "string") return null;
              return (
                <div
                  key={`${u._id}-${index}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-800 flex items-center justify-center text-white text-sm font-bold uppercase border border-white/10 flex-shrink-0">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        u.name.charAt(0)
                      )}
                    </div>
                    {/* Tên hiển thị */}
                    <span className="text-sm font-medium">{u.name}</span>
                  </div>
                </div>
              );
            })}
            {displayActions.length === 0 && (
              <div className="flex items-center justify-center h-full text-white/40 text-xs">
                Không có biểu cảm nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionDetailModal;
