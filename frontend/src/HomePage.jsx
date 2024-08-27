import React, { useState, useEffect } from 'react'
import { brawlers } from './data.js'
import icons from './iconLoader.js'

const HomePage = () => {

    function getRandomImage() {
        const randomID = Math.floor(Math.random() * brawlers.length)
        return brawlers[randomID].imgUrl
    }

    const [currentImage, setCurrentImage] = useState(getRandomImage())

    useEffect(() => {
        const loop = setInterval(() => {
            setCurrentImage(getRandomImage());
        }, 2000);

        return () => clearInterval(loop);
    }, []);

    return (
        <img className='pulsing-brawler-headshot' src={icons[currentImage]} />
    )
}

export default HomePage