# akekulip.github.io

Personal site and research portfolio of Philip Akekudaga, live at
**<https://akekulip.github.io/>**.

Hand-built static site: one HTML page, one stylesheet, one small script.
No framework, no build step, no tracking.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | All content (single-page, anchor navigation) + JSON-LD structured data |
| `style.css` | Design system: light "engineering paper" / dark "control room" themes |
| `script.js` | Theme toggle, mobile nav, scroll-spy, copy-email |
| `og-image.png` | 1200×630 social preview card |
| `sitemap.xml`, `robots.txt` | SEO surface (canonical host: akekulip.github.io) |
| `resume/` | Resume PDF linked from the hero |
| `404.html` | Not-found page |

## Editing

Everything is plain HTML/CSS. To preview locally:

```bash
python3 -m http.server 8377
# open http://127.0.0.1:8377/
```

Deployment is automatic: pushing to `main` triggers the GitHub Actions
static-deploy workflow (`.github/workflows/static.yml`).

## Content conventions

- Projects: only public, self-authored repositories get cards and links.
- Publications: grouped by status (published / accepted / under review); no
  claims beyond the CV source of truth.
- Copy style: subject-first, plain verbs, metrics inline, no em-dashes.
