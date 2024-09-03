import React, { useState } from 'react';

const Header = ({ pageIndex, setPageIndex }) => {
    const pages = ['Home', 'Engine', 'About'];


    return (
        <div className='header'>
            {pages.map((pageName, index) => (
                <div 
                    key={index}
                    className={(pageIndex == index ? 'navigation-button-selected' : 'navigation-button') + ' no-text-select' }
                    onClick={() => {
                        setPageIndex(index);
                    }}
                >     
                    <h3>{pageName}</h3>
                </div>
            ))}
        </div>
    );
};

export default Header;
