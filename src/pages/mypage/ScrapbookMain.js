import { Container } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../modules/ScrapbookReducer";
import ScrapbookHeader from "../../components/mypage/ScrapbookHeader";
import ScrapbookCategoryTabs from "../../components/mypage/ScrapbookCategoryTabs";
import ScrapbookSearchFilter from "../../components/mypage/ScrapbookSearchFilter";
import ScrapbookFilterControls from "../../components/mypage/ScrapbookFilterControls";
import ScrapGrid from "../../components/mypage/ScrapGrid";
import "./ScrapbookMain.css";

// 임시 데이터
const MOCK_DATA = {
  초록불: [
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
  챌린지: [
    {
      id: 1,
      title: "HEJ, PLOGGING",
      image: "https://picsum.photos/300/300?random=10",
      status: "진행중",
      participants: 120,
      liked: true,
    },
    {
      id: 2,
      title: "플라스틱 없는 삶",
      image: "https://picsum.photos/300/300?random=11",
      status: "모집중",
      participants: 85,
      liked: true,
    },
    {
      id: 3,
      title: "우리의 힘",
      image: "https://picsum.photos/300/300?random=12",
      status: "진행중",
      participants: 200,
      liked: true,
    },
    {
      id: 4,
      title: "제로웨이스트 도전",
      image: "https://picsum.photos/300/300?random=13",
      status: "모집중",
      participants: 50,
      liked: true,
    },
    {
      id: 5,
      title: "텀블러 사용하기",
      image: "https://picsum.photos/300/300?random=14",
      status: "진행중",
      participants: 300,
      liked: true,
    },
    {
      id: 6,
      title: "대중교통 이용",
      image: "https://picsum.photos/300/300?random=15",
      status: "종료",
      participants: 150,
      liked: true,
    },
    {
      id: 7,
      title: "에코백 챌린지",
      image: "https://picsum.photos/300/300?random=16",
      status: "진행중",
      participants: 180,
      liked: true,
    },
    {
      id: 8,
      title: "분리수거 마스터",
      image: "https://picsum.photos/300/300?random=17",
      status: "모집중",
      participants: 90,
      liked: true,
    },
    {
      id: 9,
      title: "채식 일주일",
      image: "https://picsum.photos/300/300?random=18",
      status: "진행중",
      participants: 75,
      liked: true,
    },
  ],
  피드: [
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
  친구: [
    {
      id: 1,
      nickname: "가연핑",
      userId: "ggggggggggg",
      bio: "저는 가연핑입니다",
      profileImage: "https://picsum.photos/100/100?random=30",
      liked: true,
    },
    {
      id: 2,
      nickname: "다솔핑",
      userId: "ddddddddddd",
      bio: "저는 다솔핑입니다",
      profileImage: "https://picsum.photos/100/100?random=31",
      liked: true,
    },
    {
      id: 3,
      nickname: "예원핑",
      userId: "yyyyyyyyyyy",
      bio: "저는 예원핑입니다",
      profileImage: "https://picsum.photos/100/100?random=32",
      liked: true,
    },
    {
      id: 4,
      nickname: "시온핑",
      userId: "sssssssssss",
      bio: "저는 시온핑입니다",
      profileImage: "https://picsum.photos/100/100?random=33",
      liked: true,
    },
    {
      id: 5,
      nickname: "유진님핑",
      userId: "yyyyyyyyyyyy",
      bio: "저는 유진님핑입니다",
      profileImage: "https://picsum.photos/100/100?random=34",
      liked: true,
    },
    {
      id: 6,
      nickname: "민수핑",
      userId: "mmmmmmmmmmm",
      bio: "저는 민수핑입니다",
      profileImage: "https://picsum.photos/100/100?random=35",
      liked: true,
    },
    {
      id: 7,
      nickname: "지현핑",
      userId: "jjjjjjjjjjj",
      bio: "저는 지현핑입니다",
      profileImage: "https://picsum.photos/100/100?random=36",
      liked: true,
    },
  ],
};

const ScrapbookMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태
  const { currentCategory } = useSelector((state) => state.scrapbookReducer);

  // 임시 데이터 사용 (테스트용)
  const scraps = MOCK_DATA[currentCategory] || [];
  const loading = false;
  const error = null;

  // 로컬 상태 (필터링용)
  const [selectedRegion, setSelectedRegion] = useState("지역명");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("최신 등록순");

  const categories = ["초록불", "챌린지", "피드", "친구"];
  const regions = [
    "지역명",
    "서울시 강남구",
    "서울시 노원구",
    "서울시 종로구",
    "서울시 관악구",
  ];
  const sortOptions = ["최신 등록순", "오래된 순", "이름순"];

  // 카테고리 변경 시 데이터 로드 (임시 데이터 사용으로 비활성화)
  // useEffect(() => {
  //   const filters = {
  //     region: selectedRegion,
  //     search: searchQuery,
  //     sort: sortBy,
  //   };
  //   dispatch(getScrapsAPI(currentCategory, filters));
  // }, [currentCategory, selectedRegion, searchQuery, sortBy, dispatch]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    // 필터 초기화
    setSelectedRegion("지역명");
    setSearchQuery("");
    setSortBy("최신 등록순");
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <ScrapbookHeader onGoBack={handleGoBack} />

      <ScrapbookCategoryTabs
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ScrapbookSearchFilter
        regions={regions}
        selectedRegion={selectedRegion}
        searchQuery={searchQuery}
        onRegionChange={setSelectedRegion}
        onSearchChange={setSearchQuery}
      />

      <ScrapbookFilterControls
        itemCount={scraps.length}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
        <ScrapGrid
          scraps={scraps}
          currentCategory={currentCategory}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );
};

export default ScrapbookMain;
