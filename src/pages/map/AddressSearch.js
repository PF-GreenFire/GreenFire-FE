import React, { useState, useEffect } from "react";

const AddressSearch = () => {
    const [address, setAddress] = useState("");
    const [zonecode, setZonecode] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleClick = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                setZonecode(data.zonecode);
                setAddress(data.address);
            },
        }).open();
    };

    return (
        <div>
            <button onClick={handleClick}>우편번호 찾기</button>
            {zonecode && <p>우편번호: {zonecode}</p>}
            {address && <p>주소: {address}</p>}
            상세주소 <input type="text" />
        </div>
    );
};

export default AddressSearch;
