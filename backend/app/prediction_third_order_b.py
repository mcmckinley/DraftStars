import torch
from .model import model

def create_batches(data, batch_size):
    """Splits data into batches of specified size."""
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]

def pred_third_order_b(possible_battles, blue, available_brawlers):

  # print('Recommending for blue team') if blue else print('Recommending for red team')

  # Batch the input the reduce RAM consumption
  predictions = []
  batch_size = 5000
  for batch in create_batches(possible_battles, batch_size):
    batch_predictions = model(batch)
    predictions.extend(batch_predictions)

  outputs = []

  for i in range(len(available_brawlers)):

    # print('PICK:', brawlers[available_brawlers[i]])

    highest_score_overall = 0.0 if blue else 1.0

    strongest_secondpick_index_overall = 0
    strongest_secondpick_id_overall = available_brawlers[0]

    strongest_counter_index_overall = 0
    strongest_counter_id_overall = available_brawlers[0]

    secondary_brawlers = available_brawlers.copy()
    secondary_brawlers.remove(available_brawlers[i])

    for j in range(len(secondary_brawlers)):

      # print(' ALSO PICK:', brawlers[secondary_brawlers[j]])

      lowest_second_pick_score = 1.0 if blue else 0.0
      best_counter_id = secondary_brawlers[0]
      best_counter_index = 0

      tertiary_brawlers = secondary_brawlers.copy()
      tertiary_brawlers.remove(secondary_brawlers[j])

      for k in range(len(tertiary_brawlers)):
        pred = predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + j * len(tertiary_brawlers) + k].item()
        #print(possible_battles[i * len(secondary_brawlers) * len(tertiary_brawlers) + j * len(tertiary_brawlers) + k].tolist())

        if (pred < lowest_second_pick_score if blue else pred > lowest_second_pick_score):
            lowest_second_pick_score = predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + j * len(tertiary_brawlers) + k].item()
            best_counter_id = tertiary_brawlers[k]
            best_counter_index = k
            # print('   -- The best counter to ', brawlers[secondary_brawlers[j]], 'is ', brawlers[tertiary_brawlers[k]], ':', lowest_second_pick_score)

      if (lowest_second_pick_score > highest_score_overall if blue else lowest_second_pick_score < highest_score_overall):
          highest_score_overall = lowest_second_pick_score
          strongest_secondpick_index_overall = j
          strongest_secondpick_id_overall = secondary_brawlers[j]
          strongest_counter_index_overall = best_counter_index
          strongest_counter_id_overall = best_counter_id
          # print(' -- Their strongest synergy with', brawlers[available_brawlers[i]], 'is', brawlers[secondary_brawlers[j]], 'with a score of', highest_score_overall)

    # print(brawlers[available_brawlers[i]],"'s best score is ", highest_score_overall, '. This is with the optimal next pick of', brawlers[strongest_secondpick_id_overall], 'and the best counter is', brawlers[strongest_counter_id_overall])
    # print()

    outputs.append({
        'score': predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + strongest_secondpick_index_overall * len(tertiary_brawlers) + strongest_counter_index_overall].item(), # The score
        'name': available_brawlers[i], # The recommendation
        'synergy_pick': strongest_secondpick_id_overall, # The best second pick
        'counter': strongest_counter_id_overall, # The best counter
    })

  return outputs