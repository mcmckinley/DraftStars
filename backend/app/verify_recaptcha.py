from fastapi import FastAPI, HTTPException, Depends
import requests # for verifying captcha

from dotenv import load_dotenv
import os

recaptcha_secret_key = os.getenv("RECAPTCHA_SECRET_KEY")

# Define a function to verify the reCAPTCHA token
def verify_recaptcha(recaptcha_token: str):
    recaptcha_url = "https://www.google.com/recaptcha/api/siteverify"
    
    # Send request to Google's reCAPTCHA API
    response = requests.post(recaptcha_url, data={
        'secret': recaptcha_secret_key,
        'response': recaptcha_token
    })
    
    result = response.json()
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail="reCAPTCHA validation failed")
    
    return result