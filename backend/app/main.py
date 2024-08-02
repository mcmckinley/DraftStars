from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import torch
import torch.nn as nn
from .model import Model
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

traits_per_brawler = 30
initial_brawler_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/8_1/brawler_embeddings_V7_3.pt"))
traits_per_map = 12
initial_map_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/8_1/map_embeddings_V7_3.pt"))
num_heads = 2
num_layers = 2
dim_feedforward = 64

model = Model(traits_per_brawler, initial_brawler_embedding, traits_per_map, initial_map_embedding, num_heads, num_layers, dim_feedforward)
model.load_state_dict(torch.load("app/pytorch/8_1/BMV7_3.pt"))
model.eval()

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
    return {"message": "Hello from FastAPI"}

mapsAccordingToFrontend = ["Undermine", "G.G. Mortuary", "Gem Fort", "Ahead of the Curve", "Between the Rivers", "Pinball Dreams", "Four Levels", "Sneaky Sneak", "Super Beach", "Double Locking", "Dragon Jaws", "Infinite Doom", "Center Stage", "Rustic Arcade", "Double Swoosh", "Hot Potato", "Goldarm Gulch", "Deathcap Trap", "Local Businesses", "Backyard Bowl", "Belle's Rock", "Flaring Phoenix", "Hard Lane", "Retina", "New Horizons", "Acute Angle", "Parallel Plays", "Open Business", "Coconut Cove", "Reflections", "Slayer's Paradise", "Island Hopping", "Diamond Dome", "Sneaky Fields", "Twilight Passage", "Spice Production", "Dueling Beetles", "Offside Trap", "Goalkeeper's Dream", "Hard Rock Mine", "Penalty Kick", "Last Stop", "Out in the Open", "Minecart Madness", "Open Space", "Sunny Soccer", "Deep End", "Safe Zone", "Ring of Fire", "Beach Ball", "Kaboom Canyon", "Spider Crawler"]
# Whenever the model is updated, this array must be updated as well 
mapsAccordingToModel = ["Safe Zone", "Gem Fort", "Local Businesses", "Kaboom Canyon", "Slayer's Paradise", "Hard Rock Mine", "Open Business", "Four Levels", "Minecart Madness", "Acute Angle", "Deathcap Trap", "Ring of Fire", "Ahead of the Curve", "Double Swoosh", "Dragon Jaws", "Hard Lane", "Offside Trap", "Spider Crawler", "Penalty Kick", "Sunny Soccer", "Super Beach", "Beach Ball", "Double Locking", "Diamond Dome", "Island Hopping", "Undermine", "Backyard Bowl", "Spice Production", "G.G. Mortuary", "Dueling Beetles", "Goalkeeper's Dream", "Deep End", "Twilight Passage", "Sneaky Fields", "Coconut Cove", "Reflections", "Last Stop", "Sneaky Sneak", "Infinite Doom", "New Horizons", "Retina", "Center Stage", "Parallel Plays", "Out in the Open", "Rustic Arcade", "Flaring Phoenix", "Pinball Dreams", "Goldarm Gulch", "Between the Rivers", "Open Space", "Belle's Rock", "Hot Potato"]

@app.post("/predict")
def predict(numbers: Numbers):
    print('Hi! Recived:', Numbers)
    brawlers = ['SHELLY', 'COLT', 'BULL', 'BROCK', 'RICO', 'SPIKE', 'BARLEY', 'JESSIE', 'NITA', 'DYNAMIKE', 'EL PRIMO', 'MORTIS', 'CROW', 'POCO', 'BO', 'PIPER', 'PAM', 'TARA', 'DARRYL', 'PENNY', 'FRANK', 'GENE', 'TICK', 'LEON', 'ROSA', 'CARL', 'BIBI', '8-BIT', 'SANDY', 'BEA', 'EMZ', 'MR. P', 'MAX', 'empty1', 'JACKY', 'GALE', 'NANI', 'SPROUT', 'SURGE', 'COLETTE', 'AMBER', 'LOU', 'BYRON', 'EDGAR', 'RUFFS', 'STU', 'BELLE', 'SQUEAK', 'GROM', 'BUZZ', 'GRIFF', 'ASH', 'MEG', 'LOLA', 'FANG', 'empty2', 'EVE', 'JANET', 'BONNIE', 'OTIS', 'SAM', 'GUS', 'BUSTER', 'CHESTER', 'GRAY', 'MANDY', 'R-T', 'WILLOW', 'MAISIE', 'HANK', 'CORDELIUS', 'DOUG', 'PEARL', 'CHUCK', 'CHARLIE', 'MICO', 'KIT', 'LARRY & LAWRIE', 'MELODIE', 'ANGELO', 'DRACO', 'LILY', 'BERRY', 'CLANCY']

    print(brawlers[numbers.blue1], end=' ')
    print(brawlers[numbers.blue2], end=' ')
    print(brawlers[numbers.blue3], end=' ')
    print(brawlers[numbers.red1], end=' ')
    print(brawlers[numbers.red2], end=' ')
    print(brawlers[numbers.red3], end=' ')
    print(mapsAccordingToModel[numbers.map])

    # Properly tokenize the map
    correctedMap = mapsAccordingToModel.index(mapsAccordingToFrontend[numbers.map])

    print('ACTUAL map:', mapsAccordingToModel[correctedMap])

     # Convert numbers to tensor
    inputs = torch.tensor([[numbers.blue1, numbers.blue2, numbers.blue3, numbers.red1, numbers.red2, numbers.red3, correctedMap]], dtype=torch.int)
    # Run inference
    output = model(inputs)
    # Convert tensor to list and return
    result = output.detach().numpy().tolist()[0]
    # time.sleep(3) # simulates slow server response times
    return {"result": result}