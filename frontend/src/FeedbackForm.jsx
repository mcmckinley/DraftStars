import React, { useState } from 'react'

const FeedbackForm = () => {
    return (
        <form id="feedbackForm" className='feedback-form' method="POST" action="http://localhost:8000/submit-feedback">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required />
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
            
            <label for="message">Feedback:</label>
            <textarea id="message" name="message" required></textarea>
        
            <button type="submit">Submit</button>
        </form>
    )
}

export default FeedbackForm