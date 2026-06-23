import ChatAvatar from "@/components/share/ChatAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { createChatListApi } from "@/src/api/chat.list.api";
import type { RootState } from "@/src/store";
import { setSelectedRoom } from "@/src/store/slides/chatSlide";
import type { ChatListType } from "@/types/list.chat.type";
import {
  ChevronDown,
  MessageSquare,
  Search,
  User,
  UserRoundCheck,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ActiveTabContactProps {
  contactSubTab: "members" | "groups";
  setActiveTab: (tab: string) => void;
}

const ActiveTabContact = ({
  contactSubTab,
  setActiveTab,
}: ActiveTabContactProps) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { fetchChatList } = useData();
  const { allUser, rooms } = useSelector((state: RootState) => state.chat);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleCreateChat = async (userId: string) => {
    // Nếu đã có phòng chta đó rồi
    const existingRoom = rooms.find(
      (room) =>
        room.type === "single" &&
        room.members.some((member) => member._id === userId),
    );

    if (existingRoom) {
      dispatch(setSelectedRoom(existingRoom));
      setActiveTab("chat");
      return;
    }

    // Khởi tạo phòng chat nếu chưa có phòng chat
    try {
      const newRoom = await createChatListApi({
        type: "single",
        members: [userId],
      });

      if (newRoom) {
        dispatch(setSelectedRoom(newRoom));
        setActiveTab("chat");
        fetchChatList();
      }
    } catch (error) {
      console.error("Lỗi khi mở cuộc trò chuyện:", error);
    }
  };

  // Xử lý lọc
  const ortherUsers = allUser.filter((u) => u._id !== user?._id);
  const filteredUsers = ortherUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name, "vi")
      : b.name.localeCompare(a.name, "vi");
  });

  const groupMembers: { [key: string]: typeof ortherUsers } = {};
  sortedUsers.forEach((u) => {
    const firstLetter = u.name.trim().charAt(0).toUpperCase();

    if (!groupMembers[firstLetter]) {
      groupMembers[firstLetter] = [];
    }
    groupMembers[firstLetter].push(u);
  });

  const sortedLetters = Object.keys(groupMembers).sort((a, b) => {
    return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
  });

  const groupRooms = rooms.filter(
    (room) =>
      room.type === "group" &&
      room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black/10">
      {/* Header */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-black/5 shrink-0">
        <div className="flex items-center gap-3">
          <User className="text-white w-4 h-4" />
          <h2 className="text-[16px] font-normal text-white">
            {contactSubTab === "members"
              ? " Danh sách thành viên"
              : "Danh sách nhóm và cộng đồng"}
          </h2>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <h3 className="text-white text-[16px] mb-2">
          {contactSubTab === "members" && `Bạn bè (${ortherUsers.length})`}
        </h3>

        {/* Thanh tìm kiếm lọc */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-white" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bạn"
              className="w-full bg-white/5 border border-white/10 rounded-[8px] py-2 pl-10 pr-4 text-white text-sm focus:outline-hidden focus:border-emerald-400 focus:bg-white/10 transition-all"
            />
          </div>
          {contactSubTab === "members" && (
            <>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center py-1.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-[16px] font-medium">
                  Tên ({sortOrder === "asc" ? "A-Z" : "Z-A"}){" "}
                </span>
                <ChevronDown className="w-4 h-4 ml-0.5" />
              </button>
              <button className="flex items-center py-1.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-[16px] font-medium">Tất cả</span>
                <ChevronDown className="w-4 h-4 ml-0.5" />
              </button>
            </>
          )}
        </div>
        {/* List danh sách thành viên theo chữ cái */}
        {contactSubTab === "members" ? (
          <div className="space-y-6">
            {sortedLetters.length > 0 ? (
              sortedLetters.map((letter) => (
                <div key={letter} className="space-y-2">
                  <div className="text-emerald-400 font-bold text-sm uppercase select-none">
                    {letter}
                  </div>

                  {/* Các thành viên thuộc chữ cái */}
                  <div className="grid gap-2">
                    {groupMembers[letter].map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between p-3 hover:bg-white/10 rounded-xl  transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <ChatAvatar
                            room={
                              { type: "single", members: [u] } as ChatListType
                            }
                            currentUserId={user?._id}
                            setActiveTab={setActiveTab}
                          />
                          {/* Tên */}
                          <div>
                            <h4 className="text-white text-[16px] font-normal">
                              {u.name}
                            </h4>
                          </div>
                        </div>
                        {/* Action */}
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all cursor-pointer">
                            <UserRoundCheck className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleCreateChat(u._id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-8">
                Không tìm thấy thành viên nào
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            {groupRooms.length > 0 ? (
              groupRooms.map((room) => (
                <div
                  key={room._id}
                  className="flex items-center justify-between p-3 hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* Group avatar */}
                    <ChatAvatar room={room} currentUserId={user?._id} />
                    {/* Group name */}
                    <div>
                      <h4 className="text-white text-[16px] font-normal">
                        {room.name}
                      </h4>
                      <p className="text-white/40 text-[16px] font-normal">
                        {room.members.length} thành viên
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-8">
                Không tìm thấy nhóm nào
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveTabContact;
