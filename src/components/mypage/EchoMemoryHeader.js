import React from 'react';
import { Row } from 'react-bootstrap';
import { IoIosArrowBack, IoIosSearch, IoMdMore } from 'react-icons/io';

const EchoMemoryHeader = ({ username, onGoBack }) => {
  return (
    <Row className="echo-header-row">
      <div className="echo-header">
        <IoIosArrowBack className="back-icon" onClick={onGoBack} />
        <h1 className="header-title">{username}</h1>
        <div className="header-right">
          <IoIosSearch className="header-icon" />
          <IoMdMore className="header-icon" />
        </div>
      </div>
    </Row>
  );
};

export default EchoMemoryHeader;
