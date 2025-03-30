import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { FaHeart, FaEllipsisV } from 'react-icons/fa';

const FeedPostCard = ({ post }) => {
    return (
        <Card className="mb-4 rounded-4 shadow-sm overflow-hidden">
            {/* 헤더 - 사용자 정보 */}
            <Card.Header className="bg-white d-flex justify-content-between align-items-center border-0 py-3">
                <div className="d-flex align-items-center">
                    <Image
                        src={post.user.avatar}
                        roundedCircle
                        width="40"
                        height="40"
                        className="me-2"
                    />
                    <div>
                        <div className="d-flex align-items-center">
                            <span className="fw-bold me-1">{post.user.name}</span>
                            {post.user.verified && <img src="/mail.png" alt="mail" width="12" height="12" style={{ objectFit: 'contain' }} className="mb-1" />}
                        </div>
                        <small className="text-muted">@{post.user.username}</small>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill me-2"
                        style={{ fontSize: '0.8rem', padding: '0.1rem 0.8rem' }}
                    >
                        팔로우 <img src="/PersonAdd.png" alt="추가" width="12" height="12" style={{ objectFit: 'contain' }} className="ms-1" />
                    </Button>
                    <Button variant="link" className="text-muted p-0">
                        <FaEllipsisV />
                    </Button>
                </div>
            </Card.Header>

            {/* 본문 - 이미지와 텍스트 */}
            <Card.Body className="px-3 py-2">
                <Image
                    src={post.image}
                    fluid
                    className="rounded-3 w-100 mb-2"
                />
                <p className="mb-2">{post.content}</p>

                {/* 태그 */}
                {post.tags && post.tags.length > 0 && (
                    <div className="d-flex mt-2 mb-1">
                        {post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-light text-muted rounded-pill px-2 py-1 me-2 small"
                            >
                {tag} {index === 0 && post.tagIcon}
              </span>
                        ))}
                    </div>
                )}
            </Card.Body>

            {/* 푸터 - 날짜와 좋아요 */}
            <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center py-2">
                <small className="text-muted">{post.timestamp}</small>
                <div>
                    <Button variant="link" className="text-danger p-1">
                        <FaHeart /> <small>{post.likes}</small>
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default FeedPostCard;