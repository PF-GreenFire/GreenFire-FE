import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoticeCard = ({ notice }) => {
    const navigate = useNavigate();

    // 카테고리별 배지 색상
    const getBadgeVariant = (category) => {
        switch (category) {
            case 'NOTICE':
                return 'success';
            case 'EVENT':
                return 'primary';
            case 'SYSTEM':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    // 카테고리 한글명
    const getCategoryName = (category) => {
        switch (category) {
            case 'NOTICE':
                return '공지';
            case 'EVENT':
                return '이벤트';
            case 'SYSTEM':
                return '시스템';
            default:
                return category;
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const handleClick = () => {
        navigate(`/notices/${notice.noticeCode}`);
    };

    return (
        <Card
            className={`border-0 shadow-sm rounded-3 mb-3 ${notice.isImportant ? 'border-danger border-2' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={handleClick}
        >
            <Card.Body className="p-3">
                <div className="d-flex align-items-start mb-2">
                    {/* 중요 배지 */}
                    {notice.isImportant && (
                        <Badge bg="danger" className="me-2">
                            중요
                        </Badge>
                    )}
                    
                    {/* 카테고리 배지 */}
                    <Badge bg={getBadgeVariant(notice.noticeCategory)} className="me-2">
                        {getCategoryName(notice.noticeCategory)}
                    </Badge>

                    {/* 읽지 않음 표시 */}
                    {!notice.isViewed && (
                        <Badge bg="warning" text="dark" className="me-2">
                            NEW
                        </Badge>
                    )}
                </div>

                {/* 제목 */}
                <Card.Title 
                    className={`h6 mb-2 ${notice.isImportant ? 'fw-bold' : ''}`}
                    style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {notice.noticeTitle}
                </Card.Title>

                {/* 메타 정보 */}
                <div className="d-flex justify-content-between align-items-center text-muted small">
                    <span>{formatDate(notice.createdAt)}</span>
                    <div className="d-flex align-items-center">
                        <FaEye className="me-1" />
                        <span>{notice.viewCount}</span>
                    </div>
                </div>

                {/* 첨부파일 표시 */}
                {notice.hasAttachments && (
                    <div className="mt-2">
                        <Badge bg="light" text="dark" className="border">
                            📎 첨부파일
                        </Badge>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default NoticeCard;