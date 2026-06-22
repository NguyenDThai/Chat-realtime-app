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

  const getInitals = (name: string) => {
    if (name === "Bạn") return "B";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (
        words[0].charAt(0) + words[words.length - 1].charAt(0)
      ).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
    <div className="w-80 bg-emerald-900/40 border-l border-white/20 flex flex-col h-full animate-fade-in relative z-20">
      {/* Nút đóng Sidebar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header - Thông tin cơ bản */}
      <div className="p-6 flex flex-col items-center border-b border-white/10 mt-6">
        <ChatAvatar room={room} currentUserId={user?._id} />
        <h3 className="text-white font-bold text-lg mt-3 flex items-center gap-1.5">
          {room.type === "group" ? room.name : partner?.name}
        </h3>
        <p className="text-emerald-200/60 text-xs mt-1">
          {room.type === "group"
            ? `${room.members.length} thành viên`
            : isOnline
              ? "Đang hoạt động"
              : "Không hoạt động"}
        </p>
      </div>

      {/* Hành động nhanh */}
      <div
        className={`p-4 grid ${room.type === "group" ? "grid-cols-3" : "grid-cols-2"} gap-2 border-b border-white/10 text-center`}
      >
        <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-white/5">
          <Pin className="w-4 h-4 text-emerald-400" />
          <span>Ghim</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-white/5">
          <BellOff className="w-4 h-4 text-yellow-400" />
          <span>Tắt TB</span>
        </button>
        {room.type === "group" && (
          <button
            onClick={() => setOpenAddMemberModal(true)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer text-xs gap-1.5 border border-white/5"
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
          <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-all border border-white/5">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" /> Quản lý nhóm
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
              className="w-full flex items-center justify-between text-white/70 hover:text-white text-xs font-semibold px-1 py-1 transition-colors cursor-pointer"
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
                    className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="relative w-8 h-8 ">
                        <div className="h-full w-full rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitals(member.name)
                          )}
                          {isMe(member._id) ||
                            (onlineUsers.includes(member._id) && (
                              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500" />
                            ))}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-white text-xs font-medium flex items-center gap-1">
                          {isMe(member._id) ? "Bạn" : member.name}
                          {room?.createdBy._id === member._id && (
                            <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          )}
                        </p>
                        <p className="text-[10px] text-white/40">
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
                      className={`relative w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white text-[10px] overflow-hidden border-2 border-emerald-950 shadow-md ${
                        index > 0 ? "-ml-2" : ""
                      }`}
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitals(displayName)
                      )}
                    </div>
                  );
                })}

                {/* Phần dư hiển thị +N */}
                {room.members.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px] font-bold border-2 border-emerald-950 -ml-2 shadow-md backdrop-blur-sm">
                    +{room.members.length - 8}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tổng hợp tài liệu gửi */}
        <div className="space-y-3 pt-2">
          <p className="text-white/70 text-xs font-semibold px-1">Tổng hợp</p>

          {/* Tab Selection */}
          <div className="flex bg-black/25 p-1 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setActiveTab("media")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "media" ? "bg-emerald-500 text-white" : "text-white/60 hover:text-white"}`}
            >
              Ảnh/Video
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "file" ? "bg-emerald-500 text-white" : "text-white/60 hover:text-white"}`}
            >
              File
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${activeTab === "link" ? "bg-emerald-500 text-white" : "text-white/60 hover:text-white"}`}
            >
              Link
            </button>
          </div>

          {/* Nội dung các Tab */}
          <div className="space-y-2">
            {activeTab === "file" && (
              <div className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between transition-all">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-white text-xs font-medium truncate">
                      design-spec-v2.pdf
                    </p>
                    <p className="text-[10px] text-white/40">2.4 MB</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeTab === "media" && (
              <div className="grid grid-cols-3 gap-1">
                <div className="aspect-square bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg flex items-center justify-center text-white/30 cursor-pointer">
                  <Image className="w-5 h-5" />
                </div>
              </div>
            )}

            {activeTab === "link" && (
              <div className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Link2 className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-white text-xs font-medium truncate">
                    Figma Design Specs
                  </p>
                  <p className="text-[10px] text-emerald-400/70 truncate">
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
              className="w-full flex items-center justify-center p-3 cursor-pointer bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-all"
            >
              <span className="flex items-center gap-2 text-red-400">
                <Trash className="w-4 h-4" /> Xóa lịch sử trò chuyện
              </span>
            </button>
            <button
              onClick={handleLeaveRoom}
              type="button"
              className="w-full flex items-center justify-center p-3 cursor-pointer bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-all"
            >
              <span className="flex items-center gap-2 text-red-400">
                <ArrowLeftFromLine className="w-4 h-4" /> Rời nhóm
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={handleDeleteHistory}
            className="w-full flex items-center justify-center p-3 cursor-pointer bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-all"
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
