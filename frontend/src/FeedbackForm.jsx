import React, { useState } from 'react'
import { executeRecaptcha } from "./utils/recaptcha";

const initialFormData = {
    email: "",
    subject: "",
    message: "",
    recaptchaToken: ""
};

const FeedbackForm = () => {

    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isAwaitingServerResponse, setIsAwaitingServerResponse] = useState(false)

    const [formData, setFormData] = useState(initialFormData)

    const handleInputChange = (e) => {
        if (isAwaitingServerResponse) {
          return;
        }
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

   const handleSubmit = async (e) => {
      setIsAwaitingServerResponse(true) 
      e.preventDefault();
      try {
        const token = await executeRecaptcha("submit_form");

        const dataToSubmit = {
          ...formData,
          ['recaptchaToken']: token
        };
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
        {!hasSubmitted ? (
          <>
            <p>Please report any bugs you find and share any suggestions you may have.</p>
            <form id="feedbackForm" className='feedback-form' method="POST" onSubmit={handleSubmit}>

              <input 
                value={formData.email}
                onChange={handleInputChange}
                type="email" 
                id="email" 
                name="email"
                placeholder='Your Email'
                className='email-input'
                required 
              />

              <input 
                value={formData.subject}
                onChange={handleInputChange}
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
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

              
              { isAwaitingServerResponse ? (
                <button className="submit-button-awaiting-submission">Submitting</button>
              ) : (
                <button type="submit">Submit</button>
              )}
            </form>
          </>
        ) : (
          <p>Thank you for your feedback. I will get back to you if needed.</p>
        )}
      </>
    )
}

export default FeedbackForm
