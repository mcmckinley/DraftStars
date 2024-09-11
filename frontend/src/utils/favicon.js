import symbols from '../utils/symbolLoader';

export const updateFavicon = (darkMode) => {
    const favicon = document.getElementById('favicon');

    if (darkMode) {
        favicon.href = symbols['favicon-dark.png'];
        console.log('updating favicon to dark')
    } else {
        favicon.href = symbols['favicon-light.png'];
        console.log('updating favicon to light')
    }
}

// updateFavicon();

export default updateFavicon
