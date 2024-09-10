import React, { useState, useEffect } from 'react'
import symbols from './utils/symbolLoader';
import Footer from './Footer';
import Header from './Header';
import FeedbackForm from './FeedbackForm';

const FeedbackPage = ({ pageIndex, setPageIndex }) => {

    // When the window size is changed, update the left padding size
    const [leftPaddingSize, setLeftPaddingSize] = useState(window.innerWidth > 820 ? Math.floor((window.innerWidth - 800)) / 2 : 10)

    const handleResize = () => {
        if (window.innerWidth > 820) {
            setLeftPaddingSize(Math.floor((window.innerWidth - 800) / 2))
        } else {
            setLeftPaddingSize(10)
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize); // cleanup function
    }, []); // Runs whenever these change

    

    const NavigationButton = ({ text, destinationIndex }) => {
        return <div className='navigation-button' 
            onClick={() => {
                setPageIndex(destinationIndex)
            }}> 
            <p>{text}</p>
        </div>
    }

    const socials = [
        {
            'url': 'https://github.com/mcmckinley/DraftStars',
            'icon': symbols['github-mark.svg'],
            'alt': 'github logo'
        },
        {
            'url': 'https://www.reddit.com/user/mmiichael',
            'icon': symbols['reddit.svg'],
            'alt': 'reddit logo'
        }
    ]

    return <>
        
        <div className='about-page'>
            <div className='about-page-header'>
                <Header pageIndex={pageIndex} setPageIndex={setPageIndex} />    
            </div>
            
            <h1>Feedback</h1>
            
            <FeedbackForm />

        </div>

        <Footer />
    </>
}

export default FeedbackPage