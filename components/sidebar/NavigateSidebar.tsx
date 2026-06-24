import {
  MessageSquare,
  Users,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigateSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigateSidebar = ({ activeTab, setActiveTab }: NavigateSidebarProps) => {
  const { user } = useAuth();

  const menuItems = [
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "contact", icon: Users, label: "Contacts" },
  ];

  const actionItems = [
    { id: "add", icon: Plus, label: "Add" },
    { id: "search", icon: Search, label: "Search" },
  ];

  return (
    <div className="w-[72px] h-screen bg-[#F9F9F9] dark:bg-zinc-950 flex flex-col justify-between items-center py-6 border-r border-slate-200 dark:border-zinc-800 z-10 shrink-0">
      {/* Top Menu Items */}
      <div className="flex flex-col items-center w-full gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-500 dark:text-emerald-100/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
              }`}
              title={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-8 h-px bg-slate-200 dark:bg-white/10 my-1" />

        {/* Action Items */}
        {actionItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-500 dark:text-emerald-100/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
              }`}
              title={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}
      </div>

      {/* Bottom Items */}
      <div className="flex flex-col items-center w-full gap-4">
        {/* Settings */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer ${
            activeTab === "settings"
              ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-500 dark:text-emerald-100/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
          }`}
          title="Settings"
        >
          <Settings
            size={20}
            strokeWidth={activeTab === "settings" ? 2.5 : 2}
          />
        </button>

        {/* User Avatar Placeholder */}
        <div
          className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:brightness-110 transition-all duration-200 relative overflow-hidden shadow-inner"
          title={user?.name || "User"}
        >
          {user?.name ? (
            <span className="text-sm select-none">
              {user.name.split(" ").pop()?.charAt(0).toUpperCase() ||
                user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User size={20} className="text-slate-700 dark:text-white/80" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigateSidebar;
