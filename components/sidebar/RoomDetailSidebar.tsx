import { useState, type FC } from "react";
import { useAuth } from "@/hooks/useAuth";
import ChatAvatar from "@/components/share/ChatAvatar";
import {
  X,
  Pin,
  BellOff,
  UserPlus,
  Settings,
  ChevronDown,
  Image,
  FileText,
  Link2,
  Download,
  Crown,
  ChevronUp,
  ArrowLeftFromLine,
  Trash,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/store";
import { useData } from "@/hooks/useData";
import AddMemberModal from "@/components/modal/AddMemberModal";
import { useConfirm } from "@/hooks/useConfirm";
import { deleteChatListApi, leaveChatApi } from "@/src/api/chat.list.api";
import { setSelectedRoom } from "@/src/store/slides/chatSlide";
import { toast } from "react-toastify";
import axios from "axios";

interface RoomDetailSidebarProps {
  onClose: () => void;
}

const RoomDetailSidebar: FC<RoomDetailSidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { selectedRoom: room, onlineUsers } = useSelector(
    (state: RootState) => state.chat,
  );
  const { fetchChatList } = useData();
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

  const [activeTab, setActiveTab] = useState<"media" | "file" | "link">("file");
  const [isMemberExpanded, setIsMemberExpanded] = useState(false);

  if (!room) return null;

  const partner = room.members.find((m) => m._id !== user?._id);
  const isOnline = partner ? onlineUsers.includes(partner._id) : false;



  // Kiểm tra quyền Admin (Người tạo nhóm)
  const isAdmin = room?.createdBy._id === user?._id;

  // Tìm thành viên là bản thân (Bạn)
  const isMe = (userId: string) => userId === user?._id;

  const handleLeaveRoom = async () => {
    const isConfirm = await confirm({
      title: "Rời nhóm",
      message: "Bạn có chắc chắn muốn rời khỏi nhóm này không?",
      confirmText: "Rời nhóm",
      cancelText: "Hủy",
      type: "danger",
    });

    if (!isConfirm) return;

    try {
      const res = await leaveChatApi(room._id);
      if (res) {
        fetchChatList();
        dispatch(setSelectedRoom(null));
        toast.success(`Bạn đã rời nhóm ${room.name}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteHistory = async () => {
    const isConfirm = await confirm({
      title: "Xóa lịch sử trò chuyện",
      message: "Bạn có chắc chắn muốn xóa cuộc trò chuyện không?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });

    if (!isConfirm) return;
    try {
      const res = await deleteChatListApi(room._id);

      if (res) {
        fetchChatList();
        dispatch(setSelectedRoom(null));
        onClose();
        toast.success("Đã xóa cuộc trò chuyện thành công!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error);
      }
    }
  };

  return (
    <div className="absolute md:relative top-0 right-0 w-full md:w-80 bg-white dark:bg-[#1A1A1A] border-l border-slate-200 dark:border-zinc-800 flex flex-col h-full animate-fade-in z-20 shadow-2xl md:shadow-none">
      {/* Nút đóng Sidebar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-800 dark:text-white/70 dark:hover:text-white transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header - Thông tin cơ bản */}
      <div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-zinc-800 mt-6">
        <ChatAvatar room={room} currentUserId={user?._id} />
        <h3 className="text-slate-800 dark:text-white font-bold text-lg mt-3 flex items-center gap-1.5">
          {room.type === "group" ? room.name : partner?.name}
        </h3>
        <p
          className={`text-[var(--color-theme-primary)] dark:text-[var(--color-theme-primary-dark)] text-xs mt-1`}
        >
          {room.type === "group"
            ? `${room.members.length} thành viên`
            : isOnline
              ? "Đang hoạt động"
              : "Không hoạt động"}
        </p>
      </div>

      {/* Hành động nhanh */}
      <div
        className={`p-4 grid ${room.type === "group" ? "grid-cols-3" : "grid-cols-2"} gap-2 border-b border-slate-200 dark:border-zinc-800 text-center`}
      >
        <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-slate-200 dark:border-white/5">
          <Pin className="w-4 h-4 text-emerald-400" />
          <span>Ghim</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-slate-200 dark:border-white/5">
          <BellOff className="w-4 h-4 text-yellow-400" />
          <span>Tắt TB</span>
        </button>
        {room.type === "group" && (
          <button
            onClick={() => setOpenAddMemberModal(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-slate-200 dark:border-white/5"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>Thêm</span>
          </button>
        )}
      </div>

      {/* Nội dung cuộn được */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
        {/* Mục quản lý nhóm (Chỉ cho Group và Admin) */}
        {room.type === "group" && isAdmin && (
          <button className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-white text-sm font-medium transition-all border border-slate-200 dark:border-white/5">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-black dark:text-white" /> Quản
              lý nhóm
            </span>
          </button>
        )}

        {/* Danh sách thành viên (Dành cho Group) */}
        {room.type === "group" && (
          <div className="space-y-3">
            {/* Header Nút bấm Thu gọn/Mở rộng */}
            <button
              type="button"
              onClick={() => setIsMemberExpanded(!isMemberExpanded)}
              className="w-full flex items-center justify-between text-slate-500 hover:text-slate-800 dark:text-white/70 dark:hover:text-white text-xs font-semibold px-1 py-1 transition-colors cursor-pointer"
            >
              <span>Thành viên ({room.members.length})</span>
              {isMemberExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isMemberExpanded ? (
              // DẠNG MỞ RỘNG: Hiển thị danh sách dọc cuộn được (Vertical List)
              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1 animate-fade-in">
                {room.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/5"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="relative w-8 h-8 ">
                        <ChatAvatar
                          user={member}
                          currentUserId={user?._id}
                          className="w-full h-full"
                        />
                        {isMe(member._id) ||
                          (onlineUsers.includes(member._id) && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500" />
                          ))}
                      </div>
                      <div className="text-left">
                        <p className="text-slate-800 dark:text-white text-xs font-medium flex items-center gap-1">
                          {isMe(member._id) ? "Bạn" : member.name}
                          {room?.createdBy._id === member._id && (
                            <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-white/40">
                          {room?.createdBy._id === member._id
                            ? "Trưởng nhóm"
                            : "Thành viên"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // DẠNG THU GỌN: Hiển thị hàng ngang các Avatar đè chồng lên nhau (Overlapping Row)
              <div className="flex items-center pl-2 py-1 overflow-hidden animate-fade-in">
                {room.members.slice(0, 8).map((member, index) => {
                  const displayName = isMe(member._id) ? "Bạn" : member.name;
                  return (
                    <div
                      key={member._id}
                      title={displayName}
                      className={`relative w-8 h-8 rounded-full bg-[var(--color-theme-primary)] flex items-center justify-center font-bold text-white text-[10px] overflow-hidden border-2 border-white dark:border-[var(--color-theme-primary)] shadow-md ${
                        index > 0 ? "-ml-2" : ""
                      }`}
                    >
                      <ChatAvatar
                        user={member}
                        currentUserId={user?._id}
                        className="w-full h-full"
                      />
                    </div>
                  );
                })}

                {/* Phần dư hiển thị +N */}
                {room.members.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white text-[10px] font-bold border-2 border-white dark:border-emerald-950 -ml-2 shadow-md backdrop-blur-sm">
                    +{room.members.length - 8}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tổng hợp tài liệu gửi */}
        <div className="space-y-3 pt-2">
          <p className="text-slate-600 dark:text-white/70 text-xs font-semibold px-1">
            Tổng hợp
          </p>

          {/* Tab Selection */}
          <div className="flex bg-slate-100 dark:bg-black/25 p-1 rounded-xl border border-slate-200 dark:border-white/5 text-xs">
            <button
              onClick={() => setActiveTab("media")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "media" ? "bg-[var(--color-theme-primary)] text-white" : "text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white"}`}
            >
              Ảnh/Video
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "file" ? "bg-[var(--color-theme-primary)] text-white" : "text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white"}`}
            >
              File
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "link" ? "bg-[var(--color-theme-primary)] text-white" : "text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white"}`}
            >
              Link
            </button>
          </div>

          {/* Nội dung các Tab */}
          <div className="space-y-2">
            {activeTab === "file" && (
              <div className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl flex items-center justify-between transition-all">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-2 bg-[var(--color-theme-primary)]/20 text-[var(--color-theme-primary)] rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-slate-800 dark:text-white text-xs font-medium truncate">
                      design-spec-v2.pdf
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-white/40">
                      2.4 MB
                    </p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-1">
                <div className="aspect-square bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-lg flex items-center justify-center text-slate-400 dark:text-white/30 cursor-pointer">
                  <Image className="w-5 h-5" />
                </div>
              </div>
            )}

            {activeTab === "link" && (
              <div className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer">
                <div className="p-2 bg-[var(--color-theme-primary)]/20 text-[var(--color-theme-primary)] rounded-lg">
                  <Link2 className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-slate-800 dark:text-white text-xs font-medium truncate">
                    Figma Design Specs
                  </p>
                  <p className="text-[10px] text-[var(--color-theme-primary)] dark:text-[var(--color-theme-primary)]/70 truncate">
                    figma.com/file/...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {room.type === "group" ? (
          <>
            <button
              onClick={handleDeleteHistory}
              className="w-full flex items-center justify-center p-3 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-white text-sm font-medium transition-all"
            >
              <span className="flex items-center gap-2 text-red-400">
                <Trash className="w-4 h-4" /> Xóa lịch sử trò chuyện
              </span>
            </button>
            <button
              onClick={handleLeaveRoom}
              type="button"
              className="w-full flex items-center justify-center p-3 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-white text-sm font-medium transition-all"
            >
              <span className="flex items-center gap-2 text-red-400">
                <ArrowLeftFromLine className="w-4 h-4" /> Rời nhóm
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={handleDeleteHistory}
            className="w-full flex items-center justify-center p-3 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-800 dark:text-white text-sm font-medium transition-all"
          >
            <span className="flex items-center gap-2 text-red-400">
              <Trash className="w-4 h-4" /> Xóa lịch sử trò chuyện
            </span>
          </button>
        )}
        {openAddMemberModal && (
          <AddMemberModal
            onClose={() => setOpenAddMemberModal(false)}
            fetchChatList={fetchChatList}
          />
        )}
      </div>
    </div>
  );
};

export default RoomDetailSidebar;
