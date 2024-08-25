from fastapi import APIRouter
from pydantic import BaseModel
import torch
import pandas as pd 
from .model import model

from .get_draft_possibilities import get_draft_possibilities
from .prediction_first_order import pred_first_order
from .prediction_second_order import pred_second_order
from .prediction_third_order_a import pred_third_order
from .prediction_third_order_b import pred_third_order_b
from .prediction_final import pred_final


mapsAccordingToFrontend = ["Undermine", "G.G. Mortuary", "Gem Fort", "Ahead of the Curve", "Between the Rivers", "Pinball Dreams", "Four Levels", "Sneaky Sneak", "Super Beach", "Double Locking", "Dragon Jaws", "Infinite Doom", "Center Stage", "Rustic Arcade", "Double Swoosh", "Hot Potato", "Goldarm Gulch", "Deathcap Trap", "Local Businesses", "Backyard Bowl", "Belle's Rock", "Flaring Phoenix", "Hard Lane", "Retina", "New Horizons", "Acute Angle", "Parallel Plays", "Open Business", "Coconut Cove", "Reflections", "Slayer's Paradise", "Island Hopping", "Diamond Dome", "Sneaky Fields", "Twilight Passage", "Spice Production", "Dueling Beetles", "Offside Trap", "Goalkeeper's Dream", "Hard Rock Mine", "Penalty Kick", "Last Stop", "Out in the Open", "Minecart Madness", "Open Space", "Sunny Soccer", "Deep End", "Safe Zone", "Ring of Fire", "Beach Ball", "Kaboom Canyon", "Spider Crawler"]

brawlers = ['SHELLY', 'COLT', 'BULL', 'BROCK', 'RICO', 'SPIKE', 'BARLEY', 'JESSIE', 'NITA', 'DYNAMIKE', 'EL PRIMO', 'MORTIS', 'CROW', 'POCO', 'BO', 'PIPER', 'PAM', 'TARA', 'DARRYL', 'PENNY', 'FRANK', 'GENE', 'TICK', 'LEON', 'ROSA', 'CARL', 'BIBI', '8-BIT', 'SANDY', 'BEA', 'EMZ', 'MR. P', 'MAX', 'empty1', 'JACKY', 'GALE', 'NANI', 'SPROUT', 'SURGE', 'COLETTE', 'AMBER', 'LOU', 'BYRON', 'EDGAR', 'RUFFS', 'STU', 'BELLE', 'SQUEAK', 'GROM', 'BUZZ', 'GRIFF', 'ASH', 'MEG', 'LOLA', 'FANG', 'empty2', 'EVE', 'JANET', 'BONNIE', 'OTIS', 'SAM', 'GUS', 'BUSTER', 'CHESTER', 'GRAY', 'MANDY', 'R-T', 'WILLOW', 'MAISIE', 'HANK', 'CORDELIUS', 'DOUG', 'PEARL', 'CHUCK', 'CHARLIE', 'MICO', 'KIT', 'LARRY & LAWRIE', 'MELODIE', 'ANGELO', 'DRACO', 'LILY', 'BERRY', 'CLANCY']
maps = ["Sneaky Fields", "Kaboom Canyon", "Spider Crawler", "Island Hopping", "Between the Rivers", "Retina", "Goldarm Gulch", "Minecart Madness", "Penalty Kick", "Gem Fort", "Offside Trap", "Open Business", "Center Stage", "Local Businesses", "Last Stop", "Sneaky Sneak", "Ahead of the Curve", "Flaring Phoenix", "Out in the Open", "Deep End", "Ring of Fire", "Infinite Doom", "Beach Ball", "Goalkeeper's Dream", "New Horizons", "Hard Rock Mine", "Pinball Dreams", "Diamond Dome", "Spice Production", "Safe Zone", "Rustic Arcade", "Four Levels", "Twilight Passage", "Belle's Rock", "Hard Lane", "G.G. Mortuary", "Deathcap Trap", "Dueling Beetles", "Parallel Plays", "Reflections", "Double Locking", "Double Swoosh", "Dragon Jaws", "Acute Angle", "Coconut Cove", "Open Space", "Super Beach", "Undermine", "Hot Potato", "Backyard Bowl", "Sunny Soccer", "Slayer's Paradise"]

