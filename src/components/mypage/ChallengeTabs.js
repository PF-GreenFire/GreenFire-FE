import React from 'react';
import { Row, Button } from 'react-bootstrap';

const ChallengeTabs = ({ activeTab, onTabClick }) => {
  return (
    <Row className="tab-buttons-row">
      <div className="tab-buttons">
        <Button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onTabClick('all')}
        >
          전체
        </Button>
        <Button
          className={`tab-button ${activeTab === 'participating' ? 'active' : ''}`}
          onClick={() => onTabClick('participating')}
        >
          참여중인 챌린지
        </Button>
        <Button
          className={`tab-button ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => onTabClick('created')}
        >
          내가 만든 챌린지
        </Button>
      </div>
    </Row>
  );
};

export default ChallengeTabs;
