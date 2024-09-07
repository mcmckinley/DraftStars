import React, { useState } from 'react'

const FeedbackForm = () => {
    return (
        <form id="feedbackForm" className='feedback-form' method="POST" action="http://localhost:8000/submit-feedback">
            
            <input type="text" id="name" name="name" placeholder="Your name" required /> 

            <input type="email" id="email" name="email" placeholder='Email' className='email-input' required />
            
            <textarea id="message" name="message" placeholder='Draft Stars is the best app ever because...' required></textarea>
        
            <button type="submit">Submit</button>
        </form>
    )
}

export default FeedbackForm