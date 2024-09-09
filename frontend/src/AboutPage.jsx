import React, { useState, useEffect } from 'react'
import symbols from './symbolLoader';
import Footer from './Footer';
import Header from './Header';

const AboutPage = ({ pageIndex, setPageIndex }) => {

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
            'handle': 'mcmckinley/DraftStars',
            'alt': 'github logo'
        },
        {
            'url': 'https://www.reddit.com/user/mmiichael',
            'icon': symbols['reddit.svg'],
            'handle': 'u/mmiichael',
            'alt': 'reddit logo'
    }]

    return <>
        
        <div className='about-page'
            // style={{
            //     paddingLeft: leftPaddingSize + 'px',
            //     paddingRight: '10px'
            // }}
        >
            <div className='about-page-header'>
                <Header pageIndex={pageIndex} setPageIndex={setPageIndex} />    
            </div>
            
            <h1>About</h1>
            
            <div className='social-media-image-link-row'>
                {
                    socials.map((social, index) => {
                        return (
                            <a href={social['url']} key={index}>
                                <img src={social['icon']} alt={social['alt']} className='social-link'></img>
                                <p>{social['handle']}</p>
                            </a>
                        )
                    })
                }
            </div>

            <h2>
                Description
            </h2>
            <p>
                Draft Stars is an AI-powered draft engine for Brawl Stars. Trained on over one million battles, it recommends character selections that optimize your chances of success based on unique in-game matchups.
            </p>

            <h2>
                About the game
            </h2>
            <p>
                Brawl Stars is a 3v3 mobile game where players choose from a roster of 83 unique characters, known as brawlers, to compete in matches. The brawler choices made by each player significantly impact the match's dynamics. While individual skill is important, the outcome of a game is heavily influenced by which brawlers are chosen.
                <br /><br />
                Selecting the right brawler at the right time is crucial for success. However, this can be incredibly challenging. During the picking stage of a ranked match, you have only 20 seconds to choose from the 83 characters available (minus those that have already been selected or banned). When making your choice, you must consider the brawlers your opponents have picked, what they might pick after you, your teammates’ selections, and how well your brawler synergizes with theirs. Ultimately, your pick must also be well-suited to the map in play.
            </p>

            <h2>
                About the AI model
            </h2>
            <p>
                The goal of Draft Stars is to simplify the picking stage. It considers many draft possibilities and guides you through the selection process. The AI is trained on over 1 million past battles to make informed recommendations. 
                <br /><br />
                The AI uses transformer architecture to understand how brawlers interact with one another—the same architecture used in ChatGPT to understand relationships between words.                
            </p>

            <h2>
                Developers
            </h2>
            <p>
                The frontend and part of the backend (excluding the model itself) are open for contributions. Feel free to submit a pull request on GitHub.
            </p>

        </div>

        <Footer />
    </>
}

export default AboutPage