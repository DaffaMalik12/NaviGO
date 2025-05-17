import React, { useState } from "react";
import { Search, Clock } from "lucide-react";

/**
 * Search input with recent searches dropdown
 * @param {Object} props
 * @param {string} props.value - The current search value
 * @param {Function} props.onChange - Function called when value changes
 * @param {Array<string>} props.recentSearches - List of recent searches
 * @param {Function} props.onRecentSearchClick - Function called when recent search is clicked
 * @param {Function} props.onClearHistory - Function to clear search history
 * @param {string} props.placeholder - Placeholder text
 * @param {(value: string) => void} - props.Onchange -
 */
const SearchBar = ({
    value,
    onChange,
    recentSearches = [],
    onRecentSearchClick,
    onClearHistory,
    placeholder = "Cari...",
}) => {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowHistory(true);
                }}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder={placeholder}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>

            {/* Recent Searches Dropdown */}
            {showHistory && recentSearches.length > 0 && (
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50">
                    <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                            Pencarian Terakhir
                        </span>
                        <button
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                            onClick={onClearHistory}
                        >
                            Hapus Semua
                        </button>
                    </div>
                    {recentSearches.map((search, idx) => (
                        <div
                            key={idx}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                                onRecentSearchClick(search);
                                setShowHistory(false);
                            }}
                        >
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{search}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
