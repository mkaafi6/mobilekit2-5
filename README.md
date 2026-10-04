# MobileKit 2.5 — Bootstrap 4 PWA Mobile UI Kit

A Bootstrap 4 + jQuery mobile UI kit / PWA template, deployed with **GitHub Pages**.

## 🌐 Live site

**https://mkaafi6.github.io/mobilekit2-5/**

The site is the `HTML/` folder, published automatically by the GitHub Actions
workflow in `.github/workflows/deploy-pages.yml` on every push to `main`.

## 💻 Local development

```bash
cd mobilekit2-5
npm start
```

Runs **live-server** (auto-reload on save) at **http://localhost:5500**.
The `HTML/` folder is the server root, so `index.html` loads at `/`.

## Layout

- `HTML/`   — the usable template (`index.html` + all component & page demos)
- `Source/` — Sketch design source
- `Documentation/` — docs and third-party plugin licenses

## PWA notes

Service workers only run in a **secure context**: `localhost` or **HTTPS**.
GitHub Pages provides HTTPS, so the PWA (offline caching, install-to-home-screen)
works on the live site. It will *not* work when served over a plain HTTP IP
address such as `http://10.0.0.11:5500`.

Fixes applied for subpath hosting:

- `HTML/__manifest.json` — `scope`/`start_url` are relative (`./`) so they work
  both at the domain root and under `/mobilekit2-5/`.
- `HTML/service-worker.js` — precaches **local files only** (a failing CDN
  request can no longer break installation), versioned caches, network-first for
  pages and cache-first for assets.
- `HTML/.nojekyll` — keeps Jekyll from dropping `__manifest.json` (files starting
  with `_`).

## Notes

- `node_modules/` holds the `live-server` dev tool only and is git-ignored.
- To use another port: `npx live-server HTML --port=8080 --host=0.0.0.0`.
