import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "@/types/list.chat.type";
import ChatAvatar from "@/components/share/ChatAvatar";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import UpdateChatRoom from "@/components/modal/UpdateChatRoom";
import { createChatListApi, deleteChatListApi } from "@/src/api/chat.list.api";
import { useConfirm } from "@/hooks/useConfirm";
import type { UserType } from "@/types/user.type";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoom } from "@/src/store/slides/chatSlide";
import type { RootState } from "@/src/store";
import { useData } from "@/hooks/useData";

const ChatList = ({
  filteredRooms,
  filteredUser,
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredUser: UserType[];
  filteredRooms: ChatListType[];
}) => {
  const { user } = useAuth();
  const { fetchChatList } = useData();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { selectedRoom } = useSelector((state: RootState) => state.chat);
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

  const handleDeleteRoom = async (id: string) => {
    const isConfirm = await confirm({
      title: "Xóa cuộc trò chuyện",
      message: "Bạn có chắc chắn muốn xóa cuộc trò chuyện này?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });

    if (!isConfirm) return;
    try {
      const res = await deleteChatListApi(id);
      if (res) {
        fetchChatList();
        setActiveMenuRoomId(null);
        dispatch(setSelectedRoom(null));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedUser = async (id: string) => {
    try {
      const newRoom = await createChatListApi({
        type: "single",
        members: [id],
      });

      if (newRoom) {
        dispatch(setSelectedRoom(newRoom));
        setSearchTerm("");
        fetchChatList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {searchTerm && filteredUser.length > 0 && (
        <div className="mt-1">
          {/* Tiêu đề phân chia phần */}
          <div className="px-4 py-2 text-sm font-bold text-[var(--color-theme-primary)] dark:text-[var(--color-theme-primary)] uppercase tracking-wider">
            Thành viên
          </div>
          {filteredUser.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectedUser(u._id)}
              className="flex items-center space-x-3 p-4 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-all duration-200 border-b border-slate-200 dark:border-white/10"
            >
              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-white/20 bg-[var(--color-theme-primary)] dark:bg-[var(--color-theme-primary)] flex items-center justify-center text-white font-bold uppercase">
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
              {/* Thông tin */}
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-800 dark:text-white font-semibold truncate">
                  {u.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50 truncate">
                  {u.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredRooms.map((room) => {
        return (
          <div
            key={room._id}
            onClick={() => dispatch(setSelectedRoom(room))}
            className={`group relative p-4 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-all duration-200 border-b border-slate-200 dark:border-white/10 ${
              selectedRoom?._id === room._id
                ? "bg-slate-200/50 dark:bg-white/20 border-l-4 border-l-[var(--color-theme-primary)] dark:border-l-[var(--color-theme-primary)]"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <ChatAvatar
                  room={room}
                  currentUserId={user?._id}
                  className={`w-12 h-12 ${
                    selectedRoom?._id === room._id
                      ? "shadow-lg shadow-[var(--color-theme-primary)]/30"
                      : ""
                  }`}
                />
                {room.unreadCount && room.unreadCount > 0 ? (
                  <div className="absolute top-0 right-0 text-white bg-red-500 rounded-full px-1.5 py-0.5 text-xs">
                    {room.unreadCount > 9 ? "9+" : room.unreadCount}
                  </div>
                ) : null}
              </div>

              {/* Thông tin phòng */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-800 dark:text-white font-semibold truncate flex-1 max-w-[180px]">
                    {getRoomName(room)}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-white/50">
                    {room.time}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-white/60 truncate">
                  {room.lastMessage ? room.lastMessage.content : ""}
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
              <Ellipsis className="text-slate-600 dark:text-white/80 hidden group-hover:block transition-all duration-200" />
            </div>

            {/* Dropdown menu */}
            {activeMenuRoomId === room._id && (
              <div
                onClick={(e) => e.stopPropagation()} // Chặn đóng menu khi click vào bên trong menu
                className="absolute right-4 top-15 w-44 bg-white dark:bg-black border border-slate-200 dark:border-white/20 rounded-xl p-1 z-50 animate-fade-in"
              >
                {room.type === "group" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuRoomId(null);
                        setOpenEditModal(true);
                        setRoomToUpdate(room);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10 rounded-lg text-left transition-colors cursor-pointer border-none"
                    >
                      <Edit className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Chỉnh sửa nhóm</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(room._id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg text-left transition-colors cursor-pointer border-none"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Xóa cuộc trò chuyện</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Hiển thị text thông báo nếu tìm kiếm không ra kết quả */}
      {searchTerm &&
        filteredRooms.length === 0 &&
        filteredUser.length === 0 && (
          <div className="text-center text-slate-500 dark:text-white/50 py-8">
            <p className="text-sm">Không tìm thấy cuộc trò chuyện nào</p>
          </div>
        )}

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
