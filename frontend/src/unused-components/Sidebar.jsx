import React, { useState, useEffect } from 'react'

const Sidebar = ({ pageIndex, setPageIndex, pageNames }) => {
    // UI states
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 791);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 791);

    // Called when size of page changes
    const handleResize = () => {
        if (window.innerWidth <= 791) {
            setIsMobile(true);
            setIsSidebarOpen(false);
        } else {
            setIsMobile(false);
            setIsSidebarOpen(true);
        }
    };

    // Toggles sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    // Runs when the element loads
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // cleanup function
    }, []); // Runs whenever these change

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <h1>Draft Stars</h1>
                {pageNames.map((name, index) => {
                    return (
                        <p 
                            className={`sidebar-page-selector ${index == pageIndex ? 'active' : ''}`} 
                            onClick={() => setPageIndex(index)}
                            key={index}
                        >
                            {name}
                        </p>
                    );
                })}
            </div>
            <div className={'empty-space-for-sidebar' + (isSidebarOpen ? '' : ' hidden')}></div>
        </>
    )
}

export default Sidebar