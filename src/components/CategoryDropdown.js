import React, {useEffect, useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {getCategoriesAPI} from "../apis/categoryAPI";


function CategoryDropdown({categoryType}) {
    const { categories } = useSelector(state => state.categoryReducer);
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState(null);


    useEffect(() => {
        dispatch(getCategoriesAPI(categoryType));
    }, [categoryType]);

    const handleSelectCategory = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    return (
        <div className="d-flex justify-content-center m-5">
            <Dropdown>
                <Dropdown.Toggle
                    id="dropdown-custom-components"
                    style={{
                        backgroundColor: 'white',
                        color: 'dimgray',
                        borderColor: 'dimgray',
                        borderRadius: '20px',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {
                        selectedCategory || '카테고리'
                    }
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        categories &&
                        categories.map((category, index) => (
                            <Dropdown.Item key={index}
                                           onClick={() => handleSelectCategory(category.categoryName)}>
                                {category.categoryName}
                            </Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );

}

export default CategoryDropdown;