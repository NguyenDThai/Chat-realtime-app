import { Eye, Moon, Palette, Sun } from "lucide-react";
import { useState } from "react";

const ActiveTabSetting = () => {
  const [selectedColor, setSelectedColor] = useState("green");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  // Chọn giao diện tạm thời
  const [tempTheme, setTempTheme] = useState<"dark" | "light">(
    isDarkMode ? "dark" : "light",
  );

  const handleThemeChanege = (mode: "light" | "dark") => {
    setTempTheme(mode);
  };

  // Sự kiện khi bấm vào nút lưu
  const handleSave = () => {
    if (tempTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    }
  };

  // Mảng chứa cấu hình các màu sắc
  const colors = [
    {
      id: "green",
      name: "Xanh lá",
      bgClass: "bg-emerald-500/15 hover:bg-emerald-500/25",
      textClass: "text-emerald-600 dark:text-emerald-400",
      dotClass: "bg-emerald-600 dark:bg-emerald-500",
    },
    {
      id: "blue",
      name: "Xanh",
      bgClass: "bg-blue-500/15 hover:bg-blue-500/25",
      textClass: "text-blue-600 dark:text-blue-400",
      dotClass: "bg-blue-600 dark:bg-blue-500",
    },
    {
      id: "purple",
      name: "Tím",
      bgClass: "bg-purple-500/15 hover:bg-purple-500/25",
      textClass: "text-purple-600 dark:text-purple-400",
      dotClass: "bg-purple-600 dark:bg-purple-500",
    },
    {
      id: "pink",
      name: "Hồng",
      bgClass: "bg-pink-500/15 hover:bg-pink-500/25",
      textClass: "text-pink-600 dark:text-pink-400",
      dotClass: "bg-pink-600 dark:bg-pink-500",
    },
    {
      id: "red",
      name: "Đỏ",
      bgClass: "bg-red-500/15 hover:bg-red-500/25",
      textClass: "text-red-600 dark:text-red-400",
      dotClass: "bg-red-600 dark:bg-red-500",
    },
    {
      id: "orange",
      name: "Cam",
      bgClass: "bg-orange-500/15 hover:bg-orange-500/25",
      textClass: "text-orange-600 dark:text-orange-400",
      dotClass: "bg-orange-600 dark:bg-orange-500",
    },
    {
      id: "gray",
      name: "Xám",
      bgClass: "bg-slate-500/15 hover:bg-slate-500/25",
      textClass: "text-slate-500 dark:text-slate-400",
      dotClass: "bg-slate-600 dark:bg-slate-500",
    },
  ];

  return (
    <div className="w-[625px] mx-auto mt-6">
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-white">
          Giao diện cấu hình
        </h3>
        <button
          onClick={handleSave}
          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[16px] text-sm cursor-pointer transition-colors"
        >
          Lưu
        </button>
      </div>
      {/* body */}
      <div className="mt-4 flex flex-col gap-2">
        {/* Dark mode, light mode */}
        <div className="py-4 px-[18px] border border-slate-200 dark:border-gray-700 rounded-[10px]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-700 dark:text-white" />
            <span className="text-base text-slate-800 dark:text-white font-normal">
              Giao diện
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => handleThemeChanege("light")}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-[8px] border-2 cursor-pointer transition-all ${
                tempTheme === "light"
                  ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-400 font-semibold"
                  : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-base font-normal">Sáng</span>
            </button>
            <button
              onClick={() => handleThemeChanege("dark")}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-[8px] border-2 cursor-pointer transition-all ${
                tempTheme == "dark"
                  ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-400 font-semibold"
                  : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-base font-normal">Tối</span>
            </button>
          </div>
        </div>
        {/* color theme */}
        <div className="py-4 px-[18px] border border-slate-200 dark:border-gray-700 rounded-[10px]">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-700 dark:text-white" />
            <span className="text-base text-slate-800 dark:text-white font-normal">
              Màu chủ đề
            </span>
          </div>
          <div className="flex flex-row flex-wrap mt-3 gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c.id)}
                className={`min-w-[82px] h-[34px] flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border transition-all cursor-pointer text-base font-medium ${c.bgClass} ${c.textClass} ${
                  selectedColor === c.id
                    ? "border border-red"
                    : "border-transparent"
                }`}
              >
                <span className={`w-3 h-3 ${c.dotClass} rounded-full `}></span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTabSetting;
