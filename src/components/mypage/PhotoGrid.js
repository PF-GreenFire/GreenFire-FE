import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PhotoGrid = ({ posts }) => {
  return (
    <Container className="p-0">
      <Row className="m-0">
        {posts.map((post) => (
          <Col xs={4} key={post.id} className="p-px">
            <div className="relative w-full pb-[100%] overflow-hidden bg-gray-100">
              <img
                src={post.imageUrl}
                alt={`게시물 ${post.id}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PhotoGrid;
