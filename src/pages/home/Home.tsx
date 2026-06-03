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
import { Search } from "lucide-react";

const Home = () => {
  const [rooms, setRooms] = useState<ChatListType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatListType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChatList = async () => {
    try {
      const res = await getChatListApi();
      setRooms(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Hiệu ứng bong bóng nền */}
      <div className="absolute w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow top-20 -left-48"></div>
      <div className="absolute w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed bottom-20 -right-48"></div>
      <div className="absolute w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-fast top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Sidebar - Danh sách phòng chat */}
      <div className="relative w-80 bg-emerald-900/40 border-r border-white/20 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20">
          <Header fetchChatList={fetchChatList} />

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phòng chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50 text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* Danh sách phòng chat */}
        <ChatList
          filteredRooms={filteredRooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />

        {/* User Info Footer */}
        <Footer />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <ChatHeader selectedRoom={selectedRoom} />

            {/* Messages Area */}
            <MessageList />

            {/* Input Area */}
            <ChatInput />
          </>
        ) : (
          // Empty State - Chưa chọn phòng chat
          <EmptyChat />
        )}
      </div>
    </div>
  );
};

export default Home;
