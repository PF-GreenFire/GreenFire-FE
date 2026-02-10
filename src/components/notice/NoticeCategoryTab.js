import React from 'react';
import { Nav } from 'react-bootstrap';

const NoticeCategoryTab = ({ activeCategory, onCategoryChange }) => {
    const categories = [
        { key: 'ALL', label: '모두' },
        { key: 'NOTICE', label: '공지사항' },
        { key: 'EVENT', label: '이벤트' }
    ];

    return (
        <Nav 
            variant="pills" 
            className="mb-3 justify-content-start"
            style={{ gap: '8px' }}
        >
            {categories.map((category) => (
                <Nav.Item key={category.key}>
                    <Nav.Link
                        active={activeCategory === category.key}
                        onClick={() => onCategoryChange(category.key)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            padding: '8px 20px',
                            fontSize: '14px',
                            fontWeight: activeCategory === category.key ? 'bold' : 'normal',
                            backgroundColor: activeCategory === category.key ? '#198754' : '#f8f9fa',
                            color: activeCategory === category.key ? '#fff' : '#495057',
                            border: 'none'
                        }}
                    >
                        {category.label}
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
};

export default NoticeCategoryTab;