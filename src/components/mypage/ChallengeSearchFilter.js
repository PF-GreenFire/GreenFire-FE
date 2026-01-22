import SearchFilter from "../common/SearchFilter";

const FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "recruiting", label: "모집중" },
  { value: "ongoing", label: "진행중" },
  { value: "completed", label: "종료" },
];

const ChallengeSearchFilter = ({
  filterType,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onSearch,
  getFilterText,
}) => {
  return (
    <SearchFilter
      options={FILTER_OPTIONS}
      selectedValue={getFilterText()}
      onOptionChange={onFilterChange}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
      placeholder="검색하시오"
    />
  );
};

export default ChallengeSearchFilter;
