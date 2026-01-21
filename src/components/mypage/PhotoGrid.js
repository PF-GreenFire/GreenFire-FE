import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PhotoGrid = ({ posts }) => {
  return (
    <Container className="photo-grid-container">
      <Row className="photo-grid">
        {posts.map((post) => (
          <Col xs={4} key={post.id} className="photo-col">
            <div className="photo-item">
              <img
                src={post.imageUrl}
                alt={`게시물 ${post.id}`}
                className="photo-image"
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PhotoGrid;
