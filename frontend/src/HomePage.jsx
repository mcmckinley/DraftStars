import React, { useState, useEffect } from 'react'
import { brawlers } from './data.js'

const HomePage = ({ icons, setPageIndex }) => {
    function getRandomImage() {
        const randomID = Math.floor(Math.random() * brawlers.length)
        return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    const [isFading, setIsFading] = useState(true);

    // Issue: if the page is unloaded for a while, the homepage animation / icon switching go out of 
    // sync. This happens on my Mac in Safari (potentially also due to low power mode.) 

    useEffect(() => {
        const updateImage = () => {
          setIsFading(true); 
          setTimeout(() => {
            setCurrentImage(getRandomImage()); 
          }, 4000); 
        };
    
        const intervalId = setInterval(updateImage, 4000); 
    
        return () => { 
            clearInterval(intervalId); 
            setIsFading(false);
        }
      }, [icons]);

    const NavigationButton = ({ text, destinationIndex }) => {
        return <div className='navigation-button homepage' 

            onClick={() => {
                setPageIndex(destinationIndex)
            }}> 
            <h3>{text}</h3>
        </div>
    }

    return (
        <>
            <img id='icon-background' className={'home-screen-background-image' + (isFading ? ' pulsing-brawler-headshot':'')} src={icons[currentImage]} />
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