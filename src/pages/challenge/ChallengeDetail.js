import React from 'react';
import { useParams } from 'react-router-dom';

const ChallengeDetail = () => {
  const { id } = useParams();
  return (
    <div style={{padding: '40px 0', textAlign: 'center'}}>
      <h2>챌린지 상세 페이지 (임시)</h2>
      <p>챌린지 ID: {id}</p>
      <p>여기에 챌린지 상세 내용이 들어갑니다.</p>
    </div>
  );
};

export default ChallengeDetail; 