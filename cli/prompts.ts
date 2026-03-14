/**
 * Interactive wizard using @inquirer/prompts.
 */

import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
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
import { hasExistingConfig, sanitiseProjectName } from './utils.js';

// ─── Choice Helpers ────────────────────────────────────────────────────

function toChoices<T extends string>(labels: Record<T, string>): Array<{ name: string; value: T }> {
  return Object.entries(labels).map(([value, name]) => ({
    name: name as string,
    value: value as T,
  }));
}

// ─── Wizard ────────────────────────────────────────────────────────────

export async function runWizard(defaults?: Partial<StackConfig>): Promise<StackConfig> {
  console.log();
  console.log(chalk.bold('🏗  Create Agentic Project'));
  console.log(chalk.dim('Configure your Claude Code agent stack.\n'));

  // Project name
  const projectName = defaults?.projectName ?? await input({
    message: 'Project name:',
    default: sanitiseProjectName(process.cwd().split('/').pop() ?? 'my-project'),
    validate: (val) => val.trim().length > 0 || 'Project name is required.',
  });

  // Backend framework
  const backend: BackendFramework = defaults?.backend ?? await select({
    message: 'Backend framework:',
    choices: toChoices(BACKEND_LABELS),
    default: 'nestjs' as BackendFramework,
  });

  // Frontend framework
  const frontend: FrontendFramework = defaults?.frontend ?? await select({
    message: 'Frontend framework:',
    choices: toChoices(FRONTEND_LABELS),
    default: 'nextjs' as FrontendFramework,
  });

  // Database hosting (filtered by backend choice)
  const validDatabases = VALID_DATABASES[backend];
  let database: DatabaseHosting;
  if (defaults?.database) {
    database = defaults.database;
  } else if (validDatabases.length === 1 && validDatabases[0] !== undefined) {
    database = validDatabases[0];
    console.log(chalk.dim(`  Database: ${DATABASE_LABELS[database]} (auto-selected for ${BACKEND_LABELS[backend]})`));
  } else {
    const filteredLabels = Object.fromEntries(
      Object.entries(DATABASE_LABELS).filter(([key]) =>
        validDatabases.includes(key as DatabaseHosting),
      ),
    ) as Record<DatabaseHosting, string>;
    database = await select({
      message: 'Database hosting:',
      choices: toChoices(filteredLabels),
      default: validDatabases[0],
    });
  }

  // E2E testing framework
  const testingE2E: TestingE2E = defaults?.testingE2E ?? await select({
    message: 'E2E testing framework:',
    choices: toChoices(TESTING_E2E_LABELS),
    default: 'playwright' as TestingE2E,
  });

  // Agent preset
  const inferredPreset = inferPreset({ frontend, backend, database, testingE2E });
  const preset: PresetName = defaults?.preset ?? await select({
    message: 'Agent preset:',
    choices: toChoices(PRESET_LABELS),
    default: inferredPreset,
  });

  // Confirm overwrite if .claude/ exists
  const targetDir = process.cwd();
  if (await hasExistingConfig(targetDir)) {
    const shouldOverwrite = await confirm({
      message: chalk.yellow('A .claude/ directory already exists. Overwrite?'),
      default: false,
    });
    if (!shouldOverwrite) {
      console.log(chalk.dim('Cancelled.'));
      process.exit(0);
    }
  }

  // Summary
  console.log();
  console.log(chalk.bold('Configuration:'));
  console.log(`  ${chalk.dim('Project:')}    ${projectName}`);
  console.log(`  ${chalk.dim('Backend:')}    ${BACKEND_LABELS[backend]}`);
  console.log(`  ${chalk.dim('Frontend:')}   ${FRONTEND_LABELS[frontend]}`);
  console.log(`  ${chalk.dim('Database:')}   ${DATABASE_LABELS[database]}`);
  console.log(`  ${chalk.dim('E2E Tests:')}  ${TESTING_E2E_LABELS[testingE2E]}`);
  console.log(`  ${chalk.dim('Preset:')}     ${preset}`);
  console.log();

  return {
    projectName: sanitiseProjectName(projectName),
    frontend,
    backend,
    database,
    testingE2E,
    preset,
  };
}
