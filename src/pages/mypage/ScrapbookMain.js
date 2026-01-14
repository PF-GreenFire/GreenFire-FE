import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';
import { getScrapsAPI, deleteScrapAPI } from '../../apis/scrapbookAPI';
import { setCategory } from '../../modules/ScrapbookReducer';
import ScrapStoreCard from '../../components/item/card/ScrapStoreCard';
import ScrapChallengeCard from '../../components/item/card/ScrapChallengeCard';
import ScrapFeedCard from '../../components/item/card/ScrapFeedCard';
import ScrapFriendCard from '../../components/item/card/ScrapFriendCard';
import './ScrapbookMain.css';

const ScrapbookMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태
  const { scraps, loading, error, currentCategory } = useSelector(
    state => state.scrapbookReducer
  );

  // 로컬 상태 (필터링용)
  const [selectedRegion, setSelectedRegion] = useState('지역명');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('최신 등록순');

  const categories = ['초록불', '챌린지', '피드', '친구'];
  const regions = ['지역명', '서울시 강남구', '서울시 노원구', '서울시 종로구', '서울시 관악구'];
  const sortOptions = ['최신 등록순', '오래된 순', '이름순'];

  // 카테고리 변경 시 데이터 로드
  useEffect(() => {
    const filters = {
      region: selectedRegion,
      search: searchQuery,
      sort: sortBy
    };
    dispatch(getScrapsAPI(currentCategory, filters));
  }, [currentCategory, selectedRegion, searchQuery, sortBy, dispatch]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    // 필터 초기화
    setSelectedRegion('지역명');
    setSearchQuery('');
    setSortBy('최신 등록순');
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = (scrapId, currentLiked) => {
    dispatch(deleteScrapAPI(scrapId));
  };

  // 카테고리별 카드 렌더링
  const renderCard = (item) => {
    const props = {
      item,
      onLikeToggle: handleLikeToggle
    };

    switch (currentCategory) {
      case '초록불':
        return <ScrapStoreCard key={item.id} {...props} />;
      case '챌린지':
        return <ScrapChallengeCard key={item.id} {...props} />;
      case '피드':
        return <ScrapFeedCard key={item.id} {...props} />;
      case '친구':
        return <ScrapFriendCard key={item.id} {...props} />;
      default:
        return <ScrapStoreCard key={item.id} {...props} />;
    }
  };

  return (
    <div className="scrapbook-container">
      {/* 헤더 */}
      <div className="scrapbook-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className="scrapbook-title">나의 스크랩북</h1>
      </div>

      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${currentCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 검색 영역 */}
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
                onClick={() => setSelectedRegion(region)}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <FiSearch className="search-icon" size={20} />
        </div>
      </div>

      {/* 필터 컨트롤 */}
      <div className="filter-controls">
        <span className="item-count">총 {scraps.length}개</span>
        <Dropdown className="sort-dropdown">
          <Dropdown.Toggle variant="link" className="sort-toggle">
            {sortBy}
            <IoChevronDown className="ms-1" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sortOptions.map((option) => (
              <Dropdown.Item
                key={option}
                onClick={() => setSortBy(option)}
              >
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="error-container">
          <p>에러가 발생했습니다: {error}</p>
        </div>
      )}

      {/* 카드 그리드 */}
      {!loading && !error && (
        <div className="scrap-grid">
          {scraps.length > 0 ? (
            scraps.map((item) => renderCard(item))
          ) : (
            <div className="empty-state">
              <p>스크랩한 {currentCategory}이(가) 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapbookMain;
