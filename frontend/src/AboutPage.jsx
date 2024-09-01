import React, { useState, useEffect } from 'react'
import symbols from './symbolLoader';

const AboutPage = ({ setPageIndex }) => {
    const NavigationButton = ({ text, destinationIndex }) => {
        return <div className='navigation-button' 
            onClick={() => {
                setPageIndex(destinationIndex)
            }}> 
            <p>{text}</p>
        </div>
    }

    return (
        <div className='about-page'>
            <div className='about-page-item about-page-header'>
                <NavigationButton text={'Home'} destinationIndex={0} />
                <NavigationButton text={'Engine'} destinationIndex={1} />
            </div>
            
            <h1 className='about-page-item'>About</h1>
            
            <div className='icon-row about-page-item'>
                <img src={symbols['github-mark.svg']} alt='github logo'></img>
                <img src={symbols['reddit.svg']} alt='reddit logo'></img>
            </div>

            <h2 className='about-page-item'>Created by Michael McKinley</h2>
        </div>
    )
}

export default AboutPage