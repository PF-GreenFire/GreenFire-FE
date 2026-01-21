import React from 'react';

const ScrapbookCategoryTabs = ({ categories, currentCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-tab ${currentCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ScrapbookCategoryTabs;
