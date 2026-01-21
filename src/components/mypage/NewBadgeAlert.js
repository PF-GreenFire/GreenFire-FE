import React from 'react';

const NewBadgeAlert = () => {
  return (
    <div className="new-badge-alert">
      <div className="alert-content">
        <div className="alert-text">
          <span className="alert-title">축하해요</span>
          <span className="alert-message">새로운 배지가 생겼어요!</span>
        </div>
        <div className="alert-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path
              d="M40 10L45 25L50 15L52 30L60 20L58 35L70 30L65 42L75 40L68 50L80 52L70 58L75 65L62 63L65 72L52 68L50 78L45 68L40 75L35 68L30 78L28 68L15 72L18 63L5 65L10 58L0 52L12 50L5 42L20 30L12 35L20 20L28 30L30 15L35 25L40 10Z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            style={{ marginLeft: "-20px" }}
          >
            <circle
              cx="30"
              cy="30"
              r="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M25 30L28 33L35 26"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M20 15Q25 18 30 15Q35 18 40 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M18 35C18 35 20 38 22 36"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M38 35C38 35 40 38 42 36"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NewBadgeAlert;
