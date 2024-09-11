import torch
from .model import model

def pred_final(battle):
  pred = model(torch.tensor(battle).unsqueeze(0)).squeeze()

  print('PRED FINAL')
  #print(pred)

  return [
    {'score': pred.item()}
  ]