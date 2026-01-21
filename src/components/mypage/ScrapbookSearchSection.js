import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';

const ScrapbookSearchSection = ({
  regions,
  selectedRegion,
  searchQuery,
  onRegionChange,
  onSearchChange
}) => {
  return (
    <div className="search-section">
      <Dropdown className="region-dropdown">
        <Dropdown.Toggle variant="light" className="region-toggle">
          {selectedRegion}
          <IoChevronDown className="ms-2" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {regions.map((region) => (
            <Dropdown.Item
              key={region}
              onClick={() => onRegionChange(region)}
            >
              {region}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <div className="search-bar">
        <input
          type="text"
          placeholder="검색하시오"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <FiSearch className="search-icon" size={20} />
      </div>
    </div>
  );
};

export default ScrapbookSearchSection;
