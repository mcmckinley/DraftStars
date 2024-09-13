// src/homePage/FadingBrawlerBackground.jsx

import React, { useState, useEffect } from 'react'
import { brawlers } from '../data/brawlers.js'
import brawlerIcons from '../utils/iconLoader.js'

// Background for the Home Screen.
// See a demonstration here: https://youtu.be/1idY0gQLaIk?si=AbviS1V6sU80ytcZ

// isVisible (bool) - whether or not the page is visible. This is used 
// to keep the image switching synced with the animation.
const FadingBrawlerBackground = ({ isVisible }) => {

    function getRandomImage() {
        const randomID = Math.floor(Math.random() * brawlers.length)
        return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    const updateImage = () => {
        var randomBrawlerID = getRandomImage()
        setCurrentImage(randomBrawlerID); 
    };

    useEffect(() => {
        const faceSwapInterval = setInterval(updateImage, 4000); 
        return () => clearInterval(faceSwapInterval)
    }, [])

    return <img id='icon-background' className={'home-screen-background-image pulsing-brawler-headshot'} src={brawlerIcons[currentImage]} />   
}

export default FadingBrawlerBackground