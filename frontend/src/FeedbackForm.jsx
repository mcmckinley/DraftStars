import React, { useState } from 'react'
import { executeRecaptcha } from "./utils/recaptcha";

const initialFormData = {
    name: "",
    email: "",
    message: "",
    recaptchaToken: ""
};

const FeedbackForm = () => {

    const [hasSubmitted, setHasSubmitted] = useState(false)

    const [formData, setFormData] = useState(initialFormData)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = await executeRecaptcha("submit_form");

        console.log('Got token')
        console.log(formData)
        console.log(token)
        const dataToSubmit = {
          ...formData,
          ['recaptchaToken']: token
        };
        console.log('Submitting this:')
        console.log(dataToSubmit)
        // Send the form data and token to the backend
        await fetch("https://draftstars.net/api/submit-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ ...formData, recaptchaToken: token }),
          body: JSON.stringify( dataToSubmit )
        });
        setHasSubmitted(true)
      } catch (error) {
        console.error("reCAPTCHA Error:", error);
      }
    };


    return (
      <>
        {!hasSubmitted && (
          <form id="feedbackForm" className='feedback-form' method="POST" onSubmit={handleSubmit}>
            
            <input 
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              required
            /> 

            <input 
              value={formData.email}
              onChange={handleInputChange}
              type="email" 
              id="email" 
              name="email"
              placeholder='Email'
              className='email-input'
              required 
            />
              
            <textarea 
              value={formData.message}
              onChange={handleInputChange}
              id="message" 
              name="message" 
              placeholder='Draft Stars is the best app ever because...'
              required
            />
        
            <button type="submit">Submit</button>
          </form>
        )}
      </>
    )
}

export default FeedbackForm
