import React from "react";
import { Dropdown } from "react-bootstrap";
import { IoChevronDown } from "react-icons/io5";

const ScrapbookFilterControls = ({
  itemCount,
  sortOptions,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex justify-between items-center py-3 px-1.5 bg-white mb-2">
      <span className="text-sm font-medium text-gray-800">
        총 {itemCount}개
      </span>
      <Dropdown>
        <Dropdown.Toggle
          variant="link"
          className="!text-gray-800 !no-underline !text-sm !p-0 flex items-center !shadow-none !border-none"
        >
          {sortBy}
          <IoChevronDown className="ml-1" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {sortOptions.map((option) => (
            <Dropdown.Item
              key={option}
              onClick={() => onSortChange(option)}
              className="text-sm py-2.5 px-4 hover:bg-gray-100 hover:text-green-primary"
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ScrapbookFilterControls;
