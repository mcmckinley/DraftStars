# backend/app/get_draft_possibilities.py
import torch 
from itertools import permutations

# Returns a tensor that contains all possible draft options.

# recommendation_index: who we're recommending for
# counterpick_index: the other team's (relative to recommendation_index) pick that follows recommendation_index
def get_draft_possibilities(battle, rec_index, blue_picks_first, pick_type, available_brawlers):
  
  pick_order = [0, 5, 4, 1, 2, 3] if blue_picks_first else [5, 0, 1, 4, 3, 2]

  available_brawlers = torch.tensor(available_brawlers)
  num_available_brawlers = len(available_brawlers)

  batch_size = 0
  num_permutations = 0
  if pick_type == 'LAST PICK':
    batch_size = num_available_brawlers
    num_permutations = 1
  elif pick_type == 'FIFTH PICK':
    batch_size = num_available_brawlers * (num_available_brawlers - 1)
    num_permutations = 2
  else:
    batch_size = num_available_brawlers * (num_available_brawlers - 1) * (num_available_brawlers - 2)
    num_permutations = 3

  # Expand the possible_battles tensor
  battle_tensor = torch.tensor(battle, dtype=torch.int)
  possible_battles = battle_tensor.repeat(batch_size, 1)

  perm = torch.tensor(list(permutations(available_brawlers.tolist(), num_permutations)))
  perm = perm.transpose(0, 1)
  print(perm.shape)

  # Set the brawler value to each possible permutation
  possible_battles[:, pick_order[rec_index]] = perm[0]
  if num_permutations > 1:
    possible_battles[:, pick_order[rec_index + 1]] = perm[1]
  if num_permutations > 2:
    possible_battles[:, pick_order[rec_index + 2]] = perm[2]

  return possible_battles