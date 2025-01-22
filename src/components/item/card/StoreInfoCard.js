import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaRegHeart, FaCartPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StoreInfoCard = ({ store, imageUrl }) => {
    const navigate = useNavigate();

    return (
        <Card style={{ width: '14rem', height: '20rem', cursor: 'pointer' }}
            onClick={() => navigate(`/store/${store.storeCode || 'default'}`)}>
            
            <Card.Img 
                variant="top" 
                src={imageUrl} 
                style={{ objectFit: 'cover', height: '10rem' }} 
            />
            
            <Card.Body>
                <Card.Title className="fw-bolder">{store.name}</Card.Title>
                <Card.Text className="mb-0">
                    {store.location}
                </Card.Text>
                <Card.Text className="fs-6 fw-lighter" style={{ letterSpacing: '0.1em' }}>
                    {store.memo}
                </Card.Text>

                <div className="d-flex justify-content-between mt-3">
                    <Button variant="outline-danger" className="btn-sm">
                        <FaRegHeart />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default StoreInfoCard;
