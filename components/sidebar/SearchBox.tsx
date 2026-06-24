import { Search, X } from "lucide-react";

const SearchBox = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}) => {
  return (
    <>
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm phòng chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="relative w-full px-4 py-2 pl-10 mb-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm"
        />
        {searchTerm && (
          <X
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 dark:text-white/50 cursor-pointer"
          />
        )}
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-white/50" />
      </div>
    </>
  );
};

export default SearchBox;
