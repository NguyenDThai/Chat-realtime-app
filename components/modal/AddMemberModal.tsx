import { useState, useEffect, type FC } from "react";
import type { UserType } from "@/types/user.type";
import { Search, X, Check } from "lucide-react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/useAuth";
import { updateChatListApi } from "@/src/api/chat.list.api";
import { getAllUserApi } from "@/src/api/user.api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoom } from "@/src/store/slides/chatSlide";
import type { RootState } from "@/src/store";

interface AddMemberModalProps {
  onClose: () => void;
  fetchChatList: () => void;
}

const AddMemberModal: FC<AddMemberModalProps> = ({
  onClose,
  fetchChatList,
}) => {
  const dispatch = useDispatch();
  const { selectedRoom: room } = useSelector((state: RootState) => state.chat);
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(() =>
    room ? room.members.map((m) => m._id) : [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const data = await getAllUserApi();
        setUsersList(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách người dùng!");
      }
    };
    fetchAllUser();
  }, []);

  if (!room) return null;

  const handleToggleUser = (user: UserType) => {
    // Không cho phép bỏ chọn trưởng nhóm
    if (user._id === room.createdBy._id) {
      toast.warn("Không thể bỏ chọn Trưởng nhóm!");
      return;
    }

    if (selectedUserIds.includes(user._id)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== user._id));
    } else {
      setSelectedUserIds([...selectedUserIds, user._id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserIds.length < 2) {
      toast.warn("Phòng chat nhóm phải có ít nhất 2 thành viên!");
      return;
    }

    try {
      setIsLoading(true);
      const updatedRoom = await updateChatListApi(room._id, {
        members: selectedUserIds,
      });

      if (updatedRoom) {
        // Tải lại danh sách phòng
        fetchChatList();
        // Cập nhật room đang mở để đồng bộ thông tin (như số thành viên, avatar) trên header
        dispatch(setSelectedRoom(updatedRoom));
        toast.success("Cập nhật thành viên nhóm thành công!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thành viên thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isAdmin = currentUser?._id === room.createdBy._id;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <form
        id="add-member-form"
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-linear-to-br from-emerald-900 to-teal-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden border border-white/20 animate-scale-in"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600/50 to-teal-600/50 p-5 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Thêm thành viên
              </h2>
              <p className="text-emerald-200 text-xs mt-1">
                Quản lý thành viên cho nhóm:{" "}
                <span className="font-semibold text-white">{room.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* Thanh tìm kiếm */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50 text-sm"
            />
            <Search className="w-4 h-4 text-white/50 absolute left-3 top-3" />
          </div>

          {/* Label số lượng */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-medium text-white/60">
              Danh sách người dùng hệ thống
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Đã chọn: {selectedUserIds.length}
            </span>
          </div>

          {/* Danh sách User */}
          <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user._id);
              const isOriginalMember = room.members.some(
                (m) => m._id === user._id,
              );
              const isCreator = user._id === room.createdBy._id;

              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleToggleUser(user)}
                  className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-between group text-left ${
                    isSelected
                      ? "bg-emerald-500/10 border border-emerald-400/40"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center font-bold text-white text-sm overflow-hidden border border-white/10">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Thông tin */}
                    <div>
                      <p className="text-white font-semibold text-sm flex items-center gap-1.5">
                        {user.name}
                        {isCreator && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-medium">
                            Trưởng nhóm
                          </span>
                        )}
                        {!isCreator && isOriginalMember && (
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30 font-medium">
                            Đã trong nhóm
                          </span>
                        )}
                      </p>
                      <p className="text-white/50 text-xs">{user.email}</p>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-white/30 group-hover:border-emerald-400"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    )}
                  </div>
                </button>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-6 text-white/40 text-xs">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/20 bg-linear-to-t from-emerald-950/20 to-transparent flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all cursor-pointer text-sm"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg text-sm cursor-pointer bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20 active:scale-[0.98]`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default AddMemberModal;
