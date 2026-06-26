import type { RootState } from "@/src/store";
import { UserRoundCheck, Users } from "lucide-react";
import { useSelector } from "react-redux";

interface ActiveTabContactSidebarProps {
  contactSubTab: "members" | "groups";
  setContactSubTab: (tab: "members" | "groups") => void;
}

const ActiveTabContactSidebar = ({
  contactSubTab,
  setContactSubTab,
}: ActiveTabContactSidebarProps) => {
  const { allUser, rooms } = useSelector((state: RootState) => state.chat);
  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        {/* Danh sách thành viên */}
        <div
          onClick={() => setContactSubTab("members")}
          className={`flex items-center justify-between ${
            contactSubTab === "members"
              ? "bg-[var(--color-theme-primary)] text-white"
              : "text-slate-700 dark:text-white/80 hover:bg-slate-200/50 dark:hover:bg-white/10"
          } px-3 py-2 rounded-lg cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <UserRoundCheck className="w-[16px] h-[16px]" />
            <span className="text-[16px]">Danh sách thành viên</span>
          </div>
          <span className="text-[16px]">{allUser.length}</span>
        </div>

        {/* Danh sách nhóm */}
        <div
          onClick={() => setContactSubTab("groups")}
          className={`flex items-center justify-between ${
            contactSubTab === "groups"
              ? "bg-[var(--color-theme-primary)] text-white"
              : "text-slate-700 dark:text-white/80 hover:bg-slate-200/50 dark:hover:bg-white/10"
          } px-3 py-2 rounded-lg cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-[16px] h-[16px]" />
            <span className="text-[16px]">Danh sách nhóm</span>
          </div>
          <span className="text-[16px]">
            {rooms.filter((room) => room.type === "group").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveTabContactSidebar;
