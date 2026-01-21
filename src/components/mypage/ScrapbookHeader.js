import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';

const ScrapbookHeader = ({ onGoBack }) => {
  return (
    <div className="scrapbook-header">
      <button className="back-btn" onClick={onGoBack}>
        <FiChevronLeft size={24} />
      </button>
      <h1 className="scrapbook-title">나의 스크랩북</h1>
    </div>
  );
};

export default ScrapbookHeader;
