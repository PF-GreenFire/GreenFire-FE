import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaCalendar, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getNoticeDetail } from '../../apis/noticeAPI';

const NoticePreviewModal = ({ show, onHide, noticeCode }) => {
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (show && noticeCode) {
            fetchNoticePreview();
        }
    }, [show, noticeCode]);

    const fetchNoticePreview = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNoticeDetail(noticeCode);
            setNotice(data);
        } catch (err) {
            setError('공지사항을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToDetail = () => {
        onHide();
        navigate(`/notices/${noticeCode}`);
    };

    // 카테고리별 배지 색상
    const getBadgeVariant = (category) => {
        switch (category) {
            case 'NOTICE': return 'success';
            case 'EVENT': return 'primary';
            case 'SYSTEM': return 'secondary';
            default: return 'secondary';
        }
    };

    // 카테고리 한글명
    const getCategoryName = (category) => {
        switch (category) {
            case 'NOTICE': return '공지';
            case 'EVENT': return '이벤트';
            case 'SYSTEM': return '시스템';
            default: return category;
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">공지사항 미리보기</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-muted">로딩 중...</p>
                    </div>
                )}

                {error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                {notice && !loading && (
                    <>
                        {/* 배지 영역 */}
                        <div className="mb-3">
                            {notice.isImportant && (
                                <Badge bg="danger" className="me-2">중요</Badge>
                            )}
                            <Badge bg={getBadgeVariant(notice.noticeCategory)} className="me-2">
                                {getCategoryName(notice.noticeCategory)}
                            </Badge>
                        </div>

                        {/* 제목 */}
                        <h5 className="fw-bold mb-3">{notice.noticeTitle}</h5>

                        {/* 메타 정보 */}
                        <div className="d-flex gap-3 text-muted small mb-3 pb-3 border-bottom">
                            <div className="d-flex align-items-center">
                                <FaCalendar className="me-1" />
                                <span>{formatDate(notice.createdAt)}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <FaEye className="me-1" />
                                <span>조회 {notice.viewCount}</span>
                            </div>
                            {notice.authorName && ( 
                                <div className="d-flex align-items-center">
                                    <FaUser className="me-1" />
                                    <span>{notice.authorName}</span>
                                </div>
                            )}
                        </div>

                        {/* 본문 미리보기 (300자 제한) */}
                        <div 
                            className="mb-3"
                            style={{
                                maxHeight: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: notice.noticeContent.substring(0, 300) + '...' 
                                }}
                            />
                        </div>

                        {/* 첨부파일 표시 */}
                        {notice.attachments && notice.attachments.length > 0 && (
                            <div className="mt-3 p-2 bg-light rounded">
                                <small className="text-muted">
                                    📎 첨부파일 {notice.attachments.length}개
                                </small>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>

            <Modal.Footer className="border-0">
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
                <Button 
                    variant="success" 
                    onClick={handleGoToDetail}
                    disabled={loading || error}
                >
                    전체 내용 보기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoticePreviewModal;