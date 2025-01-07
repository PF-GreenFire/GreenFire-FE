import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getCategoriesAPI} from "../apis/categoryAPI";
import {Button} from 'react-bootstrap';


function CategoryRadio({categoryType}) {
    const { categories } = useSelector(state => state.categoryReducer);
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        dispatch(getCategoriesAPI(categoryType));
    }, [categoryType]);

    const handleClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const defaultButtonStyle = {
        backgroundColor: 'white',
        color: 'dimgray',
        border: '1px solid dimgray',
        borderRadius: '20px',
        marginRight: '10px',
        marginBottom: '10px',
    };

    const selectedButtonStyle = {
        ...defaultButtonStyle, // 기본 스타일을 상속
        backgroundColor: '#0d6efd',
        color: 'white',
        border: '2px solid #0d6efd',
    };

    return (
        <div>
            {categories && categories.map((category) => (
                <Button
                    key={category.categoryCode}
                    onClick={() => handleClick(category.categoryCode)}
                    style={selectedCategory === category.categoryCode ?
                        selectedButtonStyle : defaultButtonStyle}
                >
                    {category.categoryName}
                </Button>
            ))}
        </div>
    );
}

export default CategoryRadio;