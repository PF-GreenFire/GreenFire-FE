import React, { useState, useRef, useEffect, useCallback } from "react";
import { IoIosSearch } from "react-icons/io";
import LocationMap from "./LocationMap";
import NearbyStoreCard from "../../components/item/card/NearbyStoreCard";

// 임시 데이터
const MOCK_STORES = [
  {
    storeCode: "1",
    name: "초록밥",
    category: "식식",
    address: "서울시 강남구",
    description: "초록밥은 'H' 다운 비건을 목표로 식물성 재료로 빵을 만들고 있습니다!",
    imageUrl: "https://picsum.photos/80/80?random=1",
    tags: ["🌿 녹색인증 제품"],
    lat: 37.5172,
    lng: 127.0473,
  },
  {
    storeCode: "2",
    name: "초로바",
    category: "카페",
    address: "서울시 서초구",
    description: "친환경 원두와 텀블러를 사용하는 제로웨이스트 카페입니다.",
    imageUrl: "https://picsum.photos/80/80?random=2",
    tags: ["♻️ 제로웨이스트"],
    lat: 37.4837,
    lng: 127.0324,
  },
  {
    storeCode: "3",
    name: "에코마켓",
    category: "마트",
    address: "서울시 마포구",
    description: "포장 없는 친환경 식재료를 판매합니다.",
    imageUrl: "https://picsum.photos/80/80?random=3",
    tags: ["🌿 녹색인증 제품", "♻️ 제로웨이스트"],
    lat: 37.5568,
    lng: 126.9246,
  },
];

const CATEGORY_TAG_MAP = {
  greenCert: "🌿 녹색인증 제품",
  zeroWaste: "♻️ 제로웨이스트",
};

const APPBAR_HEIGHT = 60;
const PEEK_HEIGHT = 80;
const FULL_TOP = 56;
const FLICK_THRESHOLD = 50;
const CLICK_THRESHOLD = 5;

