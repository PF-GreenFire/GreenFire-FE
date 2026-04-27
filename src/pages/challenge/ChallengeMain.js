import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BiMedal } from 'react-icons/bi';
import Challenge from '../../components/main/Challenge';
import ChallengeList from '../../components/ChallengeList';
import { getChallengesAPI } from '../../apis/challengeAPI';

// Challenge.js 의 카테고리 이름 → BE challengeCategoryCode 매핑
// BE category 테이블의 실제 code 와 일치하는지는 실테스트로 검증 필요
const CATEGORY_NAME_TO_CODE = {
  '플로깅': 1,
  '비건식': 2,
  '제로웨이스트': 3,
  '동물보호': 4,
  '독서모임': 5,
  '봉사': 6,
};

const CATEGORY_CODE_TO_NAME = Object.fromEntries(
  Object.entries(CATEGORY_NAME_TO_CODE).map(([name, code]) => [code, name])
);

const STATUS_LABEL = {
  RECRUITING: '모집중',
  ONGOING: '진행중',
  CLOSED: '종료',
  CANCELLED: '취소됨',
  PAUSED: '일시중지',
};

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const ChallengeMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { challenges = [] } = useSelector(
    (state) => state.challengeReducer || { challenges: [] }
  );
  const [selectedCategory, setSelectedCategory] = useState('전체보기');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const categoryCode =
      selectedCategory === '전체보기'
        ? undefined
        : CATEGORY_NAME_TO_CODE[selectedCategory];

    setLoading(true);
    Promise.resolve(
      dispatch(getChallengesAPI({ page: 0, size: 20, categoryCode }))
    )
      .catch((e) => console.error('챌린지 조회 실패:', e))
      .finally(() => setLoading(false));
  }, [selectedCategory, dispatch]);

  const rows = (challenges || []).map((c) => ({
    id: c.challengeCode,
    title: c.challengeTitle,
    tag: CATEGORY_CODE_TO_NAME[c.challengeCategoryCode] || '',
    status: STATUS_LABEL[c.challengeStatus] || '',
    date: formatDate(c.startDate || c.createdAt),
  }));

  const handleCategoryClick = (category) => setSelectedCategory(category);
  const handleRowClick = (row) => navigate(`/challenges/${row.id}`);
  const handleMedalClick = () => navigate('/challenge');

  return (
    <>
      <Row className="justify-content-center text-center mb-5">
        <Image
          src="challenge-logo.png"
          alt="챌린지 이미지"
          style={{ width: '300px', height: '200px', objectFit: 'contain' }}
          className="mb-3"
        />
        <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          초록불 챌린지는<br />
          개인의 환경 행동을 변화시키고,<br />
          초록불 회원들과 함께 연대하는 에코챌린지 프로젝트입니다.<br />
          원하시는 챌린지에 참여하여 xp를 획득해 보세요!
        </div>
      </Row>

      <Container className="text-center justify-content-center">
        <Challenge
          showHeader={false}
          onIconClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />
        {loading ? (
          <div className="py-5">
            <Spinner animation="border" variant="success" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-muted py-5">표시할 챌린지가 없습니다.</div>
        ) : (
          <ChallengeList rows={rows} onRowClick={handleRowClick} />
        )}
      </Container>

      <Button
        variant="success"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
        onClick={handleMedalClick}
      >
        <BiMedal />
      </Button>
    </>
  );
};

export default ChallengeMain;
