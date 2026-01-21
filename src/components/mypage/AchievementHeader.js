import React from 'react';
import { Row } from 'react-bootstrap';
import { IoIosArrowBack } from 'react-icons/io';

const AchievementHeader = ({ onGoBack }) => {
  return (
    <Row className="achievement-header-row">
      <div className="achievement-header">
        <IoIosArrowBack className="back-icon" onClick={onGoBack} />
        <h1 className="achievement-title">달성한 업적</h1>
      </div>
    </Row>
  );
};

export default AchievementHeader;
