import React from 'react';
import { Row } from 'react-bootstrap';
import { IoIosArrowBack } from 'react-icons/io';

const ChallengeHeader = ({ username, onGoBack }) => {
  return (
    <Row className="challenge-header-row">
      <div className="challenge-header">
        <IoIosArrowBack className="back-icon" onClick={onGoBack} />
        <h1 className="header-title">{username}님의 챌린지</h1>
      </div>
    </Row>
  );
};

export default ChallengeHeader;
