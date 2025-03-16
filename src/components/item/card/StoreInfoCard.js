import React from 'react';
import { Card } from 'react-bootstrap';
import { FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StoreInfoCard = ({ store, imageUrl }) => {
    const navigate = useNavigate();

    return (
        <Card
            className="border-0 shadow-sm rounded-4"
            style={{
                width: '180px',
                cursor: 'pointer',
                overflow: 'hidden'
            }}
            onClick={() => navigate(`/store/${store.storeCode || 'default'}`)}
        >
            <Card.Img
                variant="top"
                src={imageUrl}
                style={{ height: '120px', objectFit: 'cover' }}
            />

            <Card.Body className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="h6 mb-0 text-success fw-bold">{store.name}</Card.Title>
                    <button className="btn p-0 border-0">
                        <FaRegHeart className="text-danger" />
                    </button>
                </div>
                <Card.Text className="text-muted small mb-0">
                    {store.location}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StoreInfoCard;