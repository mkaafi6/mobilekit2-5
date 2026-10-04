# Session Notes — MobileKit 2.5 Project

> A running memory/log of our work. Update this file as the project evolves so
> we always know where we left off.

**Last updated:** 2026-10-04
**Repo:** https://github.com/mkaafi6/mobilekit2-5 (public, branch `main`)
**Live site:** https://mkaafi6.github.io/mobilekit2-5/
**Local path:** `/root/mobilekit2-5`

---

## 1. What this project is

- **MobileKit 2.5** — a purchased (ThemeForest) **Bootstrap 4 + jQuery mobile UI kit / PWA template**.
- Originally downloaded from Google Drive (file id `1aPwRZqrXRs4Zs0andHMpekmKlsIkmHA4`) as a ZIP.
- Extracted into `/root/mobilekit2-5` (was `mobilekit2.5`, renamed to match the repo).
- Key folders:
  - `HTML/` — the actual template (`index.html` + ~68 component/page demos). This is what gets deployed.
  - `Source/` — Sketch design source (`Mobilekit_Sketch.sketch`, ~3.8 MB).
  - `Documentation/` — docs + third-party plugin licenses.

## 2. Dependencies / tooling discovered

- **Runtime libs (local):** jQuery 3.4.1, Bootstrap 4 (JS + CSS), Popper.js, Owl Carousel 2, jQuery Circle Progress, jQuery Countdown.
- **External CDNs (remote):** Ionicons 5.0.0 (unpkg) and Google Fonts "Inter" (fonts.googleapis.com).
- **No build system** — no webpack, gulp, or bundler. Plain static HTML/CSS/JS.
- **SASS source** exists in `HTML/assets/sass/` and compiles manually to `HTML/assets/css/style.css`. Only needed if editing `.scss`.
- **npm/Node are NOT required** to run it; we only added them for `live-server`.

## 3. Local dev server

- Installed `live-server` (dev-only) via npm in the project.
- `package.json` script: `npm start` → `live-server HTML --port=5500 --host=0.0.0.0 --no-browser`.
- **Local URL:** http://localhost:5500 (confirmed working in the Android browser — this terminal shares the phone's network namespace).
- Auto-reload on file save is enabled.

## 4. PWA gotchas found & fixed

- **Service workers need a secure context** (HTTPS or `localhost`). They do NOT work over a plain HTTP IP like `http://10.0.0.11:5500`. GitHub Pages = HTTPS, so it works live.
- **Original `service-worker.js` had bugs:**
  - `cache.addAll()` included remote CDN URLs → any CDN failure killed the whole install.
  - `'/'` in the precache list broke under a subpath.
  - Naive cache-first with a never-changing cache name → stale content forever.
- **Fixes applied:**
  - `HTML/__manifest.json` → `scope`/`start_url` are now relative (`./`, `./index.html`), plus `id`. Works at both the domain root and the `/mobilekit2-5/` subpath.
  - `HTML/service-worker.js` → rewritten: precaches **local files only**, versioned caches with cleanup, **network-first** for pages, **cache-first** for assets (incl. opaque CDN responses).
  - `HTML/.nojekyll` → stops Jekyll from dropping `__manifest.json` (files starting with `_`).
- **Still optional:** self-host Ionicons + the Inter font locally to make offline 100% reliable (removes CDN dependency).

## 5. Git & GitHub setup

- `git init` in `/root/mobilekit2-5`, branch `main`; `.gitignore` excludes `node_modules/`, `.DS_Store`, `__MACOSX/`, editor files.
- **Git identity:** `Cabdi Ciise <138144035+mkaafi6@users.noreply.github.com>`
- **GitHub account:** `mkaafi6`
- **Auth method:** GitHub **device flow** (no secret pasted in chat). Token persisted by `gh auth login --with-token`.
  - Token stored at: `~/.config/gh/hosts.yml` (survives session exit — the phone's filesystem is persistent).
  - Token scopes: `repo`, `workflow`, `read:org`, `gist`. The `workflow` scope is required to push `.github/workflows/` files.
  - `gh auth setup-git` configured git's HTTPS credential helper, so `git push` keeps working.
- **SSH key** generated at `~/.ssh/id_ed25519` (no passphrase, persistent). NOT yet added to GitHub — adding via API needs the `admin:public_key` scope. To use SSH, add the public key at GitHub → Settings → SSH and GPG keys:
  ```
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIALAV7H6r+n7AZk2QkFsB0wHcE+1HfXUO5Ho30+WEIa mobilekit2-5
  ```

## 6. Deployment (GitHub Pages)

- Repo created **public** (required: free personal accounts can only publish Pages from public repos).
- Pages enabled with `build_type=workflow`.
- `.github/workflows/deploy-pages.yml` publishes the **`HTML/` folder** as the site root on every push to `main`.
- First deploy succeeded (~16s). Site verified: `/`, `/index.html`, `/__manifest.json`, `/service-worker.js`, assets, and component pages all return `200`.

## 7. Environment lessons (important!)

- Running as **root on the phone's real filesystem** (f2fs), not an ephemeral proot — files persist across sessions.
- **Do NOT rename the project directory after `git init`.** This filesystem stores git objects as **symlinks with absolute paths**; renaming broke them and corrupted the object database. Fix was to delete `.git` and re-init. We also ran `git repack -a -d` to normalize objects into a packfile.
- Harmless noise: `.git/objects/**/.l2s.tmp_obj_*` files (an environment quirk); `git fsck` warns about them but they don't affect pushes.

## 8. How to resume next time

```bash
cd /root/mobilekit2-5
npm start                      # local dev at http://localhost:5500
# ...make changes...
git add -A
git commit -m "message"
git push                       # auto-redeploys Pages (~30s)
```

- **Backup** `~/.config/gh/` and `~/.ssh/` somewhere safe; clearing the Wolfi Terminal app data could wipe them.

## 9. Open TODO / decisions

- [ ] Add the SSH public key to GitHub (optional — HTTPS already persists).
- [ ] Self-host Ionicons + Inter font to remove CDN dependency for offline.
- [ ] Decide whether to keep the repo public (exposes the paid template source) or make it private (loses the free Pages link).
- [ ] Customize the template into an actual app (branding, pages, manifest name/icons).
