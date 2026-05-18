import type { SeoSnapshot } from "@/types/seo";

import { getPool, hasDatabaseUrl } from "@/lib/db/pool";

const schemaSql = `
  create table if not exists seo_snapshots (
    id bigserial primary key,
    project_name text not null,
    domain text not null,
    snapshot jsonb not null,
    created_at timestamptz not null default now()
  );

  create index if not exists seo_snapshots_created_at_idx on seo_snapshots (created_at desc);
`;

let schemaPromise: Promise<void> | null = null;

async function ensureSchema() {
  const pool = getPool();
  if (!pool) return;

  schemaPromise ??= pool.query(schemaSql).then(() => undefined);
  await schemaPromise;
}

export async function saveSeoSnapshot(snapshot: SeoSnapshot) {
  if (!hasDatabaseUrl()) {
    return false;
  }

  const pool = getPool();
  if (!pool) {
    return false;
  }

  try {
    await ensureSchema();

    await pool.query(
      `
        insert into seo_snapshots (project_name, domain, snapshot, created_at)
        values ($1, $2, $3::jsonb, $4)
      `,
      [snapshot.project.name, snapshot.project.domain, JSON.stringify(snapshot), snapshot.processedAt],
    );

    return true;
  } catch {
    return false;
  }
}

export async function loadLatestSeoSnapshot() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const pool = getPool();
  if (!pool) {
    return null;
  }

  try {
    await ensureSchema();

    const result = await pool.query<{ snapshot: SeoSnapshot }>(
      `
        select snapshot
        from seo_snapshots
        order by created_at desc
        limit 1
      `,
    );

    const snapshot = result.rows[0]?.snapshot;
    return snapshot ?? null;
  } catch {
    return null;
  }
}
