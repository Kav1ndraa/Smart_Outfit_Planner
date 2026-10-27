# Smart Outfit Planner — Upgrade & Setup Guide

This update preserves the original HTML/CSS/JavaScript app and its existing planner, wardrobe, saved outfits, weekly plan, colour scoring, weather lookup, and browser storage.

## What's new

- Separate Men, Women and Unisex selections for planning and wardrobe items.
- Detailed clothing type choices, including T-shirts, shirts, jeans, trousers, shorts, jackets, footwear, sarees, blouses, dresses, lehengas, kurtis, jewellery and more.
- Quick-add catalogue with audience and category filters. Add catalogue pieces to your own wardrobe in one tap.
- Refined responsive fashion-focused styling.
- Email/password login and account-creation interface with email validation, show/hide password, and a password rule requiring 8+ characters, one uppercase letter and one special character.
- Firebase Authentication integration. Because GitHub Pages is static hosting, you must connect your own Firebase project for real account authentication; the site must not store raw passwords in localStorage.

## Open locally

1. Extract the ZIP file.
2. Open `index.html` in Chrome, or use VS Code + Live Server.
3. Planner, wardrobe, catalogue, saved outfits and weekly plan can be explored without Firebase. Login validation is visible, but secure account sign-in stays disabled until Firebase is configured.

## Set up real email/password authentication (free Firebase tier is enough for a small demo)

1. Visit https://console.firebase.google.com/ and create a Firebase project.
2. In the project, open **Build → Authentication → Get started**.
3. Open **Sign-in method** and enable **Email/Password**.
4. Open **Project settings → General → Your apps**. Add a Web app if you haven't already, then copy its Firebase configuration values.
5. In this ZIP, open `js/firebase-config.js` and replace the placeholder strings for `apiKey`, `authDomain`, `projectId`, and `appId` with the values Firebase provides. Keep the property names as they are.
6. Change `window.SOP_FIREBASE_CONFIGURED = false;` to `true` in that same file.
7. In Firebase Console, go to **Authentication → Settings → Authorized domains** and add your GitHub Pages host, for example `kav1ndraa.github.io` (do not include `https://` or a page path).
8. Save the file and upload the complete project structure to your GitHub repository. Test Create account, sign out, then Log in with that account.

Firebase's web API key is part of the client configuration; protect user data using Firebase Authentication and Firebase Security Rules for any future database. Never put service-account JSON, private keys, or server credentials in this public repository.

## Upload to GitHub Pages (phone or laptop)

1. Download and extract the ZIP.
2. Open your existing repository: https://github.com/Kav1ndraa/Smart-Outfit-Planner
3. Choose **Add file → Upload files**.
4. Upload/replace `index.html`, `css/style.css`, `js/app.js`, `js/auth.js`, `js/firebase-config.js`, `README.md`, and `SETUP-GUIDE.md`. Keep the `css` and `js` folders and their paths unchanged.
5. Commit the changes.
6. Open **Settings → Pages** and confirm the site is published from the `main` branch (usually the root folder).
7. Wait for GitHub Pages to deploy, then open https://kav1ndraa.github.io/Smart-Outfit-Planner/ and refresh the page.

## Important notes

- Wardrobe, saved outfits and weekly plans still use this browser's `localStorage`, just like the original project. They do not automatically sync across devices or between different user accounts yet.
- Firebase authenticates accounts, but a cloud database and per-user data rules would be a separate next step if you want wardrobe data to sync between devices.
- If a browser blocks local files or fonts, use GitHub Pages or VS Code Live Server.


## Mandatory login behavior
The website now requires a successful Firebase email/password sign-in before the planner becomes visible. There is no guest bypass. To enable real login:
1. Open Firebase Console and create/select a project.
2. Add a Web app and copy its config into `js/firebase-config.js`.
3. Set `window.SOP_FIREBASE_CONFIGURED = true` in that file after filling the real `apiKey`, `authDomain`, `projectId`, and `appId`.
4. In Firebase Console → Authentication → Sign-in method, enable **Email/Password**.
5. In Authentication → Settings → Authorized domains, ensure your GitHub Pages domain is listed.
6. Deploy the updated files. Use **Create account** once for your first account, then sign in normally.

Until your Firebase settings are configured, the login screen intentionally remains locked and explains the setup requirement. Email/password format checks alone are not secure authentication.
