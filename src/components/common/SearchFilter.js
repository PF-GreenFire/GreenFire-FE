import { useState, useRef, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";

const SearchFilter = ({
  options = [],
  selectedValue,
  onOptionChange,
  searchQuery,
  onSearchChange,
  onSearch,
  placeholder = "검색하시오",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  const handleOptionSelect = (value) => {
    onOptionChange(value);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2.5 px-4">
      {/* Custom Dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-1.5 px-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 min-w-[80px] hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
        >
          <span className="text-xs leading-normal whitespace-nowrap">
            {selectedValue}
          </span>
          <IoChevronDown
            className={`text-xs text-gray-600 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute top-full left-0 mt-1 min-w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 py-1 pl-0 list-none">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`text-xs py-2 px-3 cursor-pointer whitespace-nowrap hover:bg-gray-100 hover:text-green-primary ${
                  selectedValue === option.label
                    ? "text-green-primary font-medium"
                    : "text-gray-600"
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input */}
      <div className="flex-1 flex border border-gray-200 rounded-md overflow-hidden bg-white">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none text-xs py-1.5 px-2.5 focus:outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          className="bg-transparent border-none py-1.5 px-2.5 text-gray-600 hover:text-green-primary cursor-pointer"
          onClick={onSearch}
        >
          <IoIosSearch className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
