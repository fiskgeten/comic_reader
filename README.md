# Panel — a self-hosted comic viewer

A static comic gallery + reader you can host for free on GitHub Pages. No backend, no database — everything is driven by one JSON file and a folder of images.

## Structure

```
comic-site/
├── index.html          gallery homepage
├── reader.html          full-page reader
├── css/style.css
├── js/app.js             gallery logic
├── js/reader.js          reader logic
├── data/comics.json      the manifest — this is the only file you edit to add comics
└── comics/
    └── sample-comic/
        ├── cover.svg
        └── page-1.svg … page-4.svg
```

## Adding your own comic

1. Make a folder under `comics/`, e.g. `comics/my-comic/`.
2. Drop in a cover image and numbered page images (`page-1.jpg`, `page-2.jpg`, …). Any web image format works (jpg, png, webp, svg).
3. Add an entry to `data/comics.json`:

```json
{
  "id": "my-comic",
  "title": "My Comic",
  "author": "Artist Name",
  "tags": ["adventure"],
  "cover": "comics/my-comic/cover.jpg",
  "pageCount": 12,
  "pagePattern": "comics/my-comic/page-{n}.jpg"
}
```

`pageCount` and `pagePattern` are all the reader needs — it builds page 1…N from the pattern, replacing `{n}` with the page number.

## Publishing on GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → set source to the `main` branch (root).
3. Your site will be live at `https://<username>.github.io/<repo>/`.

Because images live in the repo alongside the HTML, everything works with zero server config — but keep in mind **GitHub has a soft 1GB repo size limit** and files over 100MB are rejected outright, so it's best suited to smaller personal collections rather than a large archive.

## Features

- Grid gallery homepage with live search and tag filters
- Full-page reader with prev/next, keyboard arrow navigation, and a thumbnail strip
- Fully static — works on GitHub Pages, Netlify, or just opening `index.html` via a local server
- No tracking, no backend, no dependencies beyond one Google Fonts import

## Local preview

Browsers block `fetch()` on `file://` paths, so serve the folder locally instead of double-clicking `index.html`:

```bash
cd comic-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes on content

This is a blank viewer template — it ships with a placeholder sample comic (simple SVGs) so you can see the layout working. Only add content you own or have the rights to distribute; GitHub's terms prohibit hosting copyrighted material you don't have permission to redistribute.
