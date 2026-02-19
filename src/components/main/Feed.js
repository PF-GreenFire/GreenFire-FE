import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import HighlightedText from "../item/title/HighlightedTitle";
import FeedCard from "../feed/FeedCard";
import { getFeaturedPostsAPI } from "../../apis/feedAPI";

const Feed = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const featuredPosts = useSelector((state) => state.feedReducer.featuredPosts);

    useEffect(() => {
        dispatch(getFeaturedPostsAPI(3));
    }, [dispatch]);

    return (
        <div className="mb-4" style={{ maxWidth: "563px", margin: "0 auto" }}>
            <HighlightedText mainText="지금 초록불은" />

            {featuredPosts.length > 0 ? (
                <>
                    {featuredPosts.slice(0, 3).map((post) => (
                        <FeedCard key={post.postCode} post={post} />
                    ))}
                    <div className="text-center mt-2">
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
