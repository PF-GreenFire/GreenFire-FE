import React, { useState, useEffect } from 'react';
import { Container, Badge, Button, Spinner, Alert, Card, Collapse } from 'react-bootstrap';
import { FaEye, FaCalendar, FaUser, FaDownload, FaShare, FaChevronLeft, FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoticeDetail, getRelatedNotices, incrementNoticeView, getAttachmentDownloadUrl, deleteNotice } from '../../apis/noticeAPI';
import { useAuth } from '../../hooks/useAuth';
import AppBar from '../../components/common/AppBar';


const NoticeDetail = () => {
    const { noticeCode } = useParams();
    const navigate = useNavigate();

    const { user, role } = useAuth();
    const userCode = user?.userId || null;

    const [notice, setNotice] = useState(null);
    const [relatedNotices, setRelatedNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRelated, setShowRelated] = useState(false);

    // 공지사항 상세 조회
    useEffect(() => {
        if (noticeCode) {
            fetchNoticeDetail();
            fetchRelatedNotices();
        }
    }, [noticeCode, userCode]);

    const fetchNoticeDetail = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getNoticeDetail(noticeCode, userCode);
            setNotice(data);

            // 조회수 증가 (최초 조회 시)
            if (userCode && !data.isViewedByCurrentUser) {
                await incrementNoticeView(noticeCode, userCode);
            }
        } catch (err) {
            setError('공지사항을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedNotices = async () => {
        try {
            const data = await getRelatedNotices(noticeCode, 5);
            setRelatedNotices(data);
        } catch (err) {
            console.error('관련 공지사항 조회 실패:', err);
        }
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

    // 파일 크기 포맷팅
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // 공유하기
    const handleShare = () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: notice.noticeTitle,
                url: shareUrl
            });
        } else {
            // 클립보드에 복사
            navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다.');
        }
    };

    // 관련 공지사항 클릭
    const handleRelatedNoticeClick = (code) => {
        navigate(`/notices/${code}`);
    };

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ maxWidth: '600px' }}>
                <Spinner animation="border" variant="success" />
                <p className="mt-3 text-muted">로딩 중...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ maxWidth: '600px', padding: '20px 15px' }}>
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={() => navigate('/notices')}>
                    목록으로
                </Button>
            </Container>
        );
    }

    if (!notice) return null;

    return (
        <>
        <Container style={{ maxWidth: '600px', marginBottom: '120px', padding: '20px 15px' }}>
            {/* 상단 앱바(뒤로 / 제목) */}
            <div
                style={{
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 10,
                }}
                >
                <Button
                    variant="link"
                    className="p-0"
                    style={{ color: '#222', textDecoration: 'none' }}
                    onClick={() => navigate('/notices')}
                >
                    <FaChevronLeft />
                </Button>

                <div style={{ fontWeight: 700, fontSize: '16px' }}>공지사항</div>

                {/* ✅ 수정/삭제 (ADMIN 전용) */}
                {role === 'ADMIN' && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: '#1E9E57', textDecoration: 'none' }}
                      onClick={() => navigate(`/notices/${noticeCode}/edit`)}
                      title="수정"
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: '#DC3545', textDecoration: 'none' }}
                      onClick={async () => {
                        const ok = window.confirm('정말 삭제할까요? 삭제 후 복구할 수 없습니다.');
                        if (!ok) return;
                        try {
                          await deleteNotice(noticeCode);
                          alert('삭제되었습니다.');
                          navigate('/notices');
                        } catch (e) {
                          console.error(e);
                          alert('삭제에 실패했습니다.');
                        }
                      }}
                      title="삭제"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
            </div>

            {/* 본문 카드 */}
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
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
                    <h4 className="fw-bold mb-3">{notice.noticeTitle}</h4>

                    {/* 메타 정보 */}
                    <div className="d-flex flex-wrap gap-3 text-muted small mb-4 pb-3 border-bottom">
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

                    {/* 이벤트 기간 */}
                    {notice.noticeCategory === 'EVENT' && notice.startDate && notice.endDate && (
                        <Alert variant="info" className="mb-4">
                            <strong>이벤트 기간:</strong> {formatDate(notice.startDate)} ~ {formatDate(notice.endDate)}
                        </Alert>
                    )}

                    {/* 본문 내용 */}
                    <div 
                        className="notice-content mb-4"
                        dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
                    />

                    {/* 첨부파일 */}
                    {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mt-4 p-3 bg-light rounded">
                            <h6 className="fw-bold mb-3">📎 첨부파일</h6>
                            {notice.attachments.map((attachment) => (
                                <div 
                                    key={attachment.attachmentCode}
                                    className="d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded"
                                >
                                    <div>
                                        <div className="fw-medium">{attachment.originName}</div>
                                        <small className="text-muted">
                                            {formatFileSize(attachment.fileSize)} · 다운로드 {attachment.downloadCount}회
                                        </small>
                                    </div>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        href={getAttachmentDownloadUrl(attachment.attachmentCode)}
                                        target="_blank"
                                    >
                                        <FaDownload />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 공유하기 */}
                    <div className="text-center mt-4 pt-3 border-top">
                        <Button 
                            variant="outline-success"
                            size="sm"
                            onClick={handleShare}
                        >
                            <FaShare className="me-1" /> 공유하기
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* 이전/다음 공지사항 */}
            {(notice.prevNotice || notice.nextNotice) && (
                <Card className="border-0 shadow-sm rounded-4 mt-3">
                    <Card.Body className="p-3">
                        {notice.prevNotice && (
                            <div 
                                className="d-flex justify-content-between align-items-center py-2 border-bottom cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRelatedNoticeClick(notice.prevNotice.noticeCode)}
                            >
                                <small className="text-muted">이전</small>
                                <span className="text-truncate ms-2">{notice.prevNotice.noticeTitle}</span>
                            </div>
                        )}
                        {notice.nextNotice && (
                            <div 
                                className="d-flex justify-content-between align-items-center py-2 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRelatedNoticeClick(notice.nextNotice.noticeCode)}
                            >
                                <small className="text-muted">다음</small>
                                <span className="text-truncate ms-2">{notice.nextNotice.noticeTitle}</span>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* 관련 공지사항 */}
            {relatedNotices.length > 0 && (
                <Card className="border-0 shadow-sm rounded-4 mt-3">
                    <Card.Body className="p-3">
                        <div 
                            className="d-flex justify-content-between align-items-center cursor-pointer"
                            onClick={() => setShowRelated(!showRelated)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h6 className="fw-bold mb-0">관련 공지사항</h6>
                            {showRelated ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        <Collapse in={showRelated}>
                            <div className="mt-3">
                                {relatedNotices.map((related) => (
                                    <div
                                        key={related.noticeCode}
                                        className="d-flex justify-content-between align-items-center py-2 border-bottom cursor-pointer"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRelatedNoticeClick(related.noticeCode)}
                                    >
                                        <span className="text-truncate">{related.noticeTitle}</span>
                                        <small className="text-muted ms-2">
                                            {new Date(related.createdAt).toLocaleDateString('ko-KR')}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    </Card.Body>
                </Card>
            )}
        </Container>
        <AppBar />
        </>
    );
};

export default NoticeDetail;