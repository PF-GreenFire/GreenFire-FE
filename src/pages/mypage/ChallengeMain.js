import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChallengesAPI, getParticipatingChallengesAPI, getMyCreatedChallengesAPI } from '../../apis/challengeAPI';
import { IoIosArrowBack, IoIosSearch } from 'react-icons/io';
import './ChallengeMain.css';

const ChallengeMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const challengeData = useSelector(state => state.challengeReducer);
  const challenges = challengeData?.challenges || [];
  const totalCount = challengeData?.totalCount || 0;

  // Local state
  const [activeTab, setActiveTab] = useState('all'); // all, participating, created
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, category, etc.
  const [sortBy, setSortBy] = useState('latest'); // latest, popular, deadline
  const [username, setUsername] = useState('메밀먼'); // 임시 사용자명

  // 초기 데이터 로드
  useEffect(() => {
    loadChallenges();
  }, [activeTab, sortBy]);

  // 챌린지 데이터 로드
  const loadChallenges = () => {
    const params = {
      search: searchQuery,
      sortBy: sortBy,
      filter: filterType !== 'all' ? filterType : undefined
    };

    if (activeTab === 'all') {
      dispatch(getAllChallengesAPI(params));
    } else if (activeTab === 'participating') {
      dispatch(getParticipatingChallengesAPI(params));
    } else if (activeTab === 'created') {
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

  // 정렬 옵션 텍스트
  const getSortText = () => {
    switch(sortBy) {
      case 'latest': return '최신 등록순';
      case 'popular': return '인기순';
      case 'deadline': return '마감임박순';
      default: return '최신 등록순';
    }
  };

  // 필터 옵션 텍스트
  const getFilterText = () => {
    switch(filterType) {
      case 'all': return '필터링';
      case 'recruiting': return '모집중';
      case 'ongoing': return '진행중';
      case 'completed': return '종료';
      default: return '필터링';
    }
  };

  return (
    <>
      {/* 헤더 */}
      <Row className="challenge-header-row">
        <div className="challenge-header">
          <IoIosArrowBack className="back-icon" onClick={handleGoBack} />
          <h1 className="header-title">{username}님의 챌린지</h1>
        </div>
      </Row>

      {/* 탭 버튼 */}
      <Row className="tab-buttons-row">
        <div className="tab-buttons">
          <Button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabClick('all')}
          >
            전체
          </Button>
          <Button
            className={`tab-button ${activeTab === 'participating' ? 'active' : ''}`}
            onClick={() => handleTabClick('participating')}
          >
            참여중인 챌린지
          </Button>
          <Button
            className={`tab-button ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => handleTabClick('created')}
          >
            내가 만든 챌린지
          </Button>
        </div>
      </Row>

      {/* 검색 및 필터 영역 */}
      <Row className="search-filter-row">
        <div className="search-filter-area">
          <Dropdown className="filter-dropdown">
            <Dropdown.Toggle className="filter-toggle">
              {getFilterText()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterChange('all')}>전체</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange('recruiting')}>모집중</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange('ongoing')}>진행중</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange('completed')}>종료</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Form className="search-form" onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="검색하시오"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button variant="link" type="submit" className="search-button">
                <IoIosSearch />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </Row>

      <Container className="text-center justify-content-center">
        {/* 결과 카운트 및 정렬 */}
        <div className="result-header">
          <span className="result-count">총 {totalCount}개</span>
          <Dropdown className="sort-dropdown">
            <Dropdown.Toggle className="sort-toggle">
              {getSortText()}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => handleSortChange('latest')}>최신 등록순</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('popular')}>인기순</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('deadline')}>마감임박순</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* 챌린지 카드 그리드 */}
        <Row>
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <Col xs={4} key={challenge.id} className="challenge-col">
                <div
                  className="challenge-card"
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <div className="challenge-image-wrapper">
                    <img
                      src={challenge.imageUrl || '/challenge-placeholder.png'}
                      alt={challenge.title}
                      className="challenge-image"
                    />
                  </div>
                  <div className="challenge-info">
                    <p className="challenge-type">{challenge.type || '기연빙'}</p>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div className="no-challenges">
              <p>챌린지가 없습니다.</p>
            </div>
          )}
        </Row>
      </Container>
    </>
  );
};

export default ChallengeMain;
