import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../modules/ScrapbookReducer";
import { setFollowFilter } from "../../modules/FollowReducer";
import { getFriendsAPI } from "../../apis/followAPI";
import { getScrapsAPI } from "../../apis/scrapbookAPI";
import PageHeader from "../../components/mypage/PageHeader";
import TabButtons from "../../components/common/TabButtons";
import SearchFilter from "../../components/common/SearchFilter";
import FilterControls from "../../components/common/FilterControls";
import ScrapGrid from "../../components/mypage/ScrapGrid";

// 임시 데이터
const MOCK_DATA = {
  greenFire: [
    {
      id: 1,
      name: "초록밥",
      location: "서울시 강남구",
      image: "https://picsum.photos/300/200?random=1",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 2,
      name: "월남맛집",
      location: "서울시 노원구",
      image: "https://picsum.photos/300/200?random=2",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 3,
      name: "쌈밥짱짱맨",
      location: "서울시 종로구",
      image: "https://picsum.photos/300/200?random=3",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 4,
      name: "호두땅콩",
      location: "서울시 용산구",
      image: "https://picsum.photos/300/200?random=4",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 5,
      name: "에코파스타",
      location: "서울시 중구",
      image: "https://picsum.photos/300/200?random=5",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 6,
      name: "각하몰리",
      location: "서울시 영등포구",
      image: "https://picsum.photos/300/200?random=6",
      tags: ["샐러드", "포케"],
      liked: true,
    },
    {
      id: 7,
      name: "그린샐러드",
      location: "서울시 마포구",
      image: "https://picsum.photos/300/200?random=7",
      tags: ["샐러드", "비건"],
      liked: true,
    },
    {
      id: 8,
      name: "자연식당",
      location: "서울시 서초구",
      image: "https://picsum.photos/300/200?random=8",
      tags: ["한식", "건강식"],
      liked: true,
    },
    {
      id: 9,
      name: "채식주의",
      location: "서울시 송파구",
      image: "https://picsum.photos/300/200?random=9",
      tags: ["비건", "채식"],
      liked: true,
    },
  ],
  feed: [
    {
      id: 1,
      author: "가연핑",
      content: "오늘도 플로깅 완료!",
      image: "https://picsum.photos/300/300?random=20",
      liked: true,
    },
    {
      id: 2,
      author: "시온핑",
      content: "제로웨이스트 샵 방문",
      image: "https://picsum.photos/300/300?random=21",
      liked: true,
    },
    {
      id: 3,
      author: "예원핑",
      content: "텀블러 인증샷",
      image: "https://picsum.photos/300/300?random=22",
      liked: true,
    },
    {
      id: 4,
      author: "다솔핑",
      content: "분리수거 완료",
      image: "https://picsum.photos/300/300?random=23",
      liked: true,
    },
    {
      id: 5,
      author: "유진핑",
      content: "비건 식단 도전 중",
      image: "https://picsum.photos/300/300?random=24",
      liked: true,
    },
    {
      id: 6,
      author: "민수핑",
      content: "자전거 출퇴근 시작",
      image: "https://picsum.photos/300/300?random=25",
      liked: true,
    },
    {
      id: 7,
      author: "지현핑",
      content: "에코백 장보기",
      image: "https://picsum.photos/300/300?random=26",
      liked: true,
    },
    {
      id: 8,
      author: "서연핑",
      content: "친환경 제품 리뷰",
      image: "https://picsum.photos/300/300?random=27",
      liked: true,
    },
    {
      id: 9,
      author: "준호핑",
      content: "해변 정화 봉사",
      image: "https://picsum.photos/300/300?random=28",
      liked: true,
    },
  ],
};

const greenFireFilterOptions = ["전체", "지역명"];
const challengeFilterOptions = ["전체", "주최자"];
const feedFilterOptions = ["전체", "아이디"];
const followFilterOptions = ["팔로워", "팔로잉"];

const sortScraps = (data, sortBy) => {
  const sorted = [...data];
  switch (sortBy) {
    case "최신 등록순":
      return sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    case "오래된 순":
      return sorted.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    case "이름순":
      return sorted.sort((a, b) =>
        (a.challengeTitle || a.title || a.name || "").localeCompare(
          b.challengeTitle || b.title || b.name || "",
          "ko",
        ),
      );
    default:
      return sorted;
  }
};

const ScrapbookMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태
  const {
    activeTab,
    scraps: scrapbookScraps,
    loading: scrapbookLoading,
  } = useSelector((state) => state.scrapbookReducer);
  const {
    friends,
    activeFilter,
    loading: followLoading,
  } = useSelector((state) => state.followReducer);

  // 탭 변경 시 API 호출
  useEffect(() => {
    switch (activeTab) {
      case "greenFire":
        dispatch(getScrapsAPI("greenfire"));
        break;
      case "challenge":
        dispatch(getScrapsAPI("challenge"));
        break;
      case "feed":
        dispatch(getScrapsAPI("feed"));
        break;
      case "friend":
        dispatch(getFriendsAPI());
        break;
      default:
        break;
    }
  }, [activeTab, dispatch]);

  // 데이터 소스 결정 (API 데이터 우선, 없으면 MOCK_DATA 폴백)
  const getScrapsData = () => {
    switch (activeTab) {
      case "greenFire":
        return scrapbookScraps.length > 0
          ? scrapbookScraps
          : MOCK_DATA.greenFire;
      case "challenge":
        return scrapbookScraps || [];
      case "feed":
        return scrapbookScraps.length > 0 ? scrapbookScraps : MOCK_DATA.feed;
      case "friend":
        if (activeFilter === "팔로워") return friends.filter((f) => f.isFollower);
        if (activeFilter === "팔로잉") return friends.filter((f) => f.isFollowing);
        return friends;
      default:
        return [];
    }
  };

  // 로컬 상태 (필터링용)
  const [greenFireFilter, setGreenFireFilter] = useState("전체");
  const [challengeFilter, setChallengeFilter] = useState("전체");
  const [feedFilter, setFeedFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("최신 등록순");

  // 프론트엔드 필터링
  const filterScraps = (data) => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case "greenFire":
        if (greenFireFilter === "지역명") {
          return data.filter((item) =>
            item.location?.toLowerCase().includes(query),
          );
        }
        return data.filter(
          (item) =>
            item.name?.toLowerCase().includes(query) ||
            item.location?.toLowerCase().includes(query),
        );
      case "challenge":
        if (challengeFilter === "주최자") {
          return data.filter((item) =>
            item.hostUser?.toLowerCase().includes(query),
          );
        }
        return data.filter((item) =>
          item.challengeTitle?.toLowerCase().includes(query),
        );
      case "feed":
        if (feedFilter === "아이디") {
          return data.filter((item) =>
            item.author?.toLowerCase().includes(query),
          );
        }
        return data.filter(
          (item) =>
            item.author?.toLowerCase().includes(query) ||
            item.content?.toLowerCase().includes(query),
        );
      default:
        return data;
    }
  };

  const scraps = sortScraps(filterScraps(getScrapsData()), sortBy);
  const loading = activeTab === "friend" ? followLoading : scrapbookLoading;
  const error = null;

  // 탭 옵션
  const tabs = [
    { id: "greenFire", label: "초록불" },
    { id: "challenge", label: "챌린지" },
    { id: "feed", label: "피드" },
    { id: "friend", label: "친구" },
  ];
  const sortOptions = ["최신 등록순", "오래된 순", "이름순"];

  // 챌린지 필터 변경 핸들러 (프론트엔드 필터링만)
  const handleChallengeFilterChange = (filter) => {
    setChallengeFilter(filter);
    setSortBy("최신 등록순");
  };

  // 팔로우 필터 변경 핸들러 (프론트엔드 전환만)
  const handleFollowFilterChange = (filter) => {
    dispatch(setFollowFilter(filter));
  };

  // 카테고리 변경 핸들러
  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));
    // 필터 초기화
    setSearchQuery("");
    setSortBy("최신 등록순");
    if (tab === "greenFire") setGreenFireFilter("전체");
    if (tab === "challenge") setChallengeFilter("전체");
    if (tab === "feed") setFeedFilter("전체");
    if (tab === "friend") dispatch(setFollowFilter("팔로워"));
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <PageHeader title="나의 스크랩북" />

      <TabButtons
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabClick}
      />
      <SearchFilter
        options={(activeTab === "greenFire"
            ? greenFireFilterOptions
            : activeTab === "challenge"
              ? challengeFilterOptions
              : activeTab === "feed"
                ? feedFilterOptions
                : followFilterOptions
        ).map((opt) => ({ value: opt, label: opt }))}
        selectedValue={
          activeTab === "greenFire"
            ? greenFireFilter
            : activeTab === "challenge"
              ? challengeFilter
              : activeTab === "feed"
                ? feedFilter
                : activeFilter
        }
        onOptionChange={
          activeTab === "greenFire"
            ? setGreenFireFilter
            : activeTab === "challenge"
              ? handleChallengeFilterChange
              : activeTab === "feed"
                ? setFeedFilter
                : handleFollowFilterChange
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FilterControls
        itemCount={scraps.length}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ScrapGrid
          scraps={scraps}
          activeTab={activeTab}
          followFilter={activeFilter}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );
};

export default ScrapbookMain;
