import { useEffect, useState } from "react";
import ChatList from "@/components/sidebar/ChatList";
import Header from "@/components/sidebar/Header";
import Footer from "@/components/sidebar/Footer";
import type { ChatListType } from "@/types/list.chat.type";
import { getChatListApi } from "@/src/api/chat.list.api";

const Home = () => {
  const [rooms, setRooms] = useState<ChatListType[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<ChatListType | null>(null);
  const [messages, setMessages] = useState<Record<number, any>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await getChatListApi();
        setRooms(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChatList();
  }, []);

  // Khởi tạo messages cho từng room
  const getRoomMessages = (roomId) => {
    if (!messages[roomId]) {
      const initialMessages = {
        1: [
          {
            id: 1,
            text: "Xin chào! Tôi là trợ lý ảo của Real Chat. Tôi có thể giúp gì cho bạn hôm nay? 😊",
            sender: "bot",
            time: "10:30",
          },
        ],
        2: [
          {
            id: 1,
            text: "Phòng kỹ thuật đã sẵn sàng hỗ trợ bạn!",
            sender: "bot",
            time: "09:45",
          },
        ],
        3: [
          {
            id: 1,
            text: "Chào mừng bạn đến với cộng đồng Real Chat! 🎉",
            sender: "bot",
            time: "Hôm qua",
          },
        ],
        4: [
          {
            id: 1,
            text: "Xin chào! Bạn cần hỗ trợ về thanh toán?",
            sender: "bot",
            time: "Hôm qua",
          },
        ],
        5: [
          {
            id: 1,
            text: "Chào admin! Có 5 người dùng mới đăng ký hôm nay.",
            sender: "bot",
            time: "02/01/2024",
          },
        ],
      };
      return initialMessages[roomId] || [];
    }
    return messages[roomId];
  };

  const currentMessages = selectedRoom ? getRoomMessages(selectedRoom._id) : [];

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
      <div className="relative w-80 bg-emerald-900/40 backdrop-blur-md border-r border-white/20 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20">
          <Header />

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phòng chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50 text-sm"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
            <div className="bg-emerald-900/40 backdrop-blur-md p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    {rooms.find((r) => r._id === selectedRoom._id)
                      ?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900 animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-emerald-200 text-xs">
                      {rooms.find((r) => r._id === selectedRoom._id)?.isOnline
                        ? "Đang hoạt động"
                        : "Offline"}{" "}
                      • {currentMessages.length} tin nhắn
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {message.sender === "bot" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] ${message.sender === "user" ? "order-1" : ""}`}
                  >
                    <div
                      className={`rounded-2xl p-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                          : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p
                      className={`text-xs text-white/50 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/20 bg-gradient-to-t from-emerald-900/30 to-transparent">
              <form
                // onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50"
                />
                <button
                  type="submit"
                  className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-500/30"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
              <div className="flex justify-center space-x-4 mt-3">
                <button className="text-xs text-white/50 hover:text-white/80 transition-colors">
                  🔥 Phổ biến
                </button>
                <button className="text-xs text-white/50 hover:text-white/80 transition-colors">
                  💬 Tư vấn
                </button>
                <button className="text-xs text-white/50 hover:text-white/80 transition-colors">
                  🎉 Sự kiện
                </button>
                <button className="text-xs text-white/50 hover:text-white/80 transition-colors">
                  📞 Hỗ trợ
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty State - Chưa chọn phòng chat
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30 animate-pulse-glow">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Chào mừng đến với Real Chat!
              </h2>
              <p className="text-emerald-200 mb-6">
                Hãy chọn hoặc tạo một phòng chat để bắt đầu trò chuyện
              </p>
              <button
                // onClick={createNewRoom}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-500/30 inline-flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Tạo phòng chat mới</span>
              </button>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 text-xs">50+ Thành viên</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 text-xs">24/7 Support</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 text-xs">Phản hồi nhanh</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
