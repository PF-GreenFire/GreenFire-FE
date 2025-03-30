import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const LocationMap = () => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // 카카오맵 스크립트 로드
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7bf96a3a1b08489a3a500d242db76835";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => setMapLoaded(true);

        return () => document.head.removeChild(script);
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;

        // 위치 정보 가져오기
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(lat, lng),
                    level: 3
                };

                const map = new window.kakao.maps.Map(container, options);

                // 현재 위치에 마커 표시
                new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(lat, lng),
                    map: map
                });
            },
            (error) => {
                console.error("위치 정보를 가져오는데 실패했습니다:", error);
                // 실패시 서울 중심으로 표시
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                    level: 3
                };
                new window.kakao.maps.Map(container, options);
            }
        );
    }, [mapLoaded]);

    return (
        <Card className="border-0 rounded-3 shadow-sm">
            <div id="map" style={{ height: '250px', borderRadius: '0.5rem' }}></div>
        </Card>
    );
};

export default LocationMap;