# twinlink.eu website

Astro 5 + Tailwind 4, static output. Light, navy-and-green design based on the twinlink.eu logo.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321 (or pass --port 4330)
npm run build    # static site in dist/
```

## Where things are

| What | File |
|---|---|
| **Everything twinlink.eu offers** (twins, tools, projects, knowledge, resources, themes) | `src/content/catalog.ts` |
| Home page, About, Contact, navigation, partners, news | `src/content/site.ts` |
| Colours and fonts | `src/styles/global.css` |
| The link map (home and Explore) | `src/components/LinkMap.astro` |
| "Try it" window for live demos | `src/components/DemoDialog.astro` |

To add a twin, tool or article: add one entry to `items` in `src/content/catalog.ts`. It then
appears on the home page link map, in Explore, on its category and theme pages, in the search,
and gets its own page at `/explore/<id>`. Give it a `demo` URL to get a "Try it" button.

## Pages

- `/` home · `/explore` everything, filterable (`?type=twin&theme=energy&q=heat`)
- `/digital-twins` `/tools` `/projects` `/knowledge` `/resources`
- `/themes/energy` `/themes/climate` `/themes/urban-planning` `/themes/renovation`
- `/explore/<id>` one page per item · `/about` · `/contact`

## Still to decide

- Contact form: needs a mail handler on the hosting (for now: LinkedIn and postal address).
- Items marked `TO CONFIRM` in the content files.

## Netlify preview (November 2026)

The Netlify version is a preview, hidden from search engines:
`PUBLIC_PREVIEW=true` (noindex tag), `public/_headers` (X-Robots-Tag) and `public/robots.txt`
(Disallow all). Build it with `PUBLIC_PREVIEW=true npm run build`.

**Before going live on twinlink.eu:** delete `public/robots.txt` and `public/_headers` (or remove
the X-Robots-Tag line), and build without `PUBLIC_PREVIEW`.
