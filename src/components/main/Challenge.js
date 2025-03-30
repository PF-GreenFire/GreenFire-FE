import React from 'react';
import { Row } from 'react-bootstrap';
import HighlightedText from "../item/title/HighlightedTitle";

const Challenge = () => {
    const challenges = [
        { id: 1, name: '플로깅', icon: '/Frame 299.png' },
        { id: 2, name: '비건식', icon: '/Frame 300.png' },
        { id: 3, name: '제로웨이스트', icon: '/Frame 301.png' },
        { id: 4, name: '동물보호', icon: '/Frame 302.png' },
        { id: 5, name: '독서모임', icon: '/Frame 303.png' },
        { id: 6, name: '봉사', icon: '/Frame 304.png' }
    ];

    return (
        <div className="mb-4" style={{ maxWidth: "563px", margin: "0 auto" }}>
            <HighlightedText
                mainText="챌린지 - 마감임박"
                subText="모집이 곧 마감됩니다! 서둘러 신청해주세요."
            />

            <div className="d-flex justify-content-between mt-3">
                {challenges.map(challenge => (
                    <div key={challenge.id} className="text-center">
                        <img
                            src={challenge.icon}
                            alt={challenge.name}
                            width="71"
                            height="71"
                        />
                        <p className="mt-2 small text-center">{challenge.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Challenge;