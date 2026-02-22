import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RiLeafLine } from "react-icons/ri";
import HighlightedText from "../item/title/HighlightedTitle";
import { getFeaturedPostsAPI } from "../../apis/feedAPI";
import { getImageUrl } from "../../utils/imageUtils";

const Feed = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const featuredPosts = useSelector((state) => state.feedReducer.featuredPosts);

    useEffect(() => {
        dispatch(getFeaturedPostsAPI(3));
    }, [dispatch]);

    const posts = featuredPosts.slice(0, 3);
    const heroPost = posts[0];
    const subPosts = posts.slice(1);

    const renderCard = (post, isHero) => (
        <div
            key={post.postCode}
            onClick={() => navigate(`/feed/${post.postCode}`)}
            className={`relative overflow-hidden shadow-card cursor-pointer group ${
                isHero ? "rounded-2xl aspect-[16/9]" : "rounded-xl aspect-[4/5]"
            }`}
        >
            {/* 이미지 or 그라디언트 폴백 */}
            {post.images?.[0] ? (
                <img
                    src={getImageUrl(post.images[0].path || post.images[0])}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600" />
            )}

            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* 콘텐츠 */}
            <div className={`absolute bottom-0 left-0 right-0 ${isHero ? "p-4" : "p-3"}`}>
                {/* 타입 뱃지 */}
                {(post.challengeTitle || post.storeName) && (
                    <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                            post.postType === "CHALLENGE"
                                ? "bg-emerald-500/80 text-white"
                                : "bg-amber-500/80 text-white"
                        }`}
                    >
                        {post.postType === "CHALLENGE" ? "🏆 챌린지" : "📍 장소"}
                    </span>
                )}

                <p className={`text-white font-medium m-0 ${
                    isHero ? "text-sm line-clamp-2 mb-2" : "text-xs line-clamp-1 mb-1.5"
                }`}>
                    {post.postContent}
                </p>

                <div className="flex items-center justify-between">
                    <span className={`text-white/80 font-medium ${isHero ? "text-xs" : "text-[11px]"}`}>
                        {post.nickname}
                    </span>
                    <div className="flex items-center gap-0.5 text-white/70">
                        <RiLeafLine size={isHero ? 13 : 11} />
                        <span className={isHero ? "text-xs" : "text-[10px]"}>
                            {post.likeCount || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mb-4" style={{ maxWidth: "563px", margin: "0 auto" }}>
            <HighlightedText
                mainText="지금 초록불은"
                subText="환경에 기여한 인기 게시물"
            />

            {posts.length > 0 ? (
                <>
                    {/* 히어로 카드 (1등) */}
                    {heroPost && renderCard(heroPost, true)}

                    {/* 서브 카드 2열 그리드 (2-3등) */}
                    {subPosts.length > 0 && (
                        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            {subPosts.map((post) => renderCard(post, false))}
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/feed')}
                            className="bg-transparent border-2 border-admin-green text-admin-green rounded-full py-2 px-6 text-sm font-semibold cursor-pointer hover:bg-admin-green hover:text-white transition-all"
                        >
                            피드 더보기
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <p className="text-sm m-0">아직 추천 피드가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
