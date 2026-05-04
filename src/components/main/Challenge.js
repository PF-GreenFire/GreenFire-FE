import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HighlightedText from "../item/title/HighlightedTitle";
import { getClosingSoonChallengesAPI } from '../../apis/challengeAPI';

const Challenge = ({ showHeader = true, onIconClick, selectedCategory, showCards = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = [
        { id: 0, name: '전체보기', icon: '/mainlogo.png' },
        { id: 1, name: '플로깅', icon: '/Frame 299.png' },
        { id: 2, name: '비건식', icon: '/Frame 300.png' },
        { id: 3, name: '제로웨이스트', icon: '/Frame 301.png' },
        { id: 4, name: '동물보호', icon: '/Frame 302.png' },
        { id: 5, name: '독서모임', icon: '/Frame 303.png' },
        { id: 6, name: '봉사', icon: '/Frame 304.png' }
    ];

    const scrollRef = useRef(null);
    const scrollBy = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const [closingSoon, setClosingSoon] = useState([]);

    useEffect(() => {
        if (!showCards) return;
        let cancelled = false;
        dispatch(getClosingSoonChallengesAPI(5))
            .then((data) => {
                if (!cancelled) setClosingSoon(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setClosingSoon([]);
            });
        return () => { cancelled = true; };
    }, [dispatch, showCards]);

    const daysLeft = (endDate) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="mb-4" style={{ maxWidth: "563px", margin: "0 auto", position: 'relative' }}>
            {showHeader && (
                <HighlightedText
                    mainText="챌린지 - 마감임박"
                    subText="모집이 곧 마감됩니다! 서둘러 신청해주세요."
                />
            )}
            <div className="category-slider-wrap" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {/* 왼쪽 화살표 */}
                <button
                    type="button"
                    aria-label="왼쪽으로 이동"
                    className="category-arrow left"
                    onClick={() => scrollBy(-120)}
                    style={{
                        border: 'none',
                        background: '#e6f4ea',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
                        color: '#198754',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                        zIndex: 10
                    }}
                >
                    &#8592;
                </button>
                {/* 카테고리 바 */}
                <div
                    ref={scrollRef}
                    className="d-flex flex-nowrap gap-2 mt-3 overflow-auto pb-2 category-slider"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE/Edge
                        overflowX: 'auto',
                        flex: 1,
                        scrollBehavior: 'smooth',
                        padding: '0 16px',
                    }}
                >
                    {/* 스크롤바 숨기기 (크롬/사파리) */}
                    <style>{`
                        .d-flex::-webkit-scrollbar { display: none; }
                        .category-slider-wrap .category-arrow {
                            opacity: 0;
                            transition: opacity 0.2s;
                        }
                        .category-slider-wrap:hover .category-arrow,
                        .category-slider-wrap:focus-within .category-arrow {
                            opacity: 1;
                        }
                    `}</style>
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="text-center flex-shrink-0"
                            style={{
                                cursor: 'pointer',
                                border: selectedCategory === category.name ? '2px solid #198754' : '2px solid transparent',
                                borderRadius: '16px',
                                background: selectedCategory === category.name ? '#e6f4ea' : 'white',
                                padding: '8px 10px',
                                minWidth: '80px',
                                transition: 'border 0.2s, background 0.2s'
                            }}
                            onClick={() => onIconClick && onIconClick(category.name)}
                        >
                            {category.name === '전체보기' ? (
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#198754',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    letterSpacing: '2px',
                                    borderRadius: '50%',
                                    background: '#e6f4ea',
                                    margin: '0 auto',
                                }}>ALL</div>
                            ) : (
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    width="48"
                                    height="48"
                                    style={{ objectFit: 'contain' }}
                                />
                            )}
                            <p className="mt-2 small text-center mb-0" style={{fontWeight: selectedCategory === category.name ? 700 : 400}}>{category.name}</p>
                        </div>
                    ))}
                </div>
                {/* 오른쪽 화살표 */}
                <button
                    type="button"
                    aria-label="오른쪽으로 이동"
                    className="category-arrow right"
                    onClick={() => scrollBy(120)}
                    style={{
                        border: 'none',
                        background: '#e6f4ea',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
                        color: '#198754',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                        zIndex: 10
                    }}
                >
                    &#8594;
                </button>
            </div>

            {/* 마감 임박 챌린지 카드 (메인 페이지 전용) */}
            {showCards && (
                closingSoon.length === 0 ? (
                    <div className="text-center text-muted small py-3">
                        모집 중인 챌린지가 없습니다.
                    </div>
                ) : (
                    <div className="d-flex gap-3 overflow-auto pb-2 mt-3" style={{ scrollbarWidth: 'none' }}>
                        {closingSoon.map((c) => {
                            const d = daysLeft(c.endDate);
                            return (
                                <div
                                    key={c.challengeCode}
                                    onClick={() => navigate(`/challenges/${c.challengeCode}`)}
                                    className="flex-shrink-0"
                                    style={{
                                        width: '180px',
                                        cursor: 'pointer',
                                        background: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <div style={{
                                        height: '110px',
                                        background: c.thumbnailUrl
                                            ? `url(${c.thumbnailUrl}) center/cover`
                                            : 'linear-gradient(135deg, #34d399, #059669)',
                                        position: 'relative',
                                    }}>
                                        {d != null && (
                                            <span style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                background: 'rgba(220, 38, 38, 0.92)',
                                                color: 'white',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: 12,
                                            }}>
                                                {d <= 0 ? '오늘 마감' : `D-${d}`}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <p className="mb-1 small fw-bold text-truncate">
                                            {c.challengeTitle}
                                        </p>
                                        <p className="mb-0" style={{ fontSize: 11, color: '#6b7280' }}>
                                            정원 {c.recruitmentNum}명 · 🌱{c.xp}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
};

export default Challenge;
