# Portfolio — Vishnu Priya Taduka

Personal site: projects, experience, open-source work and achievements.

**Stack:** Next.js 15 (static export) · TypeScript · Tailwind CSS v4 · Motion · components from
[Watermelon UI](https://ui.watermelon.sh) (dock, expandable cards, discrete tabs, theme switch, shimmer
buttons), adapted in `src/components/watermelon/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Editing content
Everything the site says is in **`src/data/portfolio.ts`**: profile, stats, experience, projects
(with `hidden: true` to keep one off the page), open-source contributions, achievements and skills.

## Deploying
`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
Push this folder to a repository named **`VP-TT.github.io`**, then in the repo's
*Settings → Pages* set *Source* to **GitHub Actions**; the site appears at `https://vp-tt.github.io`.
(For a repo with another name, the site lives under `/<repo-name>/`, so set `basePath` in `next.config.ts`.)
It also deploys as-is on Vercel or Netlify.
