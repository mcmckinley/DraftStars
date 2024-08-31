from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import time

from .recommend_brawler import recommend_brawler 
from .model import model
from .config import *

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Numbers(BaseModel):
    blue1: int
    blue2: int
    blue3: int
    red1: int
    red2: int
    red3: int
    map: int


@app.get("/api/")
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

@app.post("/api/get_ranked_recommendations")
def get_ranked_recommendations(rm: RankedMatch):
    # print('Getting ranked recommendations')
    return {
        "result": recommend_brawler(rm.blue1, rm.blue2, rm.blue3, rm.red1, rm.red2, rm.red3, rm.map, rm.blue_picks_first, [rm.ban1, rm.ban2, rm.ban3, rm.ban4, rm.ban5, rm.ban6])
    }