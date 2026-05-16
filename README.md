# Signal Room

Signal Room is a production-style MVP for an AI-powered SEO operations platform. It is intentionally built around uploaded Screaming Frog exports rather than an in-app crawler.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand
- Radix UI primitives with shadcn-style component patterns
- Server Actions and a future-ready API route boundary

## Product flow

1. Upload exported Screaming Frog CSV files.
2. Parse and normalise crawl data into typed page objects.
3. Detect deterministic technical SEO issues.
4. Cluster issues into operational findings.
5. Generate mock AI summaries and recommendations.
6. Surface executive dashboards and prioritised tasks.

## Supported exports

- internal_html.csv
- response_codes.csv
- page_titles.csv
- h1.csv
- canonicals.csv
- inlinks.csv
- crawl_overview.csv

## Available routes

- `/` overview
- `/upload` upload workspace
- `/dashboard` executive dashboard
- `/tasks` prioritised implementation tasks

## Architecture notes

- `app/upload/actions.ts` handles the server-side upload processing entry point.
- `app/api/uploads/analyze/route.ts` provides a JSON API boundary for future integrations.
- `lib/parsers` contains reusable CSV parsing utilities and the Screaming Frog file registry.
- `lib/scoring` contains deterministic issue detection, clustering, priority scoring, and snapshot assembly.
- `lib/ai` contains the mock AI summary and recommendation layer designed for future OpenAI integration.
- `hooks/use-seo-store.ts` persists the processed snapshot client-side for navigation between routes.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub and Railway

### 1. Initialize Git locally

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create a GitHub repository and push

Create an empty GitHub repository, then run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 3. Deploy on Railway from GitHub

1. Create a new project in Railway.
2. Choose Deploy from GitHub repo.
3. Select this repository.
4. Railway will build with `npm run build` and start with `npm run start`.
5. After deploy, generate a public domain in the Railway Networking settings.

### 4. Add PostgreSQL later

When you are ready for persistence:

1. Add a PostgreSQL service in Railway.
2. Reference `DATABASE_URL` into the web service.
3. Add your ORM and migrations.
4. Configure a pre-deploy migration command if needed.

### Snapshot persistence

This MVP stores processed crawl snapshots as JSONB rows when `DATABASE_URL` is available. If the database is absent, the app keeps using the in-memory mock fallback, so local development still works without extra setup.

## Future expansion

The app is structured so persistent projects, crawl histories, authentication, and PostgreSQL-backed storage can be added without restructuring the core parsing and scoring layers.
