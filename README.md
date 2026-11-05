# Fitness App

A workout app that runs in any browser on any device. No accounts and no Claude needed. Each person's data stays on their own phone.

## Put it online (free, about 5 minutes)

Pick one.

### Netlify (easiest, no coding)
1. Unzip this folder.
2. Go to app.netlify.com/drop and sign up for a free account.
3. Drag the whole unzipped folder onto the page.
4. You get a link like `your-name.netlify.app`. That's your app. You can rename it under Site settings.

### GitHub Pages
1. Create a new public repository on github.com.
2. Upload every file in this folder (Add file, then Upload files).
3. Settings, then Pages, then set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Your link appears there after a minute: `your-username.github.io/repo-name`.

### Vercel
1. Go to vercel.com, sign up, choose Add New, then Project.
2. Upload or import this folder and deploy. No settings needed.

## Install it on a phone
- iPhone: open the link in Safari, tap Share, then Add to Home Screen.
- Android: open the link in Chrome, tap the menu, then Install app (or Add to Home screen).

It opens full screen with its own icon and works offline after the first visit.

## Moving to a new phone
Settings (gear icon), then Save backup. On the new phone, open the app, Settings, then Restore and pick the file.

## Updating the app
Replace `index.html` with the new version and upload again. People get the update the next time they open the app with signal.

## Files
- `index.html`: the whole app
- `manifest.webmanifest`: name, icon and colors for installing
- `sw.js`: makes it work offline
- `icon-*.png`, `apple-touch-icon.png`, `favicon.png`: app icons
