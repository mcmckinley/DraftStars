import React, { useState, useEffect } from 'react'
import { brawlers } from './data.js'
import icons from './iconLoader.js'

const HomePage = ({ setPageIndex }) => {

    function getRandomImage() {
        const randomID = Math.floor(Math.random() * brawlers.length)
        return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    useEffect(() => {
        const loop = setInterval(() => {
            setCurrentImage(getRandomImage());
        }, 4000);

        return () => clearInterval(loop);
    }, []);

    const NavigationButton = ({ text, destinationIndex }) => {
        return <div className='navigation-button' 
            onClick={() => {
                setPageIndex(destinationIndex)
            }}> 
            <p>{text}</p>
        </div>
    }

    return (
        <>
            <img className='home-screen-background-image pulsing-brawler-headshot' src={icons[currentImage]} />
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