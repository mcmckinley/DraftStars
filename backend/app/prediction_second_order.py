import torch
from .model import model

def pred_second_order(possible_battles, blue, available_brawlers):
  # print('Second order prediction')
  predictions = model(possible_battles)

  outputs = []

  for i in range(len(available_brawlers)):

    # Find the brawler's hardest counter
    brawler_lowest_score = 1.0 if blue else 0.0
    brawler_strongest_counter_index = 0
    brawler_strongest_counter_id = available_brawlers[0]

    remaining_brawlers = available_brawlers.copy()
    remaining_brawlers.remove(available_brawlers[i])

    for j in range(len(remaining_brawlers)):
      pred = predictions[i * (len(remaining_brawlers)) + j].item()

      if pred < brawler_lowest_score if blue else pred > brawler_lowest_score:
        brawler_lowest_score = predictions[i * (len(remaining_brawlers)) + j].item()
        brawler_strongest_counter_id = remaining_brawlers[j]
        brawler_strongest_counter_index = j
        # print('   your best counter is', brawlers[remaining_brawlers[j]], 'with a score of', predictions[i * (len(remaining_brawlers)) + j].item())

    outputs.append({
        'score': predictions[i * len(remaining_brawlers) + brawler_strongest_counter_index].item(), # The score
        'recommendation': available_brawlers[i], # The recommendation
        'counter': brawler_strongest_counter_id # The best counter
    })

  return outputs