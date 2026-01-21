import React from 'react';
import { Row, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io';

const ChallengeSearchFilter = ({
  filterType,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onSearch,
  getFilterText
}) => {
  return (
    <Row className="search-filter-row">
      <div className="search-filter-area">
        <Dropdown className="filter-dropdown">
          <Dropdown.Toggle className="filter-toggle">
            {getFilterText()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onFilterChange('all')}>전체</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('recruiting')}>모집중</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('ongoing')}>진행중</Dropdown.Item>
            <Dropdown.Item onClick={() => onFilterChange('completed')}>종료</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Form className="search-form" onSubmit={onSearch}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="검색하시오"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            <Button variant="link" type="submit" className="search-button">
              <IoIosSearch />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Row>
  );
};

export default ChallengeSearchFilter;
