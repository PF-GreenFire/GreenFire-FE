import { Dropdown, Form, InputGroup, Button } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import "./SearchFilter.css";

const SearchFilter = ({
  // Dropdown props
  options = [],
  selectedValue,
  onOptionChange,
  // Search props
  searchQuery,
  onSearchChange,
  onSearch,
  placeholder = "검색하시오",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="search-filter-container">
      <Dropdown className="search-filter-dropdown">
        <Dropdown.Toggle variant="light" className="search-filter-toggle">
          {selectedValue}
          <IoChevronDown className="dropdown-icon" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => onOptionChange(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <InputGroup className="search-filter-input-group">
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-filter-input"
        />
        <Button
          variant="link"
          className="search-filter-button"
          onClick={onSearch}
        >
          <IoIosSearch />
        </Button>
      </InputGroup>
    </div>
  );
};

export default SearchFilter;
