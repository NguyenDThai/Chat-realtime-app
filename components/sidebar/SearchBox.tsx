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
          className="relative w-full px-4 py-2 pl-10 mb-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-200 text-white placeholder-white/50 text-sm"
        />
        {searchTerm && (
          <X
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2.5 w-4 h-4 text-white/50 cursor-pointer"
          />
        )}
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
      </div>
    </>
  );
};

export default SearchBox;
