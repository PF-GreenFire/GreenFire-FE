import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';

const ChallengeCardGrid = ({
  challenges,
  totalCount,
  sortBy,
  onSortChange,
  onChallengeClick,
  getSortText
}) => {
  return (
    <>
      {/* 결과 카운트 및 정렬 */}
      <div className="result-header">
        <span className="result-count">총 {totalCount}개</span>
        <Dropdown className="sort-dropdown">
          <Dropdown.Toggle className="sort-toggle">
            {getSortText()}
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={() => onSortChange('latest')}>최신 등록순</Dropdown.Item>
            <Dropdown.Item onClick={() => onSortChange('popular')}>인기순</Dropdown.Item>
            <Dropdown.Item onClick={() => onSortChange('deadline')}>마감임박순</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 챌린지 카드 그리드 */}
      <Row>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Col xs={4} key={challenge.id} className="challenge-col">
              <div
                className="challenge-card"
                onClick={() => onChallengeClick(challenge.id)}
              >
                <div className="challenge-image-wrapper">
                  <img
                    src={challenge.imageUrl || '/challenge-placeholder.png'}
                    alt={challenge.title}
                    className="challenge-image"
                  />
                </div>
                <div className="challenge-info">
                  <p className="challenge-type">{challenge.type || '기연빙'}</p>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <div className="no-challenges">
            <p>챌린지가 없습니다.</p>
          </div>
        )}
      </Row>
    </>
  );
};

export default ChallengeCardGrid;
