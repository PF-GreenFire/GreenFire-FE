import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { MdMyLocation } from "react-icons/md";

const CATEGORY_EMOJI = {
  "1": "🌿",
  "2": "♻️",
};

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const LocationMap = ({
  stores = [],
  categories = [],
  categoryFilter,
  onCategoryChange,
  onBoundsChange,
  onMarkerClick,
  externalCenter,
}) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [myLocation, setMyLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(loc);
        setMyLocation(loc);
      },
      () => {
        setCenter(DEFAULT_CENTER);
      },
    );
  }, []);

  // 외부에서 전달된 좌표로 지도 이동
  useEffect(() => {
    if (externalCenter) {
      setCenter(externalCenter);
    }
  }, [externalCenter]);

  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    onBoundsChange?.({
      sw: {
        lat: bounds.getSouthWest().getLat(),
        lng: bounds.getSouthWest().getLng(),
      },
      ne: {
        lat: bounds.getNorthEast().getLat(),
        lng: bounds.getNorthEast().getLng(),
      },
    });
  }, [center]);

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyLocation(loc);
        setCenter(loc);
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      },
    );
  };

  return (
    <div className="relative w-full h-full">
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={5}
        ref={mapRef}
        onBoundsChanged={(map) => {
          const bounds = map.getBounds();
          onBoundsChange?.({
            sw: {
              lat: bounds.getSouthWest().getLat(),
              lng: bounds.getSouthWest().getLng(),
            },
            ne: {
              lat: bounds.getNorthEast().getLat(),
              lng: bounds.getNorthEast().getLng(),
            },
          });
        }}
      >
        {stores.map((store) => (
          <MapMarker
            key={store.storeCode}
            position={{ lat: store.latitude, lng: store.longitude }}
            title={store.storeName}
            onClick={() => onMarkerClick?.(store.storeCode)}
          />
        ))}

        {/* 내 위치 마커 (파란 점) */}
        {myLocation && (
          <CustomOverlayMap position={myLocation} zIndex={10}>
            <div className="flex items-center justify-center">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "rgba(66, 133, 244, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: "#4285F4",
                    border: "2.5px solid white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>
          </CustomOverlayMap>
        )}
      </Map>

      {/* 내 위치 버튼 */}
      <button
        onClick={handleMyLocation}
        className="absolute bottom-24 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        style={{ zIndex: 501 }}
        title="내 위치"
      >
        <MdMyLocation className="text-xl text-gray-600" />
      </button>

      {/* 카테고리 필터 버튼 오버레이 */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {categories.map((category) => (
          <button
            key={category.categoryCode}
            onClick={() =>
              onCategoryChange(
                categoryFilter === category.categoryCode
                  ? null
                  : category.categoryCode,
              )
            }
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-colors
              ${
                categoryFilter === category.categoryCode
                  ? "bg-green-primary text-white border-green-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-primary hover:text-green-primary"
              }`}
          >
            {CATEGORY_EMOJI[String(category.categoryCode)]} {category.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationMap;
