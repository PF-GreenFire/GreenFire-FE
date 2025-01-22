import React from 'react';
import PropTypes from 'prop-types';

const HighlightedText = ({ mainText, subText }) => {
    return (
        <>
            <div className="mt-5">
                <h4 className="">
                    {mainText} <span className="pb-3"></span>
                </h4>
                <p className="h6">{subText}</p>
            </div>
        </>
    );
};

HighlightedText.propTypes = {
    mainText: PropTypes.string.isRequired,
    subText: PropTypes.string.isRequired
};

export default HighlightedText;
