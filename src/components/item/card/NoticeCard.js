import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoticeCard = ({ notice }) => {
    const navigate = useNavigate();

    // 카테고리별 배지 색상
    const getBadgeStyle = (category) => {
        switch (category) {
            case 'NOTICE':
                return 'bg-green-lighter text-admin-green';
            case 'EVENT':
                return 'bg-info-light text-info';
            case 'SYSTEM':
                return 'bg-gray-100 text-gray-500';
            default:
                return 'bg-gray-100 text-gray-500';
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
        <div
            className={`bg-white rounded-2xl shadow-card mb-3 cursor-pointer ${notice.isImportant ? 'border-2 border-danger' : ''}`}
            onClick={handleClick}
        >
            <div className="p-3">
                <div className="flex items-start mb-2">
                    {/* 중요 배지 */}
                    {notice.isImportant && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-danger text-white mr-2">
                            중요
                        </span>
                    )}

                    {/* 카테고리 배지 */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${getBadgeStyle(notice.noticeCategory)}`}>
                        {getCategoryName(notice.noticeCategory)}
                    </span>

                    {/* 읽지 않음 표시 */}
                    {!notice.isViewed && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-light text-warning mr-2">
                            NEW
                        </span>
                    )}
                </div>

                {/* 제목 */}
                <h6
                    className={`text-base mb-2 overflow-hidden text-ellipsis whitespace-nowrap ${notice.isImportant ? 'font-bold' : 'font-semibold'}`}
                >
                    {notice.noticeTitle}
                </h6>

                {/* 메타 정보 */}
                <div className="flex justify-between items-center text-gray-500 text-sm">
                    <span>{formatDate(notice.createdAt)}</span>
                    <div className="flex items-center">
                        <FaEye className="mr-1" />
                        <span>{notice.viewCount}</span>
                    </div>
                </div>

                {/* 첨부파일 표시 */}
                {notice.hasAttachments && (
                    <div className="mt-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-200">
                            📎 첨부파일
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeCard;
