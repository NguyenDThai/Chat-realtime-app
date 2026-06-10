
const EmptyChat = () => {
  return (
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
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-emerald-500/30 inline-flex items-center space-x-2">
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
  );
};

export default EmptyChat;
