import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "@/types/list.chat.type";
import ChatAvatar from "@/components/share/ChatAvatar";
import { Edit, Ellipsis, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import UpdateChatRoom from "@/components/modal/UpdateChatRoom";

const ChatList = ({
  filteredRooms,
  selectedRoom,
  setSelectedRoom,
  fetchChatList,
}: {
  filteredRooms: ChatListType[];
  selectedRoom: ChatListType | null;
  setSelectedRoom: (room: ChatListType) => void;
  fetchChatList: () => Promise<void>;
}) => {
  const { user } = useAuth();
  const [activeMenuRoomId, setActiveMenuRoomId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState<ChatListType | null>(null);

  // Click ra ngoài thì đóng active memu lại
  useEffect(() => {
    const handleCloseMenu = () => {
      setActiveMenuRoomId(null);
    };
    window.addEventListener("click", handleCloseMenu);

    return () => {
      window.removeEventListener("click", handleCloseMenu);
    };
  }, []);

  const getRoomName = (room: ChatListType) => {
    if (room.type === "group") {
      return room.name || "Nhóm chưa đặt tên";
    }

    const partner = room.members.find((member) => member._id !== user?._id);
    return partner ? partner.name : "Người dùng ẩn danh";
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {filteredRooms.map((room) => (
        <div
          key={room._id}
          onClick={() => setSelectedRoom(room)}
          className={`group relative p-4 hover:bg-white/10 cursor-pointer transition-all duration-200 border-b border-white/10 ${
            selectedRoom?._id === room._id
              ? "bg-white/20 border-l-4 border-l-emerald-400"
              : ""
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <ChatAvatar
                room={room}
                currentUserId={user?._id}
                className={`w-12 h-12 ${selectedRoom?._id === room._id ? "shadow-lg shadow-emerald-500/30" : ""}`}
              />
            </div>

            {/* Thông tin phòng */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold truncate flex-1 max-w-[180px]">
                  {getRoomName(room)}
                </h3>
                <span className="text-xs text-white/50">{room.time}</span>
              </div>
              <p className="text-sm text-white/60 truncate">
                {room.lastMessage}
              </p>
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuRoomId(
                activeMenuRoomId === room._id ? null : room._id,
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
          >
            <Ellipsis className=" text-white/80 hidden group-hover:block transition-all duration-200" />
          </div>

          {/* Dropdown menu */}

          {activeMenuRoomId === room._id && (
            <div
              onClick={(e) => e.stopPropagation()} // Chặn đóng menu khi click vào bên trong menu
              className="absolute right-4 top-15 w-44 bg-emerald-950/95 border border-white/20 rounded-xl p-1 shadow-2xl z-50 animate-fade-in backdrop-blur-md"
            >
              {room.type === "group" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuRoomId(null);
                      // TODO: Gọi hàm mở modal thêm thành viên nhóm
                      console.log("Thêm thành viên cho nhóm:", room.name);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg text-left transition-colors cursor-pointer border-none"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Thêm thành viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuRoomId(null);
                      setOpenEditModal(true);
                      setRoomToUpdate(room);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 rounded-lg text-left transition-colors cursor-pointer border-none"
                  >
                    <Edit className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Chỉnh sửa nhóm</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveMenuRoomId(null);
                  if (
                    confirm("Bạn có chắc chắn muốn xóa cuộc hội thoại này?")
                  ) {
                    // TODO: Gọi API xóa cuộc trò chuyện
                    console.log("Xóa phòng chat:", room._id);
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 rounded-lg text-left transition-colors cursor-pointer border-none"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                <span>Xóa cuộc trò chuyện</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {openEditModal && roomToUpdate && (
        <UpdateChatRoom
          room={roomToUpdate}
          onClose={() => setOpenEditModal(false)}
          fetchChatList={fetchChatList}
        />
      )}
    </div>
  );
};

export default ChatList;
