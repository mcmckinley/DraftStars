<div align="center">

  <img src="frontend/src/symbols/favicon-dark.png" alt="Draft Stars Icon" width="80" height="80" />


  <h3 align="center">Draft Stars</h3>

  <p align="center">
    AI Draft Engine for Brawl Stars
    <br />
  </p>

  <a href="https://www.youtube.com/watch?v=gwCoYQUve7U&list=PL9lgGfhvEDZ16vKBjf5qXfNqH1yy9DhoH&index=1" target="_blank" rel="noopener noreferrer" >
    <img src="misc/youtube_preview.png" alt="YouTube Demonstration" width="500" height="300" />
  </a>
</div>

<h2>
  Description
</h2>
<p>
  Draft Stars is an AI-powered draft engine for Brawl Stars. Trained on over one million battles, it recommends character selections that optimize your chances of success based on unique in-game matchups.
</p>

<h2>
  Why?
</h2>

Selecting a brawler can be incredibly challenging. During the picking stage of a ranked match, you have only 20 seconds to choose from a roster of 83 characters. When making your choice, you must consider several difficult factors:
* Countering the enemy's picks
* Being difficult to counter by the enemy
* What your teammates have picked and will pick
* The map in play

<h1>
Technologies used
</h1>

* 🐳 <strong>Docker</strong>
* 🔒 <strong>Caddy</strong> for reverse proxy

<h3>
Backend
</h3>

* 🔥 <strong>PyTorch</strong> to create, train and load the model
* ⏩ <strong>FastAPI</strong> for the backend

<h3>
Frontend
</h3>

* :electron: <strong>React</strong>
* 🤖 <strong>reCAPTCHA</strong> for feedback submissions


<!-- GETTING STARTED -->
## Getting Started

1. First, you must download the model. You can download it from my Google Drive here:

https://drive.google.com/file/d/1fTVYHmjjnyCC-GnGdKKGTCxSsXZJgsuI/view?usp=drive_link

2. Create a folder in backend/app called `pytorch`. 
3. Move the model file into `pytorch`.

## Manually modifying the embeddings

You can adjust the embeddings as you see fit.



## File descriptions