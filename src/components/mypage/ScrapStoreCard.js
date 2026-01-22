import React from "react";
import { Card } from "react-bootstrap";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ScrapStoreCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="border-0 shadow-sm rounded-4"
      style={{
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => navigate(`/store/${item.storeCode || item.id}`)}
    >
      <Card.Img
        variant="top"
        src={item.image || "https://via.placeholder.com/300x200"}
        style={{ height: "120px", objectFit: "cover" }}
      />

      <Card.Body className="p-2">
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Card.Text className="text-muted small mb-1">
              {item.location}
            </Card.Text>
            <Card.Title
              className="h6 mb-1 text-success fw-bold"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </Card.Title>
          </div>
          <button className="btn p-0 border-0" style={{ flexShrink: 0 }}>
            <FaRegHeart className="text-danger" />
          </button>
        </div>
        {item.tags && item.tags.length > 0 && (
          <div className="d-flex gap-1 flex-wrap mt-1">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-light text-muted"
                style={{ fontSize: "10px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ScrapStoreCard;
