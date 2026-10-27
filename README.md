# Smart Outfit Planner

A responsive mini-project website by Kavindra Rawal (TYCS) that suggests outfit combinations from a digital wardrobe based on occasion, temperature, rain and colour match.

## Features

- Separate Men, Women and Unisex filters for relevant outfit recommendations.
- Detailed clothing types for everyday, formal, sports and ethnic looks.
- Quick-add catalogue for men, women and unisex items, with category filters.
- Manual wardrobe entry with colour, warmth, occasion and rain suitability.
- Outfit scoring, saved looks, printable weekly planner and optional Open-Meteo weather.
- Browser persistence through `localStorage`.
- Email/password login and registration UI with Firebase Authentication integration (requires your Firebase web config; see `SETUP-GUIDE.md`).

## Run

Extract the ZIP and open `index.html` in a browser. For secure login, complete the Firebase setup steps in `SETUP-GUIDE.md` first. Without Firebase configuration, the rest of the planner remains usable and the login form explains the missing setup.

## Project structure

```text
Smart-Outfit-Planner/
├── index.html
├── css/style.css
├── js/app.js
├── js/auth.js
├── js/firebase-config.js
├── SETUP-GUIDE.md
└── README.md
```

## Publish

Upload the files while preserving the folder structure to the existing GitHub repository, then publish from `main` using GitHub Pages settings.
