# MobileKit 2.5 — Bootstrap 4 PWA Mobile UI Kit

Served locally with **live-server** (auto-reload on file save).

## Run

```bash
cd /root/mobilekit2.5
npm start
```

Default port is **5500**. The live site is the `HTML/` folder, so `index.html`
loads at the server root.

## Links (while the server is running)

- Localhost: http://localhost:5500
- Loopback:  http://127.0.0.1:5500
- LAN / device IP: http://10.0.0.11:5500

## Layout

- `HTML/`   — the usable template (index.html + all component & page demos)
- `Source/` — Sketch design source
- `Documentation/` — docs and third-party plugin licenses

## Notes

- `node_modules/` holds `live-server` only (dev tool).
- To use another port: `npx live-server HTML --port=8080 --host=0.0.0.0`.
