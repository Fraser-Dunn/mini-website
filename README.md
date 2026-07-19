# mini-website

A personal Dungeons & Dragons miniature collection tracker and gallery — a
searchable, filterable image gallery plus a table-top reference tool
(size, statblock links, etc.) for the collection.

## Stack

- **Frontend**: React + TypeScript, built with Vite, styled with Tailwind
  CSS + hand-written CSS driven by theme CSS custom properties (light/dark
  mode). Deployed to GitHub Pages.
- **Backend**: AWS (DynamoDB, S3, Lambda, API Gateway, Cognito), defined as
  a CDK app in [`backend/`](backend/) — see [`backend/README.md`](backend/README.md).

## Development

```
npm install
npm run dev       # start the Vite dev server
npm run build     # type-check + production build
npm run lint      # oxlint
npm run deploy    # build + publish to GitHub Pages (gh-pages branch)
```

Copy `.env.template` to `.env` and fill in the values (API URL and Cognito
IDs come from the `backend/` CDK stack outputs after `cdk deploy`).

## Project structure

- `src/pages/` — route-level components (Home, Gallery, Search, MiniInfo,
  Admin, LogIn, About, NotFound)
- `src/components/` — shared/presentational components
- `src/services/` — API client (`minisApi.ts`) and Cognito auth
  (`auth.ts`)
- `src/types/mini.ts` — the `Mini` data model
- `backend/` — the AWS CDK app and Lambda handlers (separate `npm` project)
