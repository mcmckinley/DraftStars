import React, { useState } from 'react'

const FeedbackForm = () => {
    return (
        <form id="feedbackForm" className='feedback-form' method="POST" action="http://draftstars.net/api/submit-feedback">
            {/* <label for="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="" required /> */}
            
            {/* <label for="email">Email:</label> */}
            <input type="email" id="email" name="email" placeholder='Email' className='email-input' required />
            
            <textarea id="message" name="message" placeholder='Draft Stars is the best app ever because...' required></textarea>
        
            <button type="submit">Submit</button>
        </form>
    )
}

export default FeedbackForm
