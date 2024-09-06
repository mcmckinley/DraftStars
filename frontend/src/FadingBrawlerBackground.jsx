import React, { useState, useEffect } from 'react'
import { brawlers } from './data.js'
import icons from './iconLoader.js'

const FadingBrawlerBackground = ({ isVisible }) => {

    function getRandomImage() {
        const randomID = Math.floor(Math.random() * brawlers.length)
        return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    const updateImage = () => {
        var randomBrawlerID = getRandomImage()
        console.log(randomBrawlerID)
        setCurrentImage(randomBrawlerID); 
    };

    useEffect(() => {
        const faceSwapInterval = setInterval(updateImage, 4000); 
        console.log('BEGINNING')
        return () => { clearInterval(faceSwapInterval); console.log('ENDING') }
    }, [])

    return <img id='icon-background' className={'home-screen-background-image pulsing-brawler-headshot'} src={icons[currentImage]} />   
}

export default FadingBrawlerBackground