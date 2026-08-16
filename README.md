# ShaktiShield — Public Frontend Edition

This version is converted to run **without MongoDB, Express, or a backend server**.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Upload this folder to a GitHub repository, or import the folder into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. No MongoDB URI or backend environment variable is required.
6. The included `vercel.json` enables React Router page refreshes.

## Data model

The app uses browser `localStorage` for demo accounts, emergency contacts, SOS history and incident reports. Static safety tips, self-defense guides and verified safety points are bundled with the frontend.

### Important limitation

Because this is a frontend-only public version, browser data is local to each visitor's device and is **not shared with police, emergency contacts, administrators, or other users**. SOS buttons can open the device calling interface (where supported), but a website cannot silently send emergency SMS/calls or guarantee emergency response without an appropriate backend/mobile service.
