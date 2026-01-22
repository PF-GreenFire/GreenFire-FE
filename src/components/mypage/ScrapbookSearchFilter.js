import SearchFilter from "../common/SearchFilter";

const ScrapbookSearchFilter = ({
  regions,
  selectedRegion,
  searchQuery,
  onRegionChange,
  onSearchChange,
  onSearch,
}) => {
  // regions 배열을 options 형식으로 변환
  const options = regions.map((region) => ({
    value: region,
    label: region,
  }));

  return (
    <SearchFilter
      options={options}
      selectedValue={selectedRegion}
      onOptionChange={onRegionChange}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
      placeholder="검색하시오"
    />
  );
};

export default ScrapbookSearchFilter;
