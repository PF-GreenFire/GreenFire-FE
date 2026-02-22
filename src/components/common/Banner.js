import React, { useState, useEffect } from 'react';
import { Container, Image, Spinner } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { getBanners } from '../../apis/bannerAPI';
import { getImageUrl } from '../../utils/imageUtils';

function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackBanners = [
        { bannerCode: 'fallback-1', bannerTitle: '초록불 챌린지를 소개합니다', linkUrl: null, fallbackSrc: '/banner.png' },
        { bannerCode: 'fallback-2', bannerTitle: '초록불 챌린지', linkUrl: null, fallbackSrc: '/banner.png' },
    ];

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getBanners();
                setBanners(data);
            } catch (err) {
                console.error('배너 로드 실패:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (loading) {
        return (
            <Container className="px-0 mt-0 mb-3">
                <div style={{ width: '100%', maxWidth: '563px', margin: '0 auto', height: '257px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner animation="border" variant="success" size="sm" />
                </div>
            </Container>
        );
    }

    const displayBanners = banners.length > 0 ? banners : fallbackBanners;

    const handleBannerClick = (linkUrl) => {
        if (linkUrl) {
            window.open(linkUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Container className="px-0 mt-0 mb-3">
            <div style={{ width: '100%', maxWidth: '563px', margin: '0 auto' }}>
                <Carousel
                    interval={3000}
                    controls={false}
                    indicators={displayBanners.length > 1}
                >
                    {displayBanners.map(banner => (
                        <Carousel.Item key={banner.bannerCode}>
                            <Image
                                src={banner.fallbackSrc || getImageUrl(banner.imageUrl)}
                                alt={banner.bannerTitle}
                                style={{
                                    width: '100%',
                                    height: '257px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: banner.linkUrl ? 'pointer' : 'default'
                                }}
                                onClick={() => handleBannerClick(banner.linkUrl)}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </Container>
    );
}

export default Banner;
