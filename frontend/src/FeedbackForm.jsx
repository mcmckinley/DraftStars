import React, { useState } from 'react'

const initialFormData = {
    email: "",
    subject: "",
    message: "",
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
      await fetch("http://localhost:8000/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( formData )
      });
      setHasSubmitted(true)
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
