import React, { useState } from 'react';
import { Button, Container, Image, Row } from 'react-bootstrap';
import Challenge from '../../components/main/Challenge';
import ChallengeList from '../../components/ChallengeList';
import { BiMedal } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const ChallengeMain = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체보기');
  const challenges = [
    { id: 1, title: "비건간식 만들기", tag: "비건식", status: "모집중", date: "2024-09-10 13:19" },
    { id: 2, title: "10/11 마포구 플로깅", tag: "플로깅", status: "진행중", date: "2024-09-10 13:19" },
    { id: 3, title: "초록색 전시회 방문 / 대상: 초등학생", tag: "제로웨이스트", status: "종료", date: "2024-09-10 13:19" },
    { id: 4, title: "유기견 보호소 견사 청소 봉사", tag: "봉사", status: "모집중", date: "2024-09-10 13:19" },
    { id: 5, title: "동물보호 캠페인", tag: "동물보호", status: "모집중", date: "2024-09-10 13:19" },
    { id: 6, title: "환경 독서모임", tag: "독서모임", status: "진행중", date: "2024-09-10 13:19" },
  ];

  // 카테고리 클릭 시 해당 카테고리로 필터링
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // 챌린지 리스트 클릭 시 상세로 이동
  const handleRowClick = (row) => {
    navigate(`/challenges/${row.id}`);
  };

  // 챌린지 등록 버튼 클릭 시 등록 페이지로 이동
  const handleMedalClick = () => {
    navigate('/challenge');
  };

  // 카테고리 필터링
  const filteredChallenges = selectedCategory === '전체보기'
    ? challenges
    : challenges.filter(ch => ch.tag === selectedCategory);

  return (
    <>
      <Row className="justify-content-center text-center mb-5">
      <Image
          src="challenge-logo.png"
          alt="챌린지 이미지"
          style={{ width: "300px", height: "200px", objectFit: "contain" }}
          className="mb-3"
        />
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          초록불 챌린지는<br />
          개인의 환경 행동을 변화시키고,<br />
          초록불 회원들과 함께 연대하는 에코챌린지 프로젝트입니다.<br />
          원하시는 챌린지에 참여하여 xp를 획득해 보세요!
        </div>
      </Row>

      <Container className="text-center justify-content-center">
        <Challenge showHeader={false} onIconClick={handleCategoryClick} selectedCategory={selectedCategory}/>
        <ChallengeList rows={filteredChallenges} onRowClick={handleRowClick} />
      </Container>

      <Button
        variant="success"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
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
