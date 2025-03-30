import React from 'react';
import HighlightedText from "../item/title/HighlightedTitle";
import FeedPost from "../item/card/FeedPostCard";

const Feed = () => {
    const posts = [
        {
            id: 1,
            user: {
                name: '김초록',
                username: 'saladybest12',
                avatar: '/User_ex1.png',
                verified: true
            },
            content: '아침 일찍 일어나서 ㅇㅇ구에서 하는 환경 미화 봉사활동에 참여했어요~ 어메 구지역구 초록불 친구님들은 어떤 아침을 보내고 계신가용',
            image: '/Feed_ex1.png',
            timestamp: '2024년 10월 1일 오후 4시 22분',
            likes: 522,
            tags: ['환경보호'],
            tagIcon: '🌱'
        },
        {
            id: 2,
            user: {
                name: '맹맹이',
                username: 'mamyoung12',
                avatar: '/User_ex1.png',
                verified: true
            },
            content: '요즘 시작한 비건 식단! 오늘은 단호박으로 샐러드 만들었어요. 생각보다 맛있네요 ☺️',
            image: '/Feed_ex2.png',
            timestamp: '2024년 10월 1일 오전 10시 15분',
            likes: 347,
            tags: ['비건식단'],
            tagIcon: '🥗'
        }
    ];

    return (
        <div className="mb-4" style={{ maxWidth: "563px", margin: "0 auto" }}>
            <HighlightedText
                mainText="지금 초록불은"
            />

            {posts.map(post => (
                <FeedPost key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;