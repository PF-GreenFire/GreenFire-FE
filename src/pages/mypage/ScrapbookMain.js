import { Container, Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getScrapsAPI, deleteScrapAPI } from "../../apis/scrapbookAPI";
import { setCategory } from "../../modules/ScrapbookReducer";
import ScrapbookHeader from "../../components/mypage/ScrapbookHeader";
import ScrapbookCategoryTabs from "../../components/mypage/ScrapbookCategoryTabs";
import ScrapbookSearchSection from "../../components/mypage/ScrapbookSearchSection";
import ScrapbookFilterControls from "../../components/mypage/ScrapbookFilterControls";
import ScrapGrid from "../../components/mypage/ScrapGrid";
import "./ScrapbookMain.css";

const ScrapbookMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태
  const { scraps, loading, error, currentCategory } = useSelector(
    (state) => state.scrapbookReducer,
  );

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

  // 카테고리 변경 시 데이터 로드
  useEffect(() => {
    const filters = {
      region: selectedRegion,
      search: searchQuery,
      sort: sortBy,
    };
    dispatch(getScrapsAPI(currentCategory, filters));
  }, [currentCategory, selectedRegion, searchQuery, sortBy, dispatch]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    // 필터 초기화
    setSelectedRegion("지역명");
    setSearchQuery("");
    setSortBy("최신 등록순");
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = (scrapId, currentLiked) => {
    dispatch(deleteScrapAPI(scrapId));
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
      <ScrapbookHeader onGoBack={handleGoBack} />

      <ScrapbookCategoryTabs
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ScrapbookSearchSection
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

      <ScrapGrid
        scraps={scraps}
        currentCategory={currentCategory}
        loading={loading}
        error={error}
        onLikeToggle={handleLikeToggle}
      />
    </Container>
  );
};

export default ScrapbookMain;
