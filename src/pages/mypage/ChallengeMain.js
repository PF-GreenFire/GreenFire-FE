import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChallengesAPI } from "../../apis/challengeAPI";
import PageHeader from "../../components/mypage/PageHeader";
import TabButtons from "../../components/common/TabButtons";
import SearchFilter from "../../components/common/SearchFilter";
import FilterControls from "../../components/common/FilterControls";
import ChallengeCardGrid from "../../components/mypage/ChallengeCardGrid";


const ChallengeMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const challengeData = useSelector((state) => state.challengeReducer);
  const { user } = useSelector((state) => state.mypageReducer);

  const challenges = challengeData?.challenges || [];
  const totalCount = challengeData?.totalCount || 0;

  // Local state
  const [activeTab, setActiveTab] = useState("all"); // all, participating, created
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, category, etc.
  const [sortBy, setSortBy] = useState("latest"); // latest, popular, deadline

  // 초기 데이터 로드
  useEffect(() => {
    loadChallenges();
  }, [activeTab, sortBy]);

  // 챌린지 데이터 로드
  const loadChallenges = () => {
    const params = {
      search: searchQuery,
      sortBy: sortBy,
      filter: filterType !== "all" ? filterType : undefined,
    };

    dispatch(getChallengesAPI(activeTab, params));
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    loadChallenges();
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter) => {
    setFilterType(filter);
  };

  // 챌린지 카드 클릭 핸들러
  const handleChallengeClick = (challengeId) => {
    navigate(`/challenges/${challengeId}`);
  };

  // 탭별 빈 상태 메시지
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "participating": return "참여중인 챌린지가 없습니다.";
      case "created":       return "내가 만든 챌린지가 없습니다.";
      default:              return "챌린지가 없습니다.";
    }
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  // 탭 옵션
  const tabs = [
    { id: "all", label: "전체" },
    { id: "participating", label: "참여중인 챌린지" },
    { id: "created", label: "내가 만든 챌린지" },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: "latest", label: "최신 등록순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
  ];

  // 필터 옵션 텍스트
  const getFilterText = () => {
    switch (filterType) {
      case "all":
        return "전체";
      case "recruiting":
        return "모집중";
      case "ongoing":
        return "진행중";
      case "completed":
        return "종료";
      default:
        return "필터링";
    }
  };

  return (
    <>
      <PageHeader title={`${user.nickname}님의 챌린지`} />

      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabClick}
      />

      <SearchFilter
        options={[
          { value: "all", label: "전체" },
          { value: "recruiting", label: "모집중" },
          { value: "ongoing", label: "진행중" },
          { value: "completed", label: "종료" },
        ]}
        selectedValue={getFilterText()}
        onOptionChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <FilterControls
        itemCount={totalCount}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ChallengeCardGrid
          challenges={challenges}
          onChallengeClick={handleChallengeClick}
          emptyMessage={getEmptyMessage()}
        />
      </Container>
    </>
  );
};

export default ChallengeMain;
