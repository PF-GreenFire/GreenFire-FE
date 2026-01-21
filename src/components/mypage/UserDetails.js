import React from 'react';
import { Row } from 'react-bootstrap';

const UserDetails = ({ user }) => {
  return (
    <Row className="user-details-row">
      <div className="user-details">
        <div className="user-name-area">
          <span className="level-badge">LEVEL {user.level}</span>
          <h2 className="user-nickname">{user.nickname}</h2>
          <p className="user-username">{user.username}</p>
        </div>
        <div className="user-info-area">
          <div className="user-tags">
            {user.tags.map((tag, index) => (
              <span key={index} className="user-tag">{tag}</span>
            ))}
          </div>
          <p className="user-bio">{user.bio}</p>
        </div>
      </div>
    </Row>
  );
};

export default UserDetails;
