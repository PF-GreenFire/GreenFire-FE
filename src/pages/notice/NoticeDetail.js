import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert, Card, Collapse } from 'react-bootstrap';
import { FaEye, FaUser, FaDownload, FaShare, FaChevronLeft, FaChevronDown, FaChevronUp, FaEdit, FaTrash, FaPaperclip, FaRegClock } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoticeDetail, getRelatedNotices, incrementNoticeView, deleteNotice } from '../../apis/noticeAPI';
import { useAuth } from '../../hooks/useAuth';
import AppBar from '../../components/common/AppBar';

const API_URL = process.env.REACT_APP_API_URL;

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

    useEffect(() => {
        if (noticeCode) {
            fetchNoticeDetail();
            fetchRelatedNotices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticeCode, userCode]);

    const fetchNoticeDetail = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getNoticeDetail(noticeCode, userCode);
            setNotice(data);

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

    // 이미지 URL 생성 (정적 파일 - 인증 불필요)
    const getImageUrl = (path) => `${API_URL}/uploads/${path}`;

    const isImageFile = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

    const getCategoryStyle = (category) => {
        switch (category) {
            case 'EVENT': return { bg: '#FFF4E5', color: '#F57C00' };
            case 'SYSTEM': return { bg: '#E3F2FD', color: '#1976D2' };
            default: return { bg: '#E8F5E9', color: '#1E9E57' };
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'NOTICE': return '공지';
            case 'EVENT': return '이벤트';
            case 'SYSTEM': return '시스템';
            default: return category;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeDate = (dateString) => {
        const d = new Date(dateString);
        const now = new Date();
        const diff = now - d;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days === 1) return '어제';
        if (days < 7) return `${days}일 전`;

        return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleShare = () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({ title: notice.noticeTitle, url: shareUrl });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('링크가 복사되었습니다.');
        }
    };

    const handleRelatedNoticeClick = (code) => {
        navigate(`/notices/${code}`);
    };

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ maxWidth: '600px' }}>
                <Spinner animation="border" variant="success" size="sm" />
                <p className="mt-3 text-muted" style={{ fontSize: '14px' }}>불러오는 중...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ maxWidth: '600px', padding: '20px 15px' }}>
                <Alert variant="danger" style={{ fontSize: '14px', borderRadius: '16px' }}>{error}</Alert>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate('/notices')}
                    style={{ borderRadius: '20px' }}
                >
                    목록으로
                </Button>
            </Container>
        );
    }

    if (!notice) return null;

    // images 배열에서 이미지/파일 분리
    const allImages = notice.images || [];
    const imageFiles = allImages.filter(img => isImageFile(img.originName));
    const nonImageFiles = allImages.filter(img => !isImageFile(img.originName));
    const catStyle = getCategoryStyle(notice.noticeCategory);

    return (
        <>
        <Container style={{ maxWidth: '600px', marginBottom: '120px', padding: '0', background: '#F8F9FA', minHeight: '100vh' }}>
            {/* 헤더 */}
            <div
                style={{
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 10,
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <Button
                    variant="link"
                    className="p-0"
                    style={{ color: '#222', textDecoration: 'none' }}
                    onClick={() => navigate('/notices')}
                >
                    <FaChevronLeft size={18} />
                </Button>

                <div style={{ fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>공지사항</div>

                {role === 'ADMIN' ? (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: '#1E9E57', textDecoration: 'none' }}
                      onClick={() => navigate(`/notices/${noticeCode}/edit`)}
                    >
                      <FaEdit size={15} />
                    </Button>
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: '#DC3545', textDecoration: 'none' }}
                      onClick={async () => {
                        if (!window.confirm('정말 삭제할까요?')) return;
                        try {
                          await deleteNotice(noticeCode);
                          alert('삭제되었습니다.');
                          navigate('/notices');
                        } catch (e) {
                          console.error(e);
                          alert('삭제에 실패했습니다.');
                        }
                      }}
                    >
                      <FaTrash size={14} />
                    </Button>
                  </div>
                ) : <div style={{ width: 18 }} />}
            </div>

            <div style={{ padding: '20px' }}>
                {/* 본문 카드 */}
                <Card className="border-0" style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                    <Card.Body style={{ padding: '24px 20px' }}>
                        {/* 배지 */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            <span style={{
                                background: catStyle.bg,
                                color: catStyle.color,
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}>
                                {getCategoryName(notice.noticeCategory)}
                            </span>
                            {notice.isImportant && (
                                <span style={{
                                    background: '#FFEBEE',
                                    color: '#DC3545',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                }}>
                                    중요
                                </span>
                            )}
                        </div>

                        {/* 제목 */}
                        <h5 style={{
                            fontWeight: 700,
                            color: '#111',
                            marginBottom: '16px',
                            lineHeight: 1.5,
                            fontSize: '20px',
                            letterSpacing: '-0.3px',
                        }}>
                            {notice.noticeTitle}
                        </h5>

                        {/* 메타 정보 */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '16px',
                            fontSize: '13px',
                            color: '#999',
                            marginBottom: '24px',
                            paddingBottom: '18px',
                            borderBottom: '1px solid #F0F0F0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaRegClock size={12} />
                                <span>{formatRelativeDate(notice.createdAt)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaEye size={12} />
                                <span>조회 {notice.viewCount}</span>
                            </div>
                            {notice.authorName && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaUser size={12} />
                                    <span>{notice.authorName}</span>
                                </div>
                            )}
                        </div>

                        {/* 이벤트 기간 */}
                        {notice.noticeCategory === 'EVENT' && notice.startDate && notice.endDate && (
                            <div style={{
                                background: 'linear-gradient(135deg, #EDF7FF 0%, #E3F2FD 100%)',
                                borderRadius: '14px',
                                padding: '14px 18px',
                                marginBottom: '24px',
                                fontSize: '13px',
                                color: '#1976D2',
                                border: '1px solid rgba(25, 118, 210, 0.1)',
                            }}>
                                <div style={{ fontWeight: 700, marginBottom: '6px' }}>이벤트 기간</div>
                                <div style={{ color: '#1565C0' }}>
                                    {formatDate(notice.startDate)} ~ {formatDate(notice.endDate)}
                                </div>
                            </div>
                        )}

                        {/* 본문 */}
                        <div
                            className="notice-content"
                            style={{
                                fontSize: '15px',
                                lineHeight: 1.85,
                                color: '#333',
                                marginBottom: '28px',
                                wordBreak: 'keep-all',
                            }}
                            dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
                        />

                        {/* 이미지 첨부파일 (본문 아래) */}
                        {imageFiles.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                {imageFiles.map((img) => (
                                    <div
                                        key={img.imageCode}
                                        style={{
                                            background: '#F8F8F8',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(img.path)}
                                            alt={img.originName}
                                            style={{
                                                width: '100%',
                                                display: 'block',
                                                borderRadius: '12px',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 비이미지 첨부파일 */}
                        {nonImageFiles.length > 0 && (
                            <div style={{
                                background: '#FAFAFA',
                                borderRadius: '16px',
                                padding: '16px 18px',
                                marginBottom: '24px',
                                border: '1px solid #F0F0F0',
                            }}>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: '#555',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    <FaPaperclip size={12} />
                                    <span>첨부파일 ({nonImageFiles.length})</span>
                                </div>
                                {nonImageFiles.map((file) => (
                                    <div
                                        key={file.imageCode}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 14px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            marginBottom: '8px',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#333',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>{file.originName}</div>
                                        </div>
                                        <a
                                            href={getImageUrl(file.path)}
                                            download={file.originName}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                color: '#1E9E57',
                                                marginLeft: '12px',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <FaDownload size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 공유 */}
                        <div style={{
                            textAlign: 'center',
                            paddingTop: '18px',
                            borderTop: '1px solid #F0F0F0',
                        }}>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={handleShare}
                                style={{
                                    borderRadius: '24px',
                                    padding: '8px 24px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    border: '1.5px solid #1E9E57',
                                }}
                            >
                                <FaShare className="me-1" size={12} /> 공유하기
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* 이전/다음 */}
                {(notice.prevNotice || notice.nextNotice) && (
                    <Card className="border-0 mt-3" style={{
                        borderRadius: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    }}>
                        <Card.Body style={{ padding: '4px 16px' }}>
                            {notice.prevNotice && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '14px 0',
                                        borderBottom: notice.nextNotice ? '1px solid #F0F0F0' : 'none',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRelatedNoticeClick(notice.prevNotice.noticeCode)}
                                >
                                    <small style={{
                                        color: '#1E9E57',
                                        fontSize: '11px',
                                        flexShrink: 0,
                                        fontWeight: 600,
                                        background: '#E8F5E9',
                                        padding: '2px 8px',
                                        borderRadius: '8px',
                                    }}>이전</small>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#444',
                                        textAlign: 'right',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '12px',
                                    }}>
                                        {notice.prevNotice.noticeTitle}
                                    </span>
                                </div>
                            )}
                            {notice.nextNotice && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '14px 0',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRelatedNoticeClick(notice.nextNotice.noticeCode)}
                                >
                                    <small style={{
                                        color: '#1E9E57',
                                        fontSize: '11px',
                                        flexShrink: 0,
                                        fontWeight: 600,
                                        background: '#E8F5E9',
                                        padding: '2px 8px',
                                        borderRadius: '8px',
                                    }}>다음</small>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#444',
                                        textAlign: 'right',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '12px',
                                    }}>
                                        {notice.nextNotice.noticeTitle}
                                    </span>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )}

                {/* 관련 공지사항 */}
                {relatedNotices.length > 0 && (
                    <Card className="border-0 mt-3" style={{
                        borderRadius: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    }}>
                        <Card.Body style={{ padding: '16px 18px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setShowRelated(!showRelated)}
                            >
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>관련 공지사항</span>
                                {showRelated ? <FaChevronUp size={12} color="#999" /> : <FaChevronDown size={12} color="#999" />}
                            </div>

                            <Collapse in={showRelated}>
                                <div style={{ marginTop: '12px' }}>
                                    {relatedNotices.map((related, idx) => {
                                        const relCatStyle = getCategoryStyle(related.noticeCategory);
                                        return (
                                            <div
                                                key={related.noticeCode}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '12px 0',
                                                    borderBottom: idx < relatedNotices.length - 1 ? '1px solid #F5F5F5' : 'none',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleRelatedNoticeClick(related.noticeCode)}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    minWidth: 0,
                                                    flex: 1,
                                                }}>
                                                    <span style={{
                                                        background: relCatStyle.bg,
                                                        color: relCatStyle.color,
                                                        padding: '2px 8px',
                                                        borderRadius: '8px',
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        flexShrink: 0,
                                                    }}>
                                                        {getCategoryName(related.noticeCategory)}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#444',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {related.noticeTitle}
                                                    </span>
                                                </div>
                                                <small style={{
                                                    color: '#bbb',
                                                    fontSize: '11px',
                                                    marginLeft: '12px',
                                                    flexShrink: 0,
                                                }}>
                                                    {formatRelativeDate(related.createdAt)}
                                                </small>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Collapse>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </Container>
        <AppBar />
        </>
    );
};

export default NoticeDetail;
