import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  MapMarker,
  CustomOverlayMap,
  MarkerClusterer,
} from "react-kakao-maps-sdk";
import { MdMyLocation } from "react-icons/md";
import CATEGORY_EMOJI from "../../constants/categoryConstants";
import { haversineKm, formatDistance } from "../../utils/geoUtils";

const LOCATION_STORAGE_KEY = "lastKnownLocation";
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

// 카테고리별 마커 색상 (BE storeCategory int에 매핑)
const MARKER_COLOR_BY_CATEGORY = {
  1: "#16a34a", // green-600
  2: "#0ea5e9", // sky-500
  3: "#f59e0b", // amber-500
  4: "#ec4899", // pink-500
};
const DEFAULT_MARKER_COLOR = "#16a34a";

const makeMarkerImage = (color) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='38' viewBox='0 0 28 38'><path d='M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24c0-7.7-6.3-14-14-14z' fill='${color}'/><circle cx='14' cy='14' r='5.5' fill='white'/></svg>`;
  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    size: { width: 28, height: 38 },
    options: { offset: { x: 14, y: 38 } },
  };
};

const getSavedLocation = () => {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveLocation = (loc) => {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
  } catch {}
};

const LocationMap = ({
  stores = [],
  categories = [],
  categoryFilter,
  onCategoryChange,
  onBoundsChange,
  onMarkerClick,
  externalCenter,
  sheetPosition,
  selectedStoreCode,
}) => {
  const selectedStore = stores.find((s) => s.storeCode === selectedStoreCode);
  const cachedLocation = getSavedLocation();
  const [center, setCenter] = useState(cachedLocation || DEFAULT_CENTER);
  const [myLocation, setMyLocation] = useState(cachedLocation);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(loc);
        setMyLocation(loc);
        saveLocation(loc);
      },
      () => {
        if (!cachedLocation) setCenter(DEFAULT_CENTER);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
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

  const moveTo = (loc) => {
    setMyLocation(loc);
    setCenter(loc);
    saveLocation(loc);
    if (mapRef.current) {
      const kakao = window.kakao;
      mapRef.current.setCenter(new kakao.maps.LatLng(loc.lat, loc.lng));
    }
  };

  const handleMyLocation = () => {
    // 이미 위치를 알고 있으면 즉시 이동하고, 백그라운드에서 위치 갱신
    if (myLocation) {
      moveTo(myLocation);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        moveTo(loc);
      },
      () => {
        if (!myLocation) {
          alert("위치 정보를 가져올 수 없습니다.");
        }
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
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
        <MarkerClusterer
          averageCenter={true}
          minLevel={6}
          calculator={[10, 30, 100]}
          styles={[
            {
              width: "44px",
              height: "44px",
              background: "rgba(22, 163, 74, 0.85)",
              borderRadius: "22px",
              color: "#fff",
              textAlign: "center",
              lineHeight: "44px",
              fontWeight: "bold",
              fontSize: "13px",
            },
            {
              width: "52px",
              height: "52px",
              background: "rgba(22, 163, 74, 0.9)",
              borderRadius: "26px",
              color: "#fff",
              textAlign: "center",
              lineHeight: "52px",
              fontWeight: "bold",
              fontSize: "14px",
            },
            {
              width: "60px",
              height: "60px",
              background: "rgba(22, 163, 74, 0.95)",
              borderRadius: "30px",
              color: "#fff",
              textAlign: "center",
              lineHeight: "60px",
              fontWeight: "bold",
              fontSize: "15px",
            },
          ]}
        >
          {stores.map((store) => (
            <MapMarker
              key={store.storeCode}
              position={{ lat: store.latitude, lng: store.longitude }}
              title={store.storeName}
              image={makeMarkerImage(
                MARKER_COLOR_BY_CATEGORY[store.storeCategory] ||
                  DEFAULT_MARKER_COLOR
              )}
              onClick={() => onMarkerClick?.(store.storeCode)}
            />
          ))}
        </MarkerClusterer>

        {/* 선택된 매장 InfoWindow */}
        {selectedStore && (
          <CustomOverlayMap
            position={{
              lat: selectedStore.latitude,
              lng: selectedStore.longitude,
            }}
            yAnchor={1.5}
            zIndex={20}
          >
            <div className="bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-200 whitespace-nowrap min-w-[140px]">
              <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[180px]">
                {selectedStore.storeName}
              </p>
              {myLocation && (
                <p className="text-[11px] text-green-700 mt-0.5">
                  📍{" "}
                  {formatDistance(
                    haversineKm(
                      myLocation.lat,
                      myLocation.lng,
                      selectedStore.latitude,
                      selectedStore.longitude
                    )
                  )}
                </p>
              )}
            </div>
          </CustomOverlayMap>
        )}

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

      {/* 내 위치 버튼 — 바텀시트가 올라오면 숨김 */}
      {sheetPosition === "peek" && (
        <button
          onClick={handleMyLocation}
          className="absolute bottom-24 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          style={{ zIndex: 501 }}
          title="내 위치"
        >
          <MdMyLocation className="text-xl text-gray-600" />
        </button>
      )}

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
