import React from 'react';
import { Container, Image } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

function Banner() {
    const banners = [
        { id: 1, src: "/banner.png", alt: "초록불 챌린지를 소개합니다" },
        { id: 2, src: "/banner.png", alt: "초록불 챌린지" } // 추가 배너 이미지넣어줘야함
    ];

    return (
        <Container className="px-0 mt-0 mb-3">
            <div style={{ width: '100%', maxWidth: '563px', margin: '0 auto' }}>
                <Carousel interval={3000} controls={false} indicators={true}>
                    {banners.map(banner => (
                        <Carousel.Item key={banner.id}>
                            <Image
                                src={banner.src}
                                alt={banner.alt}
                                style={{
                                    width: '100%',
                                    height: '257px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </Container>
    );
}

export default Banner;
