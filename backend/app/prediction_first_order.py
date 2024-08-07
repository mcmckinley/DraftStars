import torch
from .model import model

def pred_first_order(possible_battles, available_brawlers):
  predictions = model(possible_battles)

  outputs = []

  for i in range(len(available_brawlers)):
    outputs.append({
        'pred': predictions[i].item(), 
        'recommendation': available_brawlers[i]
    })

  return outputs