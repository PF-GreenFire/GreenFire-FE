import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

const FilterControls = ({
  itemCount,
  sortOptions = [],
  sortBy,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // sortOptions가 문자열 배열인지 객체 배열인지 확인
  const normalizedOptions = sortOptions.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  // 현재 선택된 옵션의 라벨 찾기
  const getCurrentLabel = () => {
    const current = normalizedOptions.find((opt) => opt.value === sortBy);
    return current ? current.label : sortBy;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center py-3 px-4 bg-white">
      <span className="text-xs font-medium text-gray-800">
        총 {itemCount}개
      </span>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs text-gray-600 bg-transparent border-none cursor-pointer"
        >
          {getCurrentLabel()}
          <IoChevronDown
            className={`text-xs transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute top-full right-0 mt-1 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-md z-10 py-1 pl-0 list-none">
            {normalizedOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`text-xs py-2 px-3 cursor-pointer whitespace-nowrap hover:bg-gray-100 hover:text-green-primary ${
                  sortBy === option.value
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
    </div>
  );
};

export default FilterControls;