const NearbyMain = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [sheetPosition, setSheetPosition] = useState("peek");
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startY: 0, startTranslate: 0 });

  const getSnapPoints = useCallback(() => {
    const vh = window.innerHeight;
    return {
      peek: vh - APPBAR_HEIGHT - PEEK_HEIGHT,
      half: vh * 0.5,
      full: FULL_TOP,
    };
  }, []);

  // 초기 위치 설정
  useEffect(() => {
    const snaps = getSnapPoints();
    setTranslateY(snaps.peek);
  }, [getSnapPoints]);

  // 윈도우 리사이즈 대응
  useEffect(() => {
    const handleResize = () => {
      const snaps = getSnapPoints();
      setTranslateY(snaps[sheetPosition]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sheetPosition, getSnapPoints]);

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      dragState.current = {
        startY: touch.clientY,
        startTranslate: translateY,
      };
      setIsDragging(true);
    },
    [translateY]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaY = touch.clientY - dragState.current.startY;
      const newTranslateY = dragState.current.startTranslate + deltaY;
      const snaps = getSnapPoints();
      const clamped = Math.max(snaps.full, Math.min(snaps.peek, newTranslateY));
      setTranslateY(clamped);
    },
    [isDragging, getSnapPoints]
  );

  const snapTo = useCallback(
    (position) => {
      const snaps = getSnapPoints();
      setTranslateY(snaps[position]);
      setSheetPosition(position);
    },
    [getSnapPoints]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    const totalDrag = Math.abs(translateY - dragState.current.startTranslate);

    // 드래그 거리가 작으면 클릭으로 처리
    if (totalDrag < CLICK_THRESHOLD) {
      snapTo(sheetPosition === "peek" ? "half" : "peek");
      return;
    }

    const snaps = getSnapPoints();
    const snapValues = [
      { key: "full", value: snaps.full },
      { key: "half", value: snaps.half },
      { key: "peek", value: snaps.peek },
    ];

    // 가장 가까운 스냅 포인트 찾기
    let nearest = snapValues[0];
    for (const sv of snapValues) {
      if (Math.abs(translateY - sv.value) < Math.abs(translateY - nearest.value)) {
        nearest = sv;
      }
    }

    // 플릭 감지: 빠르게 스와이프하면 다음 스냅으로 이동
    const velocity = translateY - dragState.current.startTranslate;
    if (Math.abs(velocity) > FLICK_THRESHOLD) {
      const currentIndex = snapValues.findIndex((s) => s.key === nearest.key);
      if (velocity < 0 && currentIndex > 0) {
        nearest = snapValues[currentIndex - 1]; // 위로 플릭 → 확장
      } else if (velocity > 0 && currentIndex < snapValues.length - 1) {
        nearest = snapValues[currentIndex + 1]; // 아래로 플릭 → 축소
      }
    }

    snapTo(nearest.key);
  }, [translateY, sheetPosition, getSnapPoints, snapTo]);

  // 마우스 이벤트 (데스크톱 테스트용)
  const handleMouseDown = useCallback(
    (e) => {
      dragState.current = {
        startY: e.clientY,
        startTranslate: translateY,
      };
      setIsDragging(true);
    },
    [translateY]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const deltaY = e.clientY - dragState.current.startY;
      const newTranslateY = dragState.current.startTranslate + deltaY;
      const snaps = getSnapPoints();
      const clamped = Math.max(snaps.full, Math.min(snaps.peek, newTranslateY));
      setTranslateY(clamped);
    };
    const handleMouseUp = () => {
      handleTouchEnd();
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getSnapPoints, handleTouchEnd]);

  // 검색/카테고리 필터 (지도 마커용)
  const searchFilteredStores = MOCK_STORES.filter((store) => {
    const matchesSearch =
      !searchQuery ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !categoryFilter ||
      store.tags.includes(CATEGORY_TAG_MAP[categoryFilter]);

    return matchesSearch && matchesCategory;
  });

  // 검색/카테고리 + bounds 필터 (바텀시트 목록용)
  const visibleStores = searchFilteredStores.filter((store) => {
    if (!mapBounds) return true;
    return (
      store.lat >= mapBounds.sw.lat &&
      store.lat <= mapBounds.ne.lat &&
      store.lng >= mapBounds.sw.lng &&
      store.lng <= mapBounds.ne.lng
    );
  });

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* 페이지 타이틀 */}
      <div className="text-center pt-2 pb-2">
        <h2 className="text-[22px] font-bold text-green-primary mb-1">
          내 주변 초록불
        </h2>
        <p className="text-[13px] text-gray-500">
          주변의 초록불 지킴이들을 찾아보세요!
        </p>
      </div>

      {/* 검색창 */}
      <div className="px-4 pb-3">
        <div className="flex items-center border border-green-primary rounded-full px-4 py-2 bg-white gap-2">
          <input
            type="text"
            placeholder="장소, 이름, 분야 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none text-sm focus:outline-none placeholder:text-gray-400"
          />
          <IoIosSearch className="text-xl text-green-primary flex-shrink-0" />
        </div>
      </div>

      {/* 지도 — 남은 공간 전부 채움 */}
      <div className="-mx-[15px] flex-1 overflow-hidden">
        <LocationMap
          stores={searchFilteredStores}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onBoundsChange={setMapBounds}
        />
      </div>

      {/* 바텀시트 */}
      <div
        className="fixed left-0 right-0 bg-white rounded-t-2xl"
        style={{
          top: 0,
          height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
          transform: `translateY(${translateY}px)`,
          transition: isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          zIndex: 500,
          maxWidth: "563px",
          margin: "0 auto",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* 드래그 핸들 */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
          <p className="text-xs text-gray-400 mt-1.5">
            {visibleStores.length}개의 초록불 매장
          </p>
        </div>

        {/* 스크롤 가능한 가게 목록 */}
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 52px)" }}
        >
          {visibleStores.length > 0 ? (
            visibleStores.map((store) => (
              <NearbyStoreCard key={store.storeCode} store={store} />
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-[15px]">조건에 맞는 장소가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
   </div>
  );
};

export default NearbyMain;
