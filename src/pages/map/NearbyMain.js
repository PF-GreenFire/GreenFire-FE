import React, { useState } from "react";
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

const NearbyMain = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [isListOpen, setIsListOpen] = useState(false);

  const filteredStores = MOCK_STORES.filter((store) => {
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

  return (
    <div className="flex flex-col">
      {/* 페이지 타이틀 */}
      <div className="text-center pt-5 pb-3">
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

      {/* 지도 — Container 패딩(15px)을 상쇄해 full-width로 표시 */}
      <div className="-mx-[15px] overflow-hidden">
        <LocationMap
          stores={filteredStores}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      </div>

      {/* 목록보기 / 목록 접기 토글 버튼 */}
      <div className="relative z-10 flex justify-center py-4">
        <button
          onClick={() => setIsListOpen((prev) => !prev)}
          className="flex items-center gap-2 px-8 py-2.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          {isListOpen ? "▼ 목록 접기" : "≡ 목록보기"}
        </button>
      </div>

      {/* 장소 목록 패널 */}
      {isListOpen && (
        <div className="pb-24">
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <NearbyStoreCard key={store.storeCode} store={store} />
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-[15px]">조건에 맞는 장소가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyMain;
