/**
 * Preset definitions and valid stack combinations.
 *
 * Presets map to JSON files in templates/presets/ and define which components
 * (agents, commands, skills, hooks) to include in the generated project.
 */

// ─── Stack Enums ───────────────────────────────────────────────────────

export type FrontendFramework = 'nextjs' | 'astro' | 'react-vite' | 'none';
export type BackendFramework = 'nestjs' | 'go' | 'python' | 'dotnet' | 'cloudflare' | 'none';
export type DatabaseHosting = 'neon' | 'supabase-db' | 'flyio' | 'cloudflare-d1' | 'none';
export type TestingE2E = 'playwright' | 'cypress' | 'none';
export type PresetName = 'full-sdlc' | 'minimal' | 'prototype' | 'backend-only' | 'frontend-only';

// ─── Stack Configuration ───────────────────────────────────────────────

export interface StackConfig {
  projectName: string;
  frontend: FrontendFramework;
  backend: BackendFramework;
  database: DatabaseHosting;
  testingE2E: TestingE2E;
  preset: PresetName;
}

// ─── Display Labels ────────────────────────────────────────────────────

export const FRONTEND_LABELS: Record<FrontendFramework, string> = {
  nextjs: 'Next.js (App Router)',
  astro: 'Astro',
  'react-vite': 'React (Vite)',
  none: 'None',
};

export const BACKEND_LABELS: Record<BackendFramework, string> = {
  nestjs: 'NestJS',
  go: 'Go (Gin/Echo)',
  python: 'Python (FastAPI)',
  dotnet: '.NET 10',
  cloudflare: 'Cloudflare Workers (Hono)',
  none: 'None',
};

export const DATABASE_LABELS: Record<DatabaseHosting, string> = {
  neon: 'Neon Postgres',
  'supabase-db': 'Supabase Postgres',
  flyio: 'Fly.io Postgres (unmanaged)',
  'cloudflare-d1': 'Cloudflare D1 (SQLite edge)',
  none: 'None',
};

export const TESTING_E2E_LABELS: Record<TestingE2E, string> = {
  playwright: 'Playwright',
  cypress: 'Cypress',
  none: 'None',
};

export const PRESET_LABELS: Record<PresetName, string> = {
  'full-sdlc': 'Full SDLC — All agents, commands, skills, and hooks',
  minimal: 'Minimal — Core agents and essential commands',
  prototype: 'Prototype — Quick start for rapid prototyping',
  'backend-only': 'Backend Only — API services and server-side apps',
  'frontend-only': 'Frontend Only — SPAs and client-side apps',
};

// ─── Stack Mappings ────────────────────────────────────────────────────

/** Maps backend frameworks to their unit testing stack template name. */
export const BACKEND_TESTING_MAP: Partial<Record<BackendFramework, string>> = {
  nestjs: 'jest',
  go: 'go-test',
  python: 'pytest',
  dotnet: 'xunit',
  cloudflare: 'vitest',
};

/** Maps frontend frameworks to their component testing stack template name. */
export const FRONTEND_TESTING_MAP: Partial<Record<FrontendFramework, string>> = {
  nextjs: 'jest',
  astro: 'vitest',
  'react-vite': 'vitest',
};

/** Database options filtered by backend choice. */
export const VALID_DATABASES: Record<BackendFramework, DatabaseHosting[]> = {
  nestjs: ['neon', 'supabase-db', 'flyio'],
  go: ['neon', 'supabase-db', 'flyio'],
  python: ['neon', 'supabase-db', 'flyio'],
  dotnet: ['neon', 'supabase-db', 'flyio'],
  cloudflare: ['cloudflare-d1'],
  none: ['none'],
};

/** Maps backend frameworks to the placeholder content file path (relative to _stacks/). */
export const BACKEND_STACK_PATH: Partial<Record<BackendFramework, string>> = {
  nestjs: 'backend/nestjs.md',
  go: 'backend/go.md',
  python: 'backend/python.md',
  dotnet: 'backend/dotnet.md',
  cloudflare: 'backend/cloudflare.md',
};

export const FRONTEND_STACK_PATH: Partial<Record<FrontendFramework, string>> = {
  nextjs: 'frontend/nextjs.md',
  astro: 'frontend/astro.md',
  'react-vite': 'frontend/react-vite.md',
};

export const DATABASE_STACK_PATH: Partial<Record<DatabaseHosting, string>> = {
  neon: 'database/neon.md',
  'supabase-db': 'database/supabase-db.md',
  flyio: 'database/flyio.md',
  'cloudflare-d1': 'database/cloudflare-d1.md',
};

export const TESTING_STACK_PATH: Record<string, string> = {
  jest: 'testing/jest.md',
  vitest: 'testing/vitest.md',
  'go-test': 'testing/go-test.md',
  pytest: 'testing/pytest.md',
  xunit: 'testing/xunit.md',
  playwright: 'testing/playwright.md',
  cypress: 'testing/cypress.md',
};

// ─── Skill Stack Paths ─────────────────────────────────────────────────

export const BACKEND_SKILL_STACKS: Partial<Record<BackendFramework, string>> = {
  nestjs: 'nestjs',
  go: 'go',
  python: 'python',
  dotnet: 'dotnet',
  cloudflare: 'cloudflare',
};

export const FRONTEND_SKILL_STACKS: Partial<Record<FrontendFramework, string>> = {
  nextjs: 'nextjs',
  astro: 'astro',
  'react-vite': 'react-vite',
};

// ─── Preset Inference ──────────────────────────────────────────────────

/** Infer the best preset from the chosen stacks when not explicitly set. */
export function inferPreset(config: Omit<StackConfig, 'preset' | 'projectName'>): PresetName {
  if (config.frontend === 'none' && config.backend !== 'none') return 'backend-only';
  if (config.backend === 'none' && config.frontend !== 'none') return 'frontend-only';
  return 'full-sdlc';
}
