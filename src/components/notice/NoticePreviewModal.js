import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
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
    const getBadgeStyle = (category) => {
        switch (category) {
            case 'NOTICE': return 'bg-green-lighter text-admin-green';
            case 'EVENT': return 'bg-info-light text-info';
            case 'SYSTEM': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-500';
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
                <Modal.Title className="font-bold">공지사항 미리보기</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-gray-500">로딩 중...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {notice && !loading && (
                    <>
                        {/* 배지 영역 */}
                        <div className="mb-3">
                            {notice.isImportant && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-danger text-white mr-2">중요</span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${getBadgeStyle(notice.noticeCategory)}`}>
                                {getCategoryName(notice.noticeCategory)}
                            </span>
                        </div>

                        {/* 제목 */}
                        <h5 className="font-bold mb-3">{notice.noticeTitle}</h5>

                        {/* 메타 정보 */}
                        <div className="flex gap-3 text-gray-500 text-sm mb-3 pb-3 border-b border-gray-200">
                            <div className="flex items-center">
                                <FaCalendar className="mr-1" />
                                <span>{formatDate(notice.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <FaEye className="mr-1" />
                                <span>조회 {notice.viewCount}</span>
                            </div>
                            {notice.authorName && (
                                <div className="flex items-center">
                                    <FaUser className="mr-1" />
                                    <span>{notice.authorName}</span>
                                </div>
                            )}
                        </div>

                        {/* 본문 미리보기 (300자 제한) */}
                        <div className="mb-3 max-h-[200px] overflow-hidden text-ellipsis">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: notice.noticeContent.substring(0, 300) + '...'
                                }}
                            />
                        </div>

                        {/* 첨부파일 표시 */}
                        {notice.attachments && notice.attachments.length > 0 && (
                            <div className="mt-3 p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-500">
                                    📎 첨부파일 {notice.attachments.length}개
                                </span>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>

            <Modal.Footer className="border-0">
                <button
                    onClick={onHide}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                    닫기
                </button>
                <button
                    onClick={handleGoToDetail}
                    disabled={loading || error}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-admin-green text-white hover:bg-admin-green-dark transition-all disabled:opacity-50"
                >
                    전체 내용 보기
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoticePreviewModal;
