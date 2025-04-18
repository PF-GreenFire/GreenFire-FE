import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Tag } from 'antd';

const ChallengeList = ({ rows, onRowClick }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "모집중":
        return "green";
      case "진행중":
        return "blue";
      case "종료":
        return "red";
      default:
        return "gray";
    }
  };

  const getDisplayTag = (tag) => {
    if (!tag || tag.trim() === "") {
      return "일반";
    }
    return tag;
  };

  return (
    <div className="px-4 mt-4">
      {rows.map((row, index) => {
        const displayTag = getDisplayTag(row.tag);

        return (
          <Row
            key={index}
            onClick={() => onRowClick && onRowClick(row)}
            className="align-items-center py-3 border-bottom border-secondary-subtle hover-bg-light"
            style={{ cursor: 'pointer', minHeight: "80px" }}
          >
            {/* 왼쪽: 제목 + 태그 + 날짜 */}
            <Col md={8} className="text-start">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold">{row.title}</span>
                {displayTag && (
                  <Tag color="default" style={{ borderRadius: "12px" }}>
                    {displayTag}
                  </Tag>
                )}
              </div>
              <div className="text-muted small mt-1">{row.date}</div>
            </Col>

            {/* 오른쪽: status */}
            <Col md={4} className="d-flex justify-content-end align-items-center">
              {row.status && (
                <Tag
                  color={getStatusColor(row.status)}
                  style={{
                    minWidth: "80px",
                    textAlign: "center",
                    borderRadius: "12px",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                  bordered
                >
                  {row.status}
                </Tag>
              )}
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default ChallengeList;
