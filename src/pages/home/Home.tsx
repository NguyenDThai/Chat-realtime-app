import { useEffect, useState } from "react";
import ChatList from "@/components/sidebar/ChatList";
import Header from "@/components/sidebar/Header";
import Footer from "@/components/sidebar/Footer";
import type { ChatListType } from "@/types/list.chat.type";
import { getChatListApi } from "@/src/api/chat.list.api";
import ChatInput from "@/components/view/ChatInput";
import MessageList from "@/components/view/MessageList";
import ChatHeader from "@/components/view/ChatHeader";
import EmptyChat from "@/components/view/EmptyChat";
import RoomDetailSidebar from "@/components/sidebar/RoomDetailSidebar";
import type { UserType } from "@/types/user.type";
import { getAllUserApi } from "@/src/api/user.api";
import { useAuth } from "@/hooks/useAuth";
import SearchBox from "@/components/sidebar/SearchBox";
import { useSocket } from "@/hooks/useSocket";

const Home = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [rooms, setRooms] = useState<ChatListType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatListType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [allUser, setAllUser] = useState<UserType[]>([]);

  const [searchTab, setSearchTab] = useState<
    "all" | "members" | "messages" | "files" | "unread"
  >("all");

  // Lấy danh sách các phòng chat
  const fetchChatList = async () => {
    try {
      const res = await getChatListApi();
      setRooms(res);

      if (res && res.length > 0) {
        res.forEach((room: ChatListType) => {
          socket.emit("join_room", room._id);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy tất cả user trong hệ thống để search
  const fetchAllUser = async () => {
    try {
      const res = await getAllUserApi();
      setAllUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setRooms((prevRooms) => {
        const updatedRoom = prevRooms.map((room) => {
          if (room._id === newMessage.conversationId) {
            return {
              ...room,
              lastMessage: newMessage,
              lastMessageAt: newMessage.createdAt,
            };
          }
          return room;
        });

        // 2. Sắp xếp lại danh sách, đưa phòn có tin nhắn mới lên đầu side bar
        return [...updatedRoom].sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime(),
        );
      });
    };

    socket.on("new_message", handleReceiveMessage);

    return () => {
      socket.off("new_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    const handleConversationDelete = (deleteId: string) => {
      if (selectedRoom?._id === deleteId) {
        setSelectedRoom(null);
      }
      fetchChatList();
    };

    socket.on("coversation_delete", handleConversationDelete);

    return () => {
      socket.off("coversation_delete", handleConversationDelete);
    };
  }, [socket, selectedRoom]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchTab("all");
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchChatList();
    fetchAllUser();
  }, []);

  // Lọc room
  const filteredRooms = rooms.filter((room) => {
    if (room.type === "group") {
      return room.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // Nếu là chat 1-1, tìm kiếm theo tên của đối phương trong cuộc trò chuyện
    const partner = room.members.find((member) => member._id !== user?._id);
    return partner
      ? partner.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
  });

  // Lọc user
  const filteredUser = allUser.filter((u) => {
    if (u._id === user._id) return false;

    // Kiểm tra xem tên có khớp với từ khóa tìm kiếm không
    const matchesSearch = u.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Kiểm tra xem đã có phòng chat 1-1 với user này chưa
    const alreadyHasRoom = rooms.some(
      (r) => r.type === "single" && r.members.some((m) => m._id === u._id),
    );
    return matchesSearch && !alreadyHasRoom;
  });

  // Lọc theo activeTab
  const displayRooms = filteredRooms.filter((room) => {
    if (searchTab) {
      if (searchTab === "members") {
        return room.type === "single";
      }

      // Nếu đang chọn tab "Tin nhắn" hoặc "File" -> Ẩn toàn bộ danh sách phòng chat (chờ logic search tin nhắn/file sau này)
      if (searchTab === "messages" || searchTab === "files") {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Hiệu ứng bong bóng nền */}
      <div className="absolute w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow top-20 -left-48"></div>
      <div className="absolute w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed bottom-20 -right-48"></div>
      <div className="absolute w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-fast top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Sidebar - Danh sách phòng chat */}
      <div className="relative w-80 bg-emerald-900/40 border-r border-white/20 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 pb-0 ">
          <Header fetchChatList={fetchChatList} />

          {/* Search box */}
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* Active tab search */}
          {searchTerm ? (
            <div className="flex items-center gap-5 text-xs text-white/60 border-b border-white/10 mb-4 animate-fade-in transition-all">
              {[
                { id: "all", label: "Tất cả" },
                { id: "members", label: "Thành viên" },
                { id: "messages", label: "Tin nhắn" },
                { id: "files", label: "File" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setSearchTab(
                      tab.id as "all" | "members" | "messages" | "files",
                    )
                  }
                  className={`relative pb-2 text-[13px] font-medium cursor-pointer transition-all duration-200 hover:text-white ${
                    searchTab === tab.id ? "text-emerald-400 font-semibold" : ""
                  }`}
                >
                  {tab.label}
                  {/* Đường line gạch dưới di chuyển mượt mà */}
                  {searchTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-5 text-xs text-white/60 border-b border-white/10 mb-4 animate-fade-in transition-all">
              {[
                { id: "all", label: "Tất cả" },
                { id: "unread", label: "Chưa đọc" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchTab(tab.id as "all" | "unread")}
                  className={`relative pb-2 font-medium cursor-pointer transition-all duration-200 hover:text-white ${
                    searchTab === tab.id ? "text-emerald-400 font-semibold" : ""
                  }`}
                >
                  {tab.label}
                  {/* Đường line gạch dưới di chuyển mượt mà */}
                  {searchTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Danh sách phòng chat */}
        <ChatList
          filteredRooms={displayRooms}
          filteredUser={
            searchTerm && (searchTab === "all" || searchTab === "members")
              ? filteredUser
              : []
          }
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          fetchChatList={fetchChatList}
        />

        {/* User Info Footer */}
        <Footer />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedRoom ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Chat Header */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatHeader
                selectedRoom={selectedRoom}
                setShowDetailSidebar={setShowDetailSidebar}
              />

              {/* Messages Area */}
              <MessageList selectedRoom={selectedRoom} />

              {/* Input Area */}
              <ChatInput selectedRoom={selectedRoom} />
            </div>

            {/* Side bar thong tin chi tiet room */}
            {showDetailSidebar && (
              <RoomDetailSidebar
                room={selectedRoom}
                onClose={() => setShowDetailSidebar(false)}
              />
            )}
          </div>
        ) : (
          // Empty State - Chưa chọn phòng chat
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default Home;
