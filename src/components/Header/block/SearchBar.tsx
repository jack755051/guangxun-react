import type { ISearch } from "@/model/view-model/header.view-model";
import { useState } from "react";

export function SearchBarBlock({ placeholder }: ISearch) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 實作搜尋邏輯
    console.log("Search for:", searchValue);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="w-64 px-4 py-2 bg-gray-700/30 border border-gray-600/50 rounded-lg text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-gray-700/50 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          aria-label="搜尋"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