num_brawlers = len(brawlers)
num_maps = len(maps)

def brawler_index(brawler):
    return brawlers.index(brawler)

def map_index(map):
    return maps.index(map)

def fix_map_index(map):
    return map_index(mapsAccordingToFrontend[map])


# Tables that hold 1s where the brawler should be excluded, 0s if not
exclusion_table_a = pd.read_csv('app/exclusion_tables/1st-3rd Pick Exclusion Table.csv')
exclusion_table_b = pd.read_csv('app/exclusion_tables/4th-5th Pick Exclusion Table.csv')

exclusion_category = {
    'Double Swoosh': 'gem_grab',
    'Hard Rock Mine': 'gem_grab',
    'Undermine': 'gem_grab',

    'Center Stage': 'brawl_ball',
    'Penalty Kick': 'brawl_ball',
    'Pinball Dreams': 'brawl_ball',

    'Dueling Beetles': 'walled_control',
    'Open Business': 'walled_control',
    'Parallel Plays': 'walled_control',

    "Belle's Rock": 'open_knockout',
    'Flaring Phoenix': 'closed_knockout',
    'Out in the Open': 'open_knockout',

    'Canal Grande': 'canal_grande',
    'Hideout': 'sniper',
    'Shooting Star': 'sniper',

    'Hot Potato': 'closed_heist',
    'Kaboom Canyon': 'open_heist',
    'Safe Zone': 'open_heist',
}

# Get a map's exclusion list for a given pick type, given the map ID and pick type
def get_exclusion_list(pick_type, map):
  map_name = maps[map]
  if pick_type in ['FIRST PICK', 'SECOND PICK', 'THIRD PICK']:
    exclusion_list = exclusion_table_a[exclusion_category[map_name]]
  elif pick_type in ['FOURTH PICK', 'FIFTH PICK']:
    exclusion_list = exclusion_table_b[exclusion_category[map_name]]
  else:
    print('No brawler exclusions for fifth and sixth picks')
    return []

  brawlers_to_exclude = []
  for i in range(len(exclusion_list)):
    if exclusion_list[i] == 1:
      brawlers_to_exclude.append(i)

  return brawlers_to_exclude


