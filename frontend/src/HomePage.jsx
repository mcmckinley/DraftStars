import React, { useState, useEffect } from 'react'
import FadingBrawlerBackground from './FadingBrawlerBackground.jsx'

const HomePage = ({ brawlerIcons, setPageIndex }) => {

    const NavigationButton = ({ text, destinationIndex }) => {
        return <div className='navigation-button homepage' 
            onClick={() => {
                setPageIndex(destinationIndex)
            }}> 
            <h3>{text}</h3>
        </div>
    }

    const [isVisible, setIsVisible] = useState(true)
    const handleVisibilityChange = () => {
        setIsVisible(!document.hidden);
    };
    
    useEffect(() => {
        setIsVisible(true);
    
        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
          window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            { isVisible && <FadingBrawlerBackground />}
            <div className='home-screen'>
                <div className='home-screen-center'>
                    <h1>Draft Stars</h1>
                    <h2>AI draft engine for Brawl Stars</h2>
                    <div className='home-screen-buttons'>
                        <NavigationButton text={'Use the Engine'} destinationIndex={1} />
                        <NavigationButton text={'About'} destinationIndex={2} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage