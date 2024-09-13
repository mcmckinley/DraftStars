<div align="center">

  <img src="frontend/src/symbols/favicon-dark.png" alt="Draft Stars Icon" width="80" height="80" />


  <h3 align="center">Draft Stars - Self Hosting on the Web</h3>

  <p align="center">
    AI Draft Engine for Brawl Stars
    <br />
    <br />
    This branch is intended for self-hosting over the web. If you want to run the project locally, use the main branch at https://github.com/mcmckinley/DraftStars
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
### Preparation

Before setting up the project to be accessible over the web, some preparation is necessary first. Follow the directions outlined in https://github.com/mcmckinley/DraftStars/blob/main/README.md before continuing. 

## 🤖 reCAPTCHA

I would strongly suggest using a captcha on any email feedback form (optimally on all POST requests in the repo). Without some form of validation, the website would be prone to malicious misuse. 

The feedback form and backend API are configured to use reCAPTCHA v3, which does not interrupt the user.

To set up reCAPTCHA v3, you need a site key and a secret key. These can be obtained at https://www.google.com/recaptcha/about/.

Add the site key into the frontend wherever YOUR_SITE_KEY occurs: `frontend/public/index.js` and `frontend/src/utils/recaptcha.js`

Add the secret key into your backend's `.env` file under RECAPTCHA_SECRET_KEY.

## 🅿️ Plausible Analytics

If you would like to use an analytical tool to track usage of your website, Plausible is a great option, especially for self-hosting.

Download the repo at https://github.com/plausible/community-edition and follow the instructions for setup.

Once this is set up, uncomment the code in index.html that imports Plausible. Make sure to update the link to your domain.

## 🔗 Accessing your website across to the public internet

First, purchase a domain name and point it at your server's IP address.

Then you need to set up port forwarding with your internet service provider.

For this repo, the following ports must be open:

* 80 - HTTP
* 443 - HTTPS 

And these ones optionally: 

* 587 - SMTP (Email feedback)
* 8000 (or another port of your choosing - 8000 is what I used) - Plausible Analytics

Then you should be good to go!