def recommend_brawler(blue1, blue2, blue3, red3, red2, red1, map, blue_picks_first, bans):
    map = fix_map_index(map)
    # print('Got map:', maps[map])

    # Show that the model is receiving correct input
    # print(brawlers[blue1], brawlers[blue2], brawlers[blue3], brawlers[red1])

    # for ban in bans:
        # print(ban)
        # print(type(ban))

    battle = [blue1, blue2, blue3, red3, red2, red1, map]
    names = ['Blue 1', 'Blue 2', 'Blue 3', 'Red 3', 'Red 2', 'Red 1', 'Map']
    pick_order = [0, 5, 4, 1, 2, 3] if blue_picks_first else [5, 0, 1, 4, 3, 2]
    blue_has_pick_at_index = [1, 0, 0, 1, 1, 0] if blue_picks_first else [0, 1, 1, 0, 0, 1]

    # 1. Follow the pick order to find the first unknown brawler.
    #    This will be the focus of the recommendation.

    recommendation_index = -1

    for i in range(len(battle) - 1):
      if battle[pick_order[i]] == 33:
        recommendation_index = i
        break

    if recommendation_index == -1:
      print('Getting final prediction')
      return pred_final(battle)

    # 2. Continue following the pick order and identify if there are any more
    #      KNOWN values after we've found an unknown value.
    #    Finding one tells us that the input is invalid.

    j = recommendation_index
    while j < 6:
      if battle[pick_order[j]] != 33:
        print('Invalid input: bad ordering')
        return
      j += 1

    # 3. Identify the 'pick type'.

    pick_type = 'unknown pick type'

    if   recommendation_index == 0: pick_type = 'FIRST PICK'
    elif recommendation_index == 1: pick_type = 'SECOND PICK'
    elif recommendation_index == 2: pick_type = 'THIRD PICK'
    elif recommendation_index == 3: pick_type = 'FOURTH PICK'
    elif recommendation_index == 4: pick_type = 'FIFTH PICK'
    elif recommendation_index == 5: pick_type = 'LAST PICK'
    else:
      print('Invalid input: unknown pick type')
      return

    nameToRecommend = names[pick_order[recommendation_index]]
    # print(pick_type + ' for ' + nameToRecommend)

    # 4. Find indices, existent or not, of the subsequent picks made by each team.
    #    counterpick_index: index of the enemy team's next pick
    #    response_index: index of your pick that follows counterpick_index

    counterpick_index = -1
    response_index = -1

    if pick_type == 'FIRST PICK':
      counterpick_index = 1
      response_index = 3
    elif pick_type == 'SECOND PICK' or pick_type == 'THIRD PICK':
      counterpick_index = 3
      response_index = 5
    elif pick_type == 'FOURTH PICK':
      counterpick_index = 5
      response_index = 4 # Technically, this is not a response, it's just a another pick.
    elif pick_type == 'FIFTH PICK':
      counterpick_index = 5
      response_index = 0
    elif pick_type == 'LAST PICK':
      counterpick_index = 0
      response_index = 0

    if (counterpick_index == -1 or response_index == -1):
      print('Invalid input: no potential counter / response')
      return

    # 5. Create a list of brawlers that are available for selection.
    #    Remove brawlers that are already selected, as well as those
    #    that are banned

    available_brawlers = list(range(len(brawlers))) # List of integers in ascending order

    # these indices are unused by the official Brawl Stars API
    available_brawlers.remove(33)
    available_brawlers.remove(55)

    for i in range(6):
      if battle[i] != 33 and battle[i] != 55:
        available_brawlers.remove(brawler_index(brawlers[battle[i]]))

    for ban in bans:
      try:
        if ban:
            # print('Is ?')
            # print(ban == True)
            available_brawlers.remove(brawler_index(brawlers[ban]))
      except ValueError:
        # print('WARNING: Ban already exists, or not found:', ban)
        continue

    # 6. Thinking three moves ahead is costly. We account for this by disregarding certain brawlers
    #    that in most circumstances make for unreasonable early picks.

    brawlers_to_exclude = get_exclusion_list(pick_type, map)
    for brawler in brawlers_to_exclude:
      try:
        available_brawlers.remove(brawler)
      except ValueError:
        continue

    # 7. Create a tensor of all possible battles.

    possible_battles = get_draft_possibilities(
        battle,
        recommendation_index,
        blue_picks_first,
        pick_type,
        available_brawlers
    )

    # 8. Calculate and organize the outcome of all possible battles.

    is_blue_team_turn = blue_has_pick_at_index[recommendation_index]

    # Thinking no moves ahead (first order)
    if pick_type == 'LAST PICK':
      preds = pred_first_order(
          possible_battles,
          available_brawlers
    )
    # Thinking one move ahead (second order)
    elif pick_type == 'FIFTH PICK':
      preds = pred_second_order(
          possible_battles,
          is_blue_team_turn,
          available_brawlers
    )
    elif pick_type == 'FOURTH PICK':
      preds = pred_third_order_b(
          possible_battles,
          is_blue_team_turn,
          available_brawlers
    )
    # Thinking two moves ahead (third order)
    else:
      preds = pred_third_order(
          possible_battles,
          is_blue_team_turn,
          available_brawlers
    )

    # 9. Sort and print the predictions by score
    preds = sorted(preds, key=lambda x: x['score'], reverse=is_blue_team_turn)

    #print('\nMap:', maps[map])
    #for prediction in preds:
    #  print(prediction)
    
    return preds