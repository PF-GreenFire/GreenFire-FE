import React, { useEffect, useState, useRef } from 'react';

const LocationMapComponent = () => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);

    // Sample location data for markers (these would come from API in real app)
    const locations = [
        { id: 1, name: '녹색인증 매장 1', lat: 37.5665, lng: 126.9780, type: 'green' },
        { id: 2, name: '제로웨이스트 매장 1', lat: 37.5675, lng: 126.9790, type: 'zero' },
        { id: 3, name: '녹색인증 매장 2', lat: 37.5655, lng: 126.9770, type: 'green' },
        { id: 4, name: '제로웨이스트 매장 2', lat: 37.5685, lng: 126.9760, type: 'zero' },
        { id: 5, name: '녹색인증 매장 3', lat: 37.5645, lng: 126.9800, type: 'green' },
        { id: 6, name: '제로웨이스트 매장 3', lat: 37.5695, lng: 126.9750, type: 'zero' },
        { id: 7, name: '녹색인증 매장 4', lat: 37.5660, lng: 126.9810, type: 'green' },
        { id: 8, name: '제로웨이스트 매장 4', lat: 37.5670, lng: 126.9740, type: 'zero' },
    ];

    useEffect(() => {
        // Check if Kakao Maps script already exists
        if (window.kakao && window.kakao.maps) {
            setMapLoaded(true);
            return;
        }

        // Load Kakao Maps script
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7bf96a3a1b08489a3a500d242db76835";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => setMapLoaded(true);

        return () => {
            // Only remove if we added it
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                initializeMap(lat, lng);
            },
            (error) => {
                console.error("위치 정보를 가져오는데 실패했습니다:", error);
                // Fallback to Seoul center
                initializeMap(37.5665, 126.9780);
            }
        );
    }, [mapLoaded]);

    const initializeMap = (lat, lng) => {
        const container = mapRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 5
        };

        const map = new window.kakao.maps.Map(container, options);

        // Add current location marker (blue marker)
        const currentMarkerImage = new window.kakao.maps.MarkerImage(
            'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24c0-8.837-7.163-16-16-16z" fill="#4285F4"/>
                    <circle cx="16" cy="16" r="6" fill="white"/>
                </svg>
            `),
            new window.kakao.maps.Size(32, 40),
            { offset: new window.kakao.maps.Point(16, 40) }
        );

        new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
            map: map,
            image: currentMarkerImage
        });

        // Add markers for each location (red markers)
        locations.forEach((location) => {
            const markerImage = new window.kakao.maps.MarkerImage(
                'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
                        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.625 14 22 14 22s14-12.375 14-22c0-7.732-6.268-14-14-14z" fill="#FF5252"/>
                        <circle cx="14" cy="14" r="5" fill="white"/>
                    </svg>
                `),
                new window.kakao.maps.Size(28, 36),
                { offset: new window.kakao.maps.Point(14, 36) }
            );

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(location.lat, location.lng),
                map: map,
                image: markerImage
            });

            // Add click event to marker
            window.kakao.maps.event.addListener(marker, 'click', function() {
                // Create info window
                const iwContent = `<div style="padding:10px;font-size:12px;font-weight:bold;color:#333;">${location.name}</div>`;
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: iwContent
                });
                infowindow.open(map, marker);
            });
        });
    };

    return (
        <div
            ref={mapRef}
            style={{
                width: '100%',
                height: '450px',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        />
    );
};

export default LocationMapComponent;
