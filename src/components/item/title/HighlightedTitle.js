import React from 'react';
import PropTypes from 'prop-types';

const HighlightedText = ({ mainText, subText }) => {
    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h5
                    className="fw-bold mb-0 position-relative d-inline-block"
                    style={{
                        zIndex: 1,
                        paddingRight: '8px'
                    }}
                >
                    <span
                        className="position-absolute"
                        style={{
                            backgroundColor: '#CCECBE',
                            height: '10px',
                            width: '100%',
                            bottom: 0,
                            left: 0,
                            zIndex: -1
                        }}
                    ></span>
                    {mainText}
                </h5>
                <span className="text-muted small">더보기</span>
            </div>
            {subText && <p className="text-muted small">{subText}</p>}
        </div>
    );
};

HighlightedText.propTypes = {
    mainText: PropTypes.string.isRequired,
    subText: PropTypes.string
};

HighlightedText.defaultProps = {
    subText: ''
};

export default HighlightedText;