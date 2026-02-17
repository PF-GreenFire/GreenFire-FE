import React, { useState, useEffect } from 'react';
import { Spinner, Collapse } from 'react-bootstrap';
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
            <div className="text-center py-12 max-w-[600px] mx-auto">
                <Spinner animation="border" variant="success" size="sm" />
                <p className="mt-3 text-gray-500 text-sm">불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-[600px] mx-auto py-5 px-4">
                <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm">{error}</div>
                <button
                    className="mt-3 border-2 border-gray-400 text-gray-600 rounded-full font-semibold text-sm px-4 py-1.5 hover:bg-gray-100 transition-all"
                    onClick={() => navigate('/notices')}
                >
                    목록으로
                </button>
            </div>
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
        <div className="max-w-[600px] mx-auto mb-[120px] p-0 bg-[#F8F9FA] min-h-screen">
            {/* 헤더 */}
            <div className="h-14 flex items-center justify-between px-5 sticky top-0 bg-white z-10 border-b border-[#f0f0f0]">
                <button
                    className="p-0 text-[#222] no-underline bg-transparent border-none cursor-pointer"
                    onClick={() => navigate('/notices')}
                >
                    <FaChevronLeft size={18} />
                </button>

                <div className="font-bold text-[17px] tracking-tight">공지사항</div>

                {role === 'ADMIN' ? (
                  <div className="flex gap-3 items-center">
                    <button
                      className="p-0 text-admin-green no-underline bg-transparent border-none cursor-pointer"
                      onClick={() => navigate(`/notices/${noticeCode}/edit`)}
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      className="p-0 text-[#DC3545] no-underline bg-transparent border-none cursor-pointer"
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
                    </button>
                  </div>
                ) : <div className="w-[18px]" />}
            </div>

            <div className="p-5">
                {/* 본문 카드 */}
                <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    <div className="px-5 py-6">
                        {/* 배지 */}
                        <div className="flex gap-2 mb-3.5 flex-wrap">
                            <span
                                className="px-3 py-1 rounded-full text-[11px] font-semibold"
                                style={{ background: catStyle.bg, color: catStyle.color }}
                            >
                                {getCategoryName(notice.noticeCategory)}
                            </span>
                            {notice.isImportant && (
                                <span className="bg-danger-light text-[#DC3545] px-3 py-1 rounded-full text-[11px] font-semibold">
                                    중요
                                </span>
                            )}
                        </div>

                        {/* 제목 */}
                        <h5 className="font-bold text-[#111] mb-4 leading-relaxed text-xl tracking-tight">
                            {notice.noticeTitle}
                        </h5>

                        {/* 메타 정보 */}
                        <div className="flex flex-wrap gap-4 text-[13px] text-[#999] mb-6 pb-[18px] border-b border-[#F0F0F0]">
                            <div className="flex items-center gap-[5px]">
                                <FaRegClock size={12} />
                                <span>{formatRelativeDate(notice.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-[5px]">
                                <FaEye size={12} />
                                <span>조회 {notice.viewCount}</span>
                            </div>
                            {notice.authorName && (
                                <div className="flex items-center gap-[5px]">
                                    <FaUser size={12} />
                                    <span>{notice.authorName}</span>
                                </div>
                            )}
                        </div>

                        {/* 이벤트 기간 */}
                        {notice.noticeCategory === 'EVENT' && notice.startDate && notice.endDate && (
                            <div
                                className="rounded-[14px] px-[18px] py-3.5 mb-6 text-[13px] text-info border border-info/10"
                                style={{ background: 'linear-gradient(135deg, #EDF7FF 0%, #E3F2FD 100%)' }}
                            >
                                <div className="font-bold mb-1.5">이벤트 기간</div>
                                <div className="text-[#1565C0]">
                                    {formatDate(notice.startDate)} ~ {formatDate(notice.endDate)}
                                </div>
                            </div>
                        )}

                        {/* 본문 */}
                        <div
                            className="notice-content text-[15px] leading-[1.85] text-[#333] mb-7 break-keep"
                            dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
                        />

                        {/* 이미지 첨부파일 (본문 아래) */}
                        {imageFiles.length > 0 && (
                            <div className="mb-6">
                                {imageFiles.map((img) => (
                                    <div
                                        key={img.imageCode}
                                        className="bg-[#F8F8F8] rounded-xl overflow-hidden mb-2.5"
                                    >
                                        <img
                                            src={getImageUrl(img.path)}
                                            alt={img.originName}
                                            className="w-full block rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 비이미지 첨부파일 */}
                        {nonImageFiles.length > 0 && (
                            <div className="bg-[#FAFAFA] rounded-2xl px-[18px] py-4 mb-6 border border-[#F0F0F0]">
                                <div className="text-[13px] font-bold text-[#555] mb-3 flex items-center gap-1.5">
                                    <FaPaperclip size={12} />
                                    <span>첨부파일 ({nonImageFiles.length})</span>
                                </div>
                                {nonImageFiles.map((file) => (
                                    <div
                                        key={file.imageCode}
                                        className="flex justify-between items-center px-3.5 py-3 bg-white rounded-xl mb-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[13px] font-semibold text-[#333] overflow-hidden text-ellipsis whitespace-nowrap">
                                                {file.originName}
                                            </div>
                                        </div>
                                        <a
                                            href={getImageUrl(file.path)}
                                            download={file.originName}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-admin-green ml-3 shrink-0"
                                        >
                                            <FaDownload size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 공유 */}
                        <div className="text-center pt-[18px] border-t border-[#F0F0F0]">
                            <button
                                className="border-2 border-admin-green text-admin-green rounded-full font-semibold hover:bg-admin-green hover:text-white transition-all text-[13px] px-6 py-2"
                                onClick={handleShare}
                            >
                                <FaShare className="inline mr-1" size={12} /> 공유하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* 이전/다음 */}
                {(notice.prevNotice || notice.nextNotice) && (
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] mt-3">
                        <div className="px-4 py-1">
                            {notice.prevNotice && (
                                <div
                                    className={`flex justify-between items-center py-3.5 cursor-pointer ${notice.nextNotice ? 'border-b border-[#F0F0F0]' : ''}`}
                                    onClick={() => handleRelatedNoticeClick(notice.prevNotice.noticeCode)}
                                >
                                    <small className="text-admin-green text-[11px] shrink-0 font-semibold bg-green-lighter px-2 py-0.5 rounded-lg">이전</small>
                                    <span className="text-[13px] text-[#444] text-right overflow-hidden text-ellipsis whitespace-nowrap ml-3">
                                        {notice.prevNotice.noticeTitle}
                                    </span>
                                </div>
                            )}
                            {notice.nextNotice && (
                                <div
                                    className="flex justify-between items-center py-3.5 cursor-pointer"
                                    onClick={() => handleRelatedNoticeClick(notice.nextNotice.noticeCode)}
                                >
                                    <small className="text-admin-green text-[11px] shrink-0 font-semibold bg-green-lighter px-2 py-0.5 rounded-lg">다음</small>
                                    <span className="text-[13px] text-[#444] text-right overflow-hidden text-ellipsis whitespace-nowrap ml-3">
                                        {notice.nextNotice.noticeTitle}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 관련 공지사항 */}
                {relatedNotices.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] mt-3">
                        <div className="px-[18px] py-4">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setShowRelated(!showRelated)}
                            >
                                <span className="text-sm font-bold text-[#333]">관련 공지사항</span>
                                {showRelated ? <FaChevronUp size={12} color="#999" /> : <FaChevronDown size={12} color="#999" />}
                            </div>

                            <Collapse in={showRelated}>
                                <div className="mt-3">
                                    {relatedNotices.map((related, idx) => {
                                        const relCatStyle = getCategoryStyle(related.noticeCategory);
                                        return (
                                            <div
                                                key={related.noticeCode}
                                                className={`flex justify-between items-center py-3 cursor-pointer ${idx < relatedNotices.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}
                                                onClick={() => handleRelatedNoticeClick(related.noticeCode)}
                                            >
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span
                                                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold shrink-0"
                                                        style={{ background: relCatStyle.bg, color: relCatStyle.color }}
                                                    >
                                                        {getCategoryName(related.noticeCategory)}
                                                    </span>
                                                    <span className="text-[13px] text-[#444] overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {related.noticeTitle}
                                                    </span>
                                                </div>
                                                <small className="text-[#bbb] text-[11px] ml-3 shrink-0">
                                                    {formatRelativeDate(related.createdAt)}
                                                </small>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Collapse>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <AppBar />
        </>
    );
};

export default NoticeDetail;
