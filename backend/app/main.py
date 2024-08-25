from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import time

from .recommend_brawler import recommend_brawler 

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
    return {"message": "Hello from FastAPI"}

mapsAccordingToFrontend = ["Undermine", "G.G. Mortuary", "Gem Fort", "Ahead of the Curve", "Between the Rivers", "Pinball Dreams", "Four Levels", "Sneaky Sneak", "Super Beach", "Double Locking", "Dragon Jaws", "Infinite Doom", "Center Stage", "Rustic Arcade", "Double Swoosh", "Hot Potato", "Goldarm Gulch", "Deathcap Trap", "Local Businesses", "Backyard Bowl", "Belle's Rock", "Flaring Phoenix", "Hard Lane", "Retina", "New Horizons", "Acute Angle", "Parallel Plays", "Open Business", "Coconut Cove", "Reflections", "Slayer's Paradise", "Island Hopping", "Diamond Dome", "Sneaky Fields", "Twilight Passage", "Spice Production", "Dueling Beetles", "Offside Trap", "Goalkeeper's Dream", "Hard Rock Mine", "Penalty Kick", "Last Stop", "Out in the Open", "Minecart Madness", "Open Space", "Sunny Soccer", "Deep End", "Safe Zone", "Ring of Fire", "Beach Ball", "Kaboom Canyon", "Spider Crawler", "Canal Grande", "Hideout", "Shooting Star"]
# Whenever the model is updated, this array must be updated as well 
#mapsAccordingToModel = ["Safe Zone", "Gem Fort", "Local Businesses", "Kaboom Canyon", "Slayer's Paradise", "Hard Rock Mine", "Open Business", "Four Levels", "Minecart Madness", "Acute Angle", "Deathcap Trap", "Ring of Fire", "Ahead of the Curve", "Double Swoosh", "Dragon Jaws", "Hard Lane", "Offside Trap", "Spider Crawler", "Penalty Kick", "Sunny Soccer", "Super Beach", "Beach Ball", "Double Locking", "Diamond Dome", "Island Hopping", "Undermine", "Backyard Bowl", "Spice Production", "G.G. Mortuary", "Dueling Beetles", "Goalkeeper's Dream", "Deep End", "Twilight Passage", "Sneaky Fields", "Coconut Cove", "Reflections", "Last Stop", "Sneaky Sneak", "Infinite Doom", "New Horizons", "Retina", "Center Stage", "Parallel Plays", "Out in the Open", "Rustic Arcade", "Flaring Phoenix", "Pinball Dreams", "Goldarm Gulch", "Between the Rivers", "Open Space", "Belle's Rock", "Hot Potato"]
mapsAccordingToModel = ["Deathcap Trap", "Kaboom Canyon", "Sneaky Sneak", "Retina", "Minecart Madness", "Hard Lane", "Backyard Bowl", "Sunny Soccer", "Deep End", "Slayer's Paradise", "Center Stage", "Hot Potato", "Coconut Cove", "Open Business", "Spice Production", "Gem Fort", "Local Businesses", "Between the Rivers", "Four Levels", "Beach Ball", "Goalkeeper's Dream", "Acute Angle", "Offside Trap", "Island Hopping", "G.G. Mortuary", "Penalty Kick", "Dueling Beetles", "Diamond Dome", "Hard Rock Mine", "Open Space", "Rustic Arcade", "Undermine", "Ring of Fire", "Twilight Passage", "New Horizons", "Double Swoosh", "Pinball Dreams", "Double Locking", "Spider Crawler", "Safe Zone", "Infinite Doom", "Flaring Phoenix", "Reflections", "Out in the Open", "Super Beach", "Belle's Rock", "Sneaky Fields", "Dragon Jaws", "Goldarm Gulch", "Last Stop", "Parallel Plays", "Ahead of the Curve", "Canal Grande", "Hideout", "Shooting Star"]


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
    print('map:', mapsAccordingToModel[rm.map])
    return {
        "result": recommend_brawler(rm.blue1, rm.blue2, rm.blue3, rm.red1, rm.red2, rm.red3, rm.map, rm.blue_picks_first, [rm.ban1, rm.ban2, rm.ban3, rm.ban4, rm.ban5, rm.ban6])
    }



# @app.post("/predict_normal")
# def predict(numbers: Numbers):
#     print('Received:', Numbers)
#     brawlers = ['SHELLY', 'COLT', 'BULL', 'BROCK', 'RICO', 'SPIKE', 'BARLEY', 'JESSIE', 'NITA', 'DYNAMIKE', 'EL PRIMO', 'MORTIS', 'CROW', 'POCO', 'BO', 'PIPER', 'PAM', 'TARA', 'DARRYL', 'PENNY', 'FRANK', 'GENE', 'TICK', 'LEON', 'ROSA', 'CARL', 'BIBI', '8-BIT', 'SANDY', 'BEA', 'EMZ', 'MR. P', 'MAX', 'empty1', 'JACKY', 'GALE', 'NANI', 'SPROUT', 'SURGE', 'COLETTE', 'AMBER', 'LOU', 'BYRON', 'EDGAR', 'RUFFS', 'STU', 'BELLE', 'SQUEAK', 'GROM', 'BUZZ', 'GRIFF', 'ASH', 'MEG', 'LOLA', 'FANG', 'empty2', 'EVE', 'JANET', 'BONNIE', 'OTIS', 'SAM', 'GUS', 'BUSTER', 'CHESTER', 'GRAY', 'MANDY', 'R-T', 'WILLOW', 'MAISIE', 'HANK', 'CORDELIUS', 'DOUG', 'PEARL', 'CHUCK', 'CHARLIE', 'MICO', 'KIT', 'LARRY & LAWRIE', 'MELODIE', 'ANGELO', 'DRACO', 'LILY', 'BERRY', 'CLANCY']

#     print(brawlers[numbers.blue1], end=' ')
#     print(brawlers[numbers.blue2], end=' ')
#     print(brawlers[numbers.blue3], end=' ')
#     print(brawlers[numbers.red1], end=' ')
#     print(brawlers[numbers.red2], end=' ')
#     print(brawlers[numbers.red3], end=' ')
#     print(mapsAccordingToModel[numbers.map])

#     # Properly tokenize the map
#     correctedMap = mapsAccordingToModel.index(mapsAccordingToFrontend[numbers.map])

#     print('ACTUAL map:', mapsAccordingToModel[correctedMap])

#      # Convert numbers to tensor
#     inputs = torch.tensor([[numbers.blue1, numbers.blue2, numbers.blue3, numbers.red1, numbers.red2, numbers.red3, correctedMap]], dtype=torch.int)
#     # Run inference
#     output = model(inputs)
#     # Convert tensor to list and return
#     result = output.detach().numpy().tolist()[0]
#     # time.sleep(3) # simulates slow server response times
#     return {"result": result}
