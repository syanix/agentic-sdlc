/**
 * Helper functions: file copying, placeholder replacement, path resolution.
 */

import path from 'node:path';
import fs from 'fs-extra';

// ─── Path Resolution ───────────────────────────────────────────────────

/**
 * Resolve a path relative to the templates/ directory.
 * Works both in development (source) and when installed as an npm package.
 */
export function templatesDir(): string {
  // When running from dist/cli/utils.js, templates is at ../../templates
  // When running from cli/utils.ts (dev), templates is at ../templates
  const candidates = [
    path.resolve(import.meta.dirname, '..', 'templates'),
    path.resolve(import.meta.dirname, '..', '..', 'templates'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  // Fallback: assume cwd has templates/
  return path.resolve(process.cwd(), 'templates');
}

export function templatePath(...segments: string[]): string {
  return path.join(templatesDir(), ...segments);
}

export function outputPath(targetDir: string, ...segments: string[]): string {
  return path.join(targetDir, '.claude', ...segments);
}

// ─── Placeholder Replacement ───────────────────────────────────────────

/**
 * Replace all {{PLACEHOLDER}} tokens in content with values from the map.
 * Unmatched placeholders are left as-is (a warning is logged in verbose mode).
 */
export function replacePlaceholders(
  content: string,
  replacements: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return replacements[key] ?? `{{${key}}}`;
  });
}

// ─── File Operations ───────────────────────────────────────────────────

/** Read a template file and return its contents. Returns empty string if not found. */
export async function readTemplate(...segments: string[]): Promise<string> {
  const filePath = templatePath(...segments);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/** Write content to the output directory, creating parent directories as needed. */
export async function writeOutput(
  targetDir: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const filePath = outputPath(targetDir, relativePath);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

/** Copy a file from templates to the output directory. */
export async function copyTemplate(
  templateRelPath: string,
  targetDir: string,
  outputRelPath: string,
): Promise<void> {
  const src = templatePath(templateRelPath);
  const dest = outputPath(targetDir, outputRelPath);
  if (await fs.pathExists(src)) {
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }
}

/** Copy an entire directory from templates to the output directory. */
export async function copyTemplateDir(
  templateRelDir: string,
  targetDir: string,
  outputRelDir: string,
): Promise<void> {
  const src = templatePath(templateRelDir);
  const dest = outputPath(targetDir, outputRelDir);
  if (await fs.pathExists(src)) {
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }
}

// ─── Validation ────────────────────────────────────────────────────────

/** Check if a target directory already has a .claude/ folder. */
export async function hasExistingConfig(targetDir: string): Promise<boolean> {
  return fs.pathExists(path.join(targetDir, '.claude'));
}

/** Sanitise a project name for use in file content. */
export function sanitiseProjectName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}
