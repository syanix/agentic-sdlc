#!/usr/bin/env node

/**
 * CLI entry point for create-agentic-project.
 *
 * Parses command-line arguments with commander, runs the interactive wizard
 * (or uses --preset with explicit flags), and calls the generator.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { runWizard } from './prompts.js';
import { generate } from './generator.js';
import type {
  StackConfig,
  FrontendFramework,
  BackendFramework,
  DatabaseHosting,
  TestingE2E,
  PresetName,
} from './presets.js';
import {
  FRONTEND_LABELS,
  BACKEND_LABELS,
  DATABASE_LABELS,
  TESTING_E2E_LABELS,
  PRESET_LABELS,
  VALID_DATABASES,
  inferPreset,
} from './presets.js';

const program = new Command();

program
  .name('create-agentic-project')
  .description('Scaffold a Claude Code agentic project with tech-stack-specific agents')
  .version('0.1.0')
  .option('--preset <preset>', `Agent preset: ${Object.keys(PRESET_LABELS).join(', ')}`)
  .option('--backend <framework>', `Backend framework: ${Object.keys(BACKEND_LABELS).join(', ')}`)
  .option('--frontend <framework>', `Frontend framework: ${Object.keys(FRONTEND_LABELS).join(', ')}`)
  .option('--database <hosting>', `Database hosting: ${Object.keys(DATABASE_LABELS).join(', ')}`)
  .option('--testing-e2e <framework>', `E2E testing: ${Object.keys(TESTING_E2E_LABELS).join(', ')}`)
  .option('--name <name>', 'Project name')
  .option('--target <dir>', 'Target directory (default: current directory)')
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const targetDir = opts['target'] ?? process.cwd();

      // If all required flags are provided, skip the wizard
      const hasAllFlags = opts['backend'] && opts['frontend'];
      let config: StackConfig;

      if (hasAllFlags) {
        // Validate provided options
        const backend = validateOption('backend', opts['backend'], BACKEND_LABELS);
        const frontend = validateOption('frontend', opts['frontend'], FRONTEND_LABELS);
        const database = opts['database']
          ? validateOption('database', opts['database'], DATABASE_LABELS)
          : inferDatabase(backend);
        const testingE2E = opts['testing-e2e']
          ? validateOption('testing-e2e', opts['testing-e2e'], TESTING_E2E_LABELS)
          : 'playwright' as TestingE2E;
        const preset = opts['preset']
          ? validateOption('preset', opts['preset'], PRESET_LABELS)
          : inferPreset({ frontend, backend, database, testingE2E });

        // Validate database is compatible with backend
        const validDbs = VALID_DATABASES[backend];
        if (database !== 'none' && !validDbs.includes(database)) {
          console.error(
            chalk.red(`Error: Database "${database}" is not compatible with backend "${backend}".`),
          );
          console.error(chalk.dim(`Valid options: ${validDbs.join(', ')}`));
          process.exit(1);
        }

        config = {
          projectName: opts['name'] ?? targetDir.split('/').pop() ?? 'my-project',
          frontend,
          backend,
          database,
          testingE2E,
          preset,
        };
      } else {
        // Run interactive wizard with any provided defaults
        config = await runWizard({
          projectName: opts['name'],
          backend: opts['backend'] as BackendFramework | undefined,
          frontend: opts['frontend'] as FrontendFramework | undefined,
          database: opts['database'] as DatabaseHosting | undefined,
          testingE2E: opts['testing-e2e'] as TestingE2E | undefined,
          preset: opts['preset'] as PresetName | undefined,
        });
      }

      await generate(config, targetDir);
    } catch (error) {
      if (error instanceof Error && error.message.includes('User force closed')) {
        console.log(chalk.dim('\nCancelled.'));
        process.exit(0);
      }
      console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : error}`));
      process.exit(1);
    }
  });

program.parse();

// ─── Helpers ───────────────────────────────────────────────────────────

function validateOption<T extends string>(
  name: string,
  value: string | undefined,
  validOptions: Record<T, string>,
): T {
  if (!value) {
    console.error(chalk.red(`Error: --${name} is required.`));
    process.exit(1);
  }
  if (!(value in validOptions)) {
    console.error(chalk.red(`Error: Invalid --${name} value "${value}".`));
    console.error(chalk.dim(`Valid options: ${Object.keys(validOptions).join(', ')}`));
    process.exit(1);
  }
  return value as T;
}

function inferDatabase(backend: BackendFramework): DatabaseHosting {
  const validDbs = VALID_DATABASES[backend];
  if (validDbs.length === 1 && validDbs[0] !== undefined) return validDbs[0];
  // Default to neon for most backends
  if (validDbs.includes('neon')) return 'neon';
  return validDbs[0] ?? 'none';
}
