// src/data/writeData.js

// A tool for programmers in case they want to efficiently redefine the maps list.

var maps = ["Undermine", "G.G. Mortuary", "Gem Fort", "Ahead of the Curve", "Between the Rivers", "Pinball Dreams", "Four Levels", "Sneaky Sneak", "Super Beach", "Double Locking", "Dragon Jaws", "Infinite Doom", "Center Stage", "Rustic Arcade", "Double Swoosh", "Hot Potato", "Goldarm Gulch", "Deathcap Trap", "Local Businesses", "Backyard Bowl", "Belle's Rock", "Flaring Phoenix", "Hard Lane", "Retina", "New Horizons", "Acute Angle", "Parallel Plays", "Open Business", "Coconut Cove", "Reflections", "Slayer's Paradise", "Island Hopping", "Diamond Dome", "Sneaky Fields", "Twilight Passage", "Spice Production", "Dueling Beetles", "Offside Trap", "Goalkeeper's Dream", "Hard Rock Mine", "Penalty Kick", "Last Stop", "Out in the Open", "Minecart Madness", "Open Space", "Sunny Soccer", "Deep End", "Safe Zone", "Ring of Fire", "Beach Ball", "Kaboom Canyon", "Spider Crawler"]

for (i in maps){
    const map = maps[i] 
    console.log('{')
    console.log('  "name": "' + map + '",')
    console.log('  "imgUrl": "' + map.replace(' ', '-') + '.webp",')
    console.log('  "id": "' + i + '",')
    console.log('},')
}