import React from 'react';
import { Button, Container, Image, Row } from 'react-bootstrap';
import Challenge from '../../components/main/Challenge';
import ChallengeList from '../../components/ChallengeList';
import { BiMedal } from 'react-icons/bi';

const ChallengeMain = () => {
  const challenges = [
    { title: "비건간식 만들기", tag: "", status: "모집중", date: "2024-09-10 13:19" },
    { title: "10/11 마포구 플로깅", tag: "플로깅", status: "진행중", date: "2024-09-10 13:19" },
    { title: "초록색 전시회 방문 / 대상: 초등학생", tag: "", status: "종료", date: "2024-09-10 13:19" },
    { title: "유기견 보호소 견사 청소 봉사", tag: "봉사활동", status: "모집중", date: "2024-09-10 13:19" },
  ];  

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

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
        <Challenge showHeader={false}/>
        {/* headers는 필요 없고 challenges를 넘겨줍니다 */}
        <ChallengeList rows={challenges} onRowClick={handleRowClick} />
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
      >
        <BiMedal />
      </Button>
    </>
  );
};

export default ChallengeMain;
