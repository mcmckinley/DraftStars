import torch
from .model import model

def create_batches(data, batch_size):
    """Splits data into batches of specified size."""
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]

def pred_third_order(possible_battles, blue, available_brawlers):

  print('Recommending for blue team') if blue else print('Recommending for red team')

  # Batch the input the reduce RAM consumption
  predictions = []
  batch_size = 5000
  for batch in create_batches(possible_battles, batch_size):
    batch_predictions = model(batch)
    predictions.extend(batch_predictions)

  outputs = []

  for i in range(len(available_brawlers)):

    # print('PICK:', brawlers[available_brawlers[i]])

    lowest_score_overall = 1.0 if blue else 0.0

    strongest_counter_index_overall = 0
    strongest_counter_id_overall = available_brawlers[0]

    best_response_index_overall = 0
    best_response_id_overall = available_brawlers[0]

    secondary_brawlers = available_brawlers.copy()
    secondary_brawlers.remove(available_brawlers[i])

    for j in range(len(secondary_brawlers)):

      # print(' COUNTER:', brawlers[secondary_brawlers[j]])

      highest_response_score = 0.0 if blue else 1.0
      best_response_id = secondary_brawlers[0]
      best_response_index = 0

      tertiary_brawlers = secondary_brawlers.copy()
      tertiary_brawlers.remove(secondary_brawlers[j])

      for k in range(len(tertiary_brawlers)):
        pred = predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + j * len(tertiary_brawlers) + k].item()
        if (pred > highest_response_score if blue else pred < highest_response_score):
            highest_response_score = predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + j * len(tertiary_brawlers) + k].item()
            best_response_id = tertiary_brawlers[k]
            best_response_index = k
            # print('   -- best response to ', brawlers[secondary_brawlers[j]], 'is ', brawlers[tertiary_brawlers[k]], ':', highest_response_score)

      # Update the strongest counter
      if (highest_response_score < lowest_score_overall if blue else highest_response_score > lowest_score_overall):
          lowest_score_overall = highest_response_score
          strongest_counter_index_overall = j
          strongest_counter_id_overall = secondary_brawlers[j]
          best_response_id_overall = best_response_id
          best_response_index_overall = best_response_index
          # print(' -- The strongest counter to', brawlers[available_brawlers[i]], 'is', brawlers[secondary_brawlers[j]], 'with a score of', lowest_score_overall)

    # print(brawlers[available_brawlers[i]],"'s lowest score is ", lowest_score_overall, '. counter:', brawlers[strongest_counter_id_overall], 'response:', brawlers[best_response_id_overall])
    #print()
    outputs.append({
        'score': predictions[i * len(secondary_brawlers) * len(tertiary_brawlers) + strongest_counter_index_overall * len(tertiary_brawlers) + best_response_index_overall].item(), # The score
        'recommendation': available_brawlers[i], # The recommendation
        'counter': strongest_counter_id_overall, # The best counter
        'response': best_response_id_overall, # The best response
    })

  return outputs