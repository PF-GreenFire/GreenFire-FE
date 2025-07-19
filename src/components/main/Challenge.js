import React, { useRef } from 'react';
import HighlightedText from "../item/title/HighlightedTitle";

const Challenge = ({ showHeader = true, onIconClick, selectedCategory }) => {
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
        </div>
    );
};

export default Challenge;
