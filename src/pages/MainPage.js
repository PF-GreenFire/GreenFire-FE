import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import StoreInfoCard from "../components/item/card/StoreInfoCard";
import { useNavigate } from 'react-router-dom';
import Banner from "../components/common/Banner";
import HighlightedText from "../components/item/title/HighlightedTitle";
import Challenge from "../components/main/Challenge";
import Feed from "../components/main/Feed";
import LocationMap from "./map/LocationMap";
import { getAllStoresAPI, getStoreCategoriesAPI } from "../apis/storeAPI";

const MainPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stores: storeList, storeCategories } = useSelector((s) => s.storeReducer);

    useEffect(() => {
        dispatch(getAllStoresAPI());
        dispatch(getStoreCategoriesAPI());
    }, [dispatch]);

    // 인기장소: 좋아요 카운트 기준 정렬 (likeCount는 BE 응답에 없을 수 있어 안전 fallback)
    const popularStores = (storeList || [])
        .slice()
        .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 6);

    return (
        <>
            <div style={{ marginTop: "-30px" }}>
                <Banner />
            </div>

            <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
                {/* 인기 장소 */}
                <div className="mt-5" style={{ maxWidth: "563px", margin: "0 auto" }}>
                    <HighlightedText
                        mainText="인기장소"
                        subText="이번 달 가장 방문이 많았던 장소"
                    />

                    {popularStores.length === 0 ? (
                        <p className="text-center text-muted small py-3 mb-0">
                            아직 등록된 장소가 없습니다.
                        </p>
                    ) : (
                        <div className="d-flex gap-3 overflow-auto pb-3">
                            {popularStores.map((store) => (
                                <StoreInfoCard
                                    key={store.storeCode}
                                    store={{
                                        name: store.storeName,
                                        location: store.address,
                                        memo: store.address,
                                        storeCode: store.storeCode,
                                    }}
                                    imageUrl={store.imageCode ? `${process.env.REACT_APP_API_URL}/location/store-image/${store.imageCode}` : "/store_ex1.png"}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 내 주변 초록불 */}
                <div className="mt-5 mb-5" style={{ maxWidth: "563px", margin: "40px auto", height: 320 }}>
                    <HighlightedText
                        mainText="내 주변 초록불"
                        subText="근처의 환경 지킴이들을 찾아보세요."
                    />

                    <div style={{ height: 240, borderRadius: 12, overflow: 'hidden', marginTop: 8 }}>
                        <LocationMap
                            stores={storeList || []}
                            categories={storeCategories || []}
                            categoryFilter={null}
                            onCategoryChange={() => {}}
                            onBoundsChange={() => {}}
                            onMarkerClick={(code) => navigate(`/store/${code}`)}
                            sheetPosition="full"
                        />
                    </div>
                </div>

                {/* 챌린지 - 마감임박 */}
                <div style={{ maxWidth: "563px", margin: "40px auto" }}>
                    <Challenge showCards />
                </div>

                {/* 지금 초록불은 */}
                <div style={{ maxWidth: "563px", margin: "40px auto" }}>
                    <Feed />
                </div>
            </Container>
        </>
    )
}

export default MainPage;