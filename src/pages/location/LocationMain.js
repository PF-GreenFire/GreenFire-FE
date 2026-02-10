import React, { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch, FaBars, FaBookmark } from 'react-icons/fa';
import LocationMapComponent from './LocationMapComponent';
import './LocationMain.css';

const LocationMain = () => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterClick = (filter) => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    return (
        <div className="location-main">
            {/* Content Area */}
            <Container style={{ maxWidth: "600px", padding: "20px 15px 100px 15px" }}>
                {/* Title Section */}
                <div className="text-center mb-3">
                    <h3 className="fw-bold text-success mb-2">내 주변 초록불</h3>
                    <p className="text-muted" style={{ fontSize: '14px' }}>
                        주변의 초록불 지킴이들을 찾아보세요!
                    </p>
                </div>

                {/* Search Bar */}
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="장소, 이름, 분야 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: '2px solid #28a745',
                            borderRadius: '25px 0 0 25px',
                            padding: '10px 20px'
                        }}
                    />
                    <Button
                        variant="success"
                        style={{
                            borderRadius: '0 25px 25px 0',
                            padding: '0 20px'
                        }}
                    >
                        <FaSearch />
                    </Button>
                </InputGroup>

                {/* Filter Buttons */}
                <div className="d-flex gap-2 mb-3">
                    <Button
                        variant={activeFilter === 'green' ? 'success' : 'outline-success'}
                        className="rounded-pill"
                        onClick={() => handleFilterClick('green')}
                        style={{
                            fontSize: '14px',
                            padding: '8px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>🌱</span>
                        녹색인증 제품
                    </Button>
                    <Button
                        variant={activeFilter === 'zero' ? 'success' : 'outline-success'}
                        className="rounded-pill"
                        onClick={() => handleFilterClick('zero')}
                        style={{
                            fontSize: '14px',
                            padding: '8px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>♻️</span>
                        제로웨이스트
                    </Button>
                </div>

                {/* Map Section */}
                <div style={{ position: 'relative' }}>
                    {/* Bookmark Icon */}
                    <Button
                        variant="light"
                        className="position-absolute"
                        style={{
                            top: '15px',
                            left: '15px',
                            zIndex: 1000,
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <FaBookmark size={18} color="#666" />
                    </Button>

                    {/* Map Component */}
                    <LocationMapComponent />

                    {/* View List Button */}
                    <div className="text-center" style={{ marginTop: '-30px', marginBottom: '20px', position: 'relative', zIndex: 1000 }}>
                        <Button
                            variant="light"
                            className="rounded-pill shadow"
                            style={{
                                padding: '12px 30px',
                                fontSize: '15px',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FaBars />
                            목록 보기
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LocationMain;
