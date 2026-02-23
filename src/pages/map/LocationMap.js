import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { MdMyLocation } from "react-icons/md";

const CATEGORY_FILTERS = [
  { id: "greenCert", label: "🌿 녹색인증 제품" },
  { id: "zeroWaste", label: "♻️ 제로웨이스트" },
];

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const LocationMap = ({ stores = [], categoryFilter, onCategoryChange, onBoundsChange }) => {
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
      }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    onBoundsChange?.({
      sw: { lat: bounds.getSouthWest().getLat(), lng: bounds.getSouthWest().getLng() },
      ne: { lat: bounds.getNorthEast().getLat(), lng: bounds.getNorthEast().getLng() },
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
      }
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
            sw: { lat: bounds.getSouthWest().getLat(), lng: bounds.getSouthWest().getLng() },
            ne: { lat: bounds.getNorthEast().getLat(), lng: bounds.getNorthEast().getLng() },
          });
        }}
      >
        {stores.map((store) => (
          <MapMarker
            key={store.storeCode}
            position={{ lat: store.lat, lng: store.lng }}
            title={store.name}
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
        className="absolute bottom-4 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        title="내 위치"
      >
        <MdMyLocation className="text-xl text-gray-600" />
      </button>

      {/* 카테고리 필터 버튼 오버레이 */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              onCategoryChange(categoryFilter === cat.id ? null : cat.id)
            }
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-colors
              ${
                categoryFilter === cat.id
                  ? "bg-green-primary text-white border-green-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-primary hover:text-green-primary"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationMap;
