import React, { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch, FaBars, FaBookmark } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
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
            {/* Green Header */}
            <div className="location-header">
                <Container style={{ maxWidth: "600px" }}>
                    <div className="d-flex justify-content-between align-items-center py-3">
                        <div className="d-flex align-items-center">
                            <div className="logo-icon me-2">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.07-.24C6.2 20.25 7.5 19 9 19c1.66 0 3 1.34 3 3 0 .24-.04.47-.12.69l2-.68C14.5 17.5 16 13 16 9c0-1.1-.9-2-2-2s-2 .9-2 2c0 3-3 3-3 5 0-2-3-2-3-5 0-1.1-.9-2-2-2s-2 .9-2 2c0 4 1.5 8.5 2.12 10.69l2 .68C6.04 22.47 6 22.24 6 22c0-1.66 1.34-3 3-3 1.5 0 2.8 1.25 3.22 2.76l.07.24 1.89-.66C12.1 16.17 10 10 1 8V6c9 2 11.5 9.13 13.18 14.34l1.89-.66C14.5 13.5 12 6 3 4v2c9 2 11.5 9.13 13.18 14.34z"/>
                                </svg>
                            </div>
                            <h5 className="fw-bold text-white mb-0">GREEN FIRE</h5>
                        </div>
                        <div className="d-flex">
                            <Button variant="link" className="text-white p-1">
                                <FaSearch size={20} />
                            </Button>
                            <Button variant="link" className="text-white p-1">
                                <IoMdMenu size={25} />
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Content Area */}
            <Container style={{ maxWidth: "600px", padding: "20px 15px" }}>
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
                    <div className="text-center" style={{ marginTop: '-30px', position: 'relative', zIndex: 1000 }}>
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
