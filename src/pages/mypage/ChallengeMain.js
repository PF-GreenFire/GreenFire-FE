import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllChallengesAPI,
  getParticipatingChallengesAPI,
  getMyCreatedChallengesAPI,
} from "../../apis/challengeAPI";
import PageHeader from "../../components/mypage/PageHeader";
import TabButtons from "../../components/common/TabButtons";
import ChallengeSearchFilter from "../../components/mypage/ChallengeSearchFilter";
import FilterControls from "../../components/common/FilterControls";
import ChallengeCardGrid from "../../components/mypage/ChallengeCardGrid";

// 임시 챌린지 데이터
const tempChallenges = [
  {
    id: 1,
    title: "플로깅 챌린지",
    type: "가연핑",
    imageUrl: "https://picsum.photos/200?random=1",
  },
  {
    id: 2,
    title: "플라스틱 없는 삶",
    type: "시온핑",
    imageUrl: "https://picsum.photos/200?random=2",
  },
  {
    id: 3,
    title: "우리의 힘",
    type: "예원핑",
    imageUrl: "https://picsum.photos/200?random=3",
  },
  {
    id: 4,
    title: "플로깅 챌린지2",
    type: "가연핑",
    imageUrl: "https://picsum.photos/200?random=4",
  },
  {
    id: 5,
    title: "플라스틱 없는 삶2",
    type: "시온핑",
    imageUrl: "https://picsum.photos/200?random=5",
  },
  {
    id: 6,
    title: "우리의 힘2",
    type: "예원핑",
    imageUrl: "https://picsum.photos/200?random=6",
  },
  {
    id: 7,
    title: "플로깅 챌린지3",
    type: "가연핑",
    imageUrl: "https://picsum.photos/200?random=7",
  },
  {
    id: 8,
    title: "플라스틱 없는 삶3",
    type: "시온핑",
    imageUrl: "https://picsum.photos/200?random=8",
  },
  {
    id: 9,
    title: "우리의 힘3",
    type: "예원핑",
    imageUrl: "https://picsum.photos/200?random=9",
  },
];

const ChallengeMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const challengeData = useSelector((state) => state.challengeReducer);

  // Redux 데이터가 없으면 임시 데이터 사용
  const challenges =
    challengeData?.challenges?.length > 0
      ? challengeData.challenges
      : tempChallenges;
  const totalCount = challengeData?.totalCount || challenges.length;

  // Local state
  const [activeTab, setActiveTab] = useState("all"); // all, participating, created
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, category, etc.
  const [sortBy, setSortBy] = useState("latest"); // latest, popular, deadline
  const [username, setUsername] = useState("메밀면"); // 임시 사용자명

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

    if (activeTab === "all") {
      dispatch(getAllChallengesAPI(params));
    } else if (activeTab === "participating") {
      dispatch(getParticipatingChallengesAPI(params));
    } else if (activeTab === "created") {
      dispatch(getMyCreatedChallengesAPI(params));
    }
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
      <PageHeader title={`${username}님의 챌린지`} />

      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabClick}
      />

      <ChallengeSearchFilter
        filterType={filterType}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        getFilterText={getFilterText}
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
        />
      </Container>
    </>
  );
};

export default ChallengeMain;
