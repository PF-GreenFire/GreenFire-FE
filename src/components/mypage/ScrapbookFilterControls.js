import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { IoChevronDown } from 'react-icons/io5';

const ScrapbookFilterControls = ({
  itemCount,
  sortOptions,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="filter-controls">
      <span className="item-count">총 {itemCount}개</span>
      <Dropdown className="sort-dropdown">
        <Dropdown.Toggle variant="link" className="sort-toggle">
          {sortBy}
          <IoChevronDown className="ms-1" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {sortOptions.map((option) => (
            <Dropdown.Item
              key={option}
              onClick={() => onSortChange(option)}
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
