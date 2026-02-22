import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const CATEGORY_FILTERS = [
  { id: "greenCert", label: "🌿 녹색인증 제품" },
  { id: "zeroWaste", label: "♻️ 제로웨이스트" },
];

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const LocationMap = ({ stores = [], categoryFilter, onCategoryChange, onBoundsChange }) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setCenter(DEFAULT_CENTER);
      }
    );
  }, []);

  return (
    <div className="relative w-full h-full">
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={5}
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
      </Map>

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
