# Asset generators

Source files for the site's raster assets — no build step for the site
itself, this is a one-off local tool.

- `og-image.html` → `og-image.png` (1200×630, link-preview image)
- `favicon.html` → `icon-512.png` / `apple-touch-icon.png` (512×512 square,
  used at both sizes; browsers scale it down as needed)

## Regenerate

Requires a local Chrome/Edge install. From the repo root:

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --screenshot="$(pwd)/og-image.png" --window-size=1200,630 \
  --virtual-time-budget=4000 "file:///$(pwd)/tools/assets/og-image.html"

"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --screenshot="$(pwd)/icon-512.png" --window-size=512,512 \
  --virtual-time-budget=1500 "file:///$(pwd)/tools/assets/favicon.html"
cp icon-512.png apple-touch-icon.png
```

Move/copy the resulting PNGs to the repo root, replacing the existing ones.
