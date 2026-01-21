import React from 'react';
import { Modal } from 'react-bootstrap';

const BadgeDetailModal = ({
  show,
  onClose,
  badge,
  username,
  onDownload,
  badgeCardRef
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="badge-modal"
    >
      <div className="modal-overlay">
        <div className="modal-actions">
          <button className="modal-action-btn" onClick={onDownload}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10L12 15L17 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15V3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="modal-action-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {badge && (
          <div className="badge-detail-card" ref={badgeCardRef}>
            <div className="badge-card-date">
              {badge.unlockedDate}
            </div>
            <div className="badge-card-image">
              <img src={badge.image} alt={badge.name} />
            </div>
            <div className="badge-card-category">
              {badge.category}
            </div>
            <h3 className="badge-card-title">{badge.name}</h3>
            <p className="badge-card-description">
              {badge.description}
            </p>
            <div className="badge-card-footer">
              <span className="badge-card-username">{username}</span>
            </div>
            <p className="badge-card-message">
              전체 사용자의 6%만이 가지고 있는 배지예요.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BadgeDetailModal;
