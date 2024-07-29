from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import torch
import torch.nn as nn
from .model import Model

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
initial_brawler_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/brawler_embeddings.pt"))
traits_per_map = 10
initial_map_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/map_embeddings.pt"))
num_heads = 2
num_layers = 2
dim_feedforward = 64

model = Model(traits_per_brawler, initial_brawler_embedding, traits_per_map, initial_map_embedding, num_heads, num_layers, dim_feedforward)
model.load_state_dict(torch.load("app/pytorch/BMV7_2.pt"))
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

@app.post("/predict")
def predict(numbers: Numbers):
    print('Hi! Recived:', Numbers)
     # Convert numbers to tensor
    inputs = torch.tensor([[numbers.blue1, numbers.blue2, numbers.blue3, numbers.red1, numbers.red2, numbers.red3, numbers.map]], dtype=torch.int)
    # Run inference
    output = model(inputs)
    # Convert tensor to list and return
    result = output.detach().numpy().tolist()[0]
    return {"result": result}