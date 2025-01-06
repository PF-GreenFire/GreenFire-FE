import React, {useEffect} from 'react';
import { Dropdown } from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {getCategoriesAPI} from "../apis/categoryAPI";


function CategoryDropdown({categoryType}) {
    const { categories } = useSelector(state => state.categoryReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategoriesAPI(categoryType));
    }, []);

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
                    카테고리
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        categories &&
                        categories.map((category, index) => (
                            <Dropdown.Item key={index}>{category.categoryName}</Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );

}

export default CategoryDropdown;