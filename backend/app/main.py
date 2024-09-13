from fastapi import FastAPI, Form, HTTPException, Depends

# allows backend to return an HTML document when user submits feedback.
# The html document contains a link that returns the user to the website.
from fastapi.responses import HTMLResponse 


from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import time

from .recommend_brawler import recommend_brawler 
from .model import model
from .config import *

from .send_email import send_email

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Feedback(BaseModel):
    email: str
    subject: str
    message: str

@app.post("/submit-feedback")
async def submit_feedback(feedback: Feedback):
    feedback_message = f"'Draft Stars Feedback Form Submission\nEmail: {feedback.email}\nMessage: {feedback.message}"
    send_email(feedback.subject, feedback_message)


class Numbers(BaseModel):
    blue1: int
    blue2: int
    blue3: int
    red1: int
    red2: int
    red3: int
    map: int


@app.get("/")
def read_root():
    return {"message": "hey"}


class RankedMatch(BaseModel):
    blue1: int
    blue2: int
    blue3: int
    red1: int
    red2: int
    red3: int
    map: int
    blue_picks_first: bool
    ban1: Optional[int]
    ban2: Optional[int]
    ban3: Optional[int]
    ban4: Optional[int]
    ban5: Optional[int]
    ban6: Optional[int]

@app.post("/get_ranked_recommendations")
def get_ranked_recommendations(rm: RankedMatch):
    return {
        "result": recommend_brawler(rm.blue1, rm.blue2, rm.blue3, rm.red1, rm.red2, rm.red3, rm.map, rm.blue_picks_first, [rm.ban1, rm.ban2, rm.ban3, rm.ban4, rm.ban5, rm.ban6])
    }
