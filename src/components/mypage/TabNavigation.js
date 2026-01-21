import React from 'react';
import { Row } from 'react-bootstrap';

const TabNavigation = ({ activeTab, onTabClick }) => {
  return (
    <Row className="tab-nav-row">
      <div className="tab-nav">
        <button
          className={`tab-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => onTabClick('posts')}
        >
          게시물
        </button>
        <button
          className={`tab-nav-item ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => onTabClick('likes')}
        >
          좋아요
        </button>
      </div>
    </Row>
  );
};

export default TabNavigation;
