/**
 * Core composition logic.
 *
 * Reads base templates, merges with stack-specific content, replaces
 * placeholders, and writes composed output into the target project's
 * .claude/ directory.
 */

import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import type { StackConfig, PresetName } from './presets.js';
import {
  BACKEND_STACK_PATH,
  FRONTEND_STACK_PATH,
  DATABASE_STACK_PATH,
  TESTING_STACK_PATH,
  BACKEND_TESTING_MAP,
  FRONTEND_TESTING_MAP,
  BACKEND_LABELS,
  FRONTEND_LABELS,
  DATABASE_LABELS,
  TESTING_E2E_LABELS,
  BACKEND_SKILL_STACKS,
  FRONTEND_SKILL_STACKS,
} from './presets.js';
import {
  readTemplate,
  writeOutput,
  copyTemplate,
  copyTemplateDir,
  replacePlaceholders,
  templatePath,
  outputPath,
} from './utils.js';

// ─── Preset Loading ────────────────────────────────────────────────────

interface PresetDefinition {
  name: string;
  description: string;
  agents: string[];
  commands: string[];
  skills: string[];
  hooks: string[];
}

async function loadPreset(presetName: PresetName): Promise<PresetDefinition> {
  const content = await readTemplate('presets', `${presetName}.json`);
  if (!content) {
    throw new Error(`Preset "${presetName}" not found.`);
  }
  return JSON.parse(content) as PresetDefinition;
}

// ─── Stack Content Loading ─────────────────────────────────────────────

async function loadStackContent(stacksRelPath: string | undefined): Promise<string> {
  if (!stacksRelPath) return '';
  const content = await readTemplate('agents', '_stacks', ...stacksRelPath.split('/'));
  return content.trim();
}

// ─── Agent Composition ─────────────────────────────────────────────────

/**
 * Compose an agent file by merging a base template with stack-specific content.
 *
 * The base template contains {{PLACEHOLDER}} tokens that get replaced with
 * the relevant stack content. For example, be-dev.md has:
 *   {{BACKEND_STACK_INSTRUCTIONS}} → replaced with nestjs.md content
 *   {{BACKEND_SKILL}} → replaced with a reference to the skill
 */
async function composeAgent(
  agentName: string,
  config: StackConfig,
  replacements: Record<string, string>,
): Promise<string> {
  const baseContent = await readTemplate('agents', '_base', `${agentName}.md`);
  if (!baseContent) {
    throw new Error(`Base template for agent "${agentName}" not found.`);
  }
  return replacePlaceholders(baseContent, replacements);
}

// ─── Build Replacement Map ─────────────────────────────────────────────

async function buildReplacements(config: StackConfig): Promise<Record<string, string>> {
  // Load stack content files
  const backendContent = await loadStackContent(BACKEND_STACK_PATH[config.backend]);
  const frontendContent = await loadStackContent(FRONTEND_STACK_PATH[config.frontend]);
  const databaseContent = await loadStackContent(DATABASE_STACK_PATH[config.database]);

  // Backend testing stack
  const backendTestingKey = BACKEND_TESTING_MAP[config.backend];
  const backendTestingContent = backendTestingKey
    ? await loadStackContent(TESTING_STACK_PATH[backendTestingKey])
    : '';

  // Frontend E2E testing stack
  const e2eTestingContent = config.testingE2E !== 'none'
    ? await loadStackContent(TESTING_STACK_PATH[config.testingE2E])
    : '';

  // Frontend component testing stack
  const frontendTestingKey = FRONTEND_TESTING_MAP[config.frontend];
  const frontendComponentTestingContent = frontendTestingKey
    ? await loadStackContent(TESTING_STACK_PATH[frontendTestingKey])
    : '';

  // Combine testing content for frontend tester (component + E2E)
  const frontendTestingContent = [frontendComponentTestingContent, e2eTestingContent]
    .filter(Boolean)
    .join('\n\n---\n\n');

  // Skill references
  const backendSkillRef = config.backend !== 'none'
    ? `Use the \`backend-dev-guidelines\` skill for ${BACKEND_LABELS[config.backend]}-specific patterns and conventions.`
    : 'No backend skill configured.';

  // Package manager (sensible defaults per stack)
  const packageManager = ['go', 'python', 'dotnet'].includes(config.backend) ? 'npm' : 'npm';

  return {
    // Stack content (injected into agent files)
    BACKEND_STACK_INSTRUCTIONS: backendContent || '_No backend stack configured._',
    FRONTEND_STACK_INSTRUCTIONS: frontendContent || '_No frontend stack configured._',
    TESTING_STACK_INSTRUCTIONS: backendTestingContent || '_No testing stack configured._',
    DATABASE_STACK_INSTRUCTIONS: databaseContent || '_No database stack configured._',
    BACKEND_SKILL: backendSkillRef,

    // Config template values
    PROJECT_NAME: config.projectName,
    FRONTEND_FRAMEWORK: FRONTEND_LABELS[config.frontend],
    BACKEND_FRAMEWORK: BACKEND_LABELS[config.backend],
    DATABASE_HOSTING: DATABASE_LABELS[config.database],
    TESTING_FRAMEWORKS: buildTestingLabel(config),
    TESTING_BACKEND: backendTestingKey ?? 'none',
    TESTING_FRONTEND: config.testingE2E !== 'none' ? TESTING_E2E_LABELS[config.testingE2E] : 'none',
    PACKAGE_MANAGER: packageManager,
    LANGUAGE: inferLanguage(config),

    // Settings template values
    BUILD_COMMANDS: inferBuildCommands(config),
    TEST_COMMANDS: inferTestCommands(config),
    SKILL_ACTIVATION_HOOK: '',
    POST_TOOL_HOOK: '',

    // Placeholders left for user customisation (kept as empty or with defaults)
    ARCHITECTURE_SECTION: '',
    DEV_COMMANDS: '',
    CODE_STYLE: '',
    PROJECT_STRUCTURE: '',
    CONVENTIONS: '',
    ORCHESTRATION_DIAGRAM: '',
    COMMAND_MAPPING: '',
    ARCHITECTURE_PATTERN: 'layered',
  };
}

function buildTestingLabel(config: StackConfig): string {
  const parts: string[] = [];
  const backendTestingKey = BACKEND_TESTING_MAP[config.backend];
  if (backendTestingKey) parts.push(`${backendTestingKey} (unit/integration)`);
  if (config.testingE2E !== 'none') parts.push(`${TESTING_E2E_LABELS[config.testingE2E]} (E2E)`);
  return parts.join(' + ') || 'None';
}

function inferLanguage(config: StackConfig): string {
  const langs = new Set<string>();
  if (['nestjs', 'supabase', 'cloudflare'].includes(config.backend)) langs.add('TypeScript');
  if (['nextjs', 'astro', 'react-vite'].includes(config.frontend)) langs.add('TypeScript');
  if (config.backend === 'go') langs.add('Go');
  if (config.backend === 'python') langs.add('Python');
  if (config.backend === 'dotnet') langs.add('C#');
  return [...langs].join(' + ') || 'TypeScript';
}

function inferBuildCommands(config: StackConfig): string {
  const cmds: string[] = ['npm run build'];
  if (config.backend === 'go') cmds.push('go build ./...');
  if (config.backend === 'python') cmds.push('python -m build');
  if (config.backend === 'dotnet') cmds.push('dotnet build');
  return cmds.map((c) => `Bash(${c})`).join(',');
}

function inferTestCommands(config: StackConfig): string {
  const cmds: string[] = ['npm test', 'npm run test:*'];
  if (config.backend === 'go') cmds.push('go test ./...');
  if (config.backend === 'python') cmds.push('python -m pytest');
  if (config.backend === 'dotnet') cmds.push('dotnet test');
  if (config.testingE2E === 'playwright') cmds.push('npx playwright test');
  if (config.testingE2E === 'cypress') cmds.push('npx cypress run');
  return cmds.map((c) => `Bash(${c})`).join(',');
}

// ─── Skill Composition ─────────────────────────────────────────────────

/**
 * Compose a skill by copying the base SKILL.md with placeholder replacement
 * and the relevant stack-specific resources.
 */
async function composeSkill(
  skillName: string,
  config: StackConfig,
  replacements: Record<string, string>,
  targetDir: string,
): Promise<void> {
  // Determine which stack subdirectory to use
  let stackSubdir: string | undefined;
  if (skillName === 'backend-dev-guidelines') {
    stackSubdir = BACKEND_SKILL_STACKS[config.backend];
  } else if (skillName === 'frontend-dev-guidelines') {
    stackSubdir = FRONTEND_SKILL_STACKS[config.frontend];
  }

  // Copy base skill file with replacements
  const baseSkillContent = await readTemplate('skills', skillName, '_base', 'SKILL.md');
  if (baseSkillContent) {
    const composed = replacePlaceholders(baseSkillContent, replacements);
    await writeOutput(targetDir, path.join('skills', skillName, `${skillName}.md`), composed);
  }

  // Copy stack-specific resource files
  if (stackSubdir) {
    const resourceDir = templatePath('skills', skillName, '_stacks', stackSubdir);
    if (await fs.pathExists(resourceDir)) {
      await copyTemplateDir(
        path.join('skills', skillName, '_stacks', stackSubdir),
        targetDir,
        path.join('skills', skillName, 'resources'),
      );
    }
  }
}

// ─── Main Generator ────────────────────────────────────────────────────

export async function generate(config: StackConfig, targetDir: string): Promise<void> {
  const preset = await loadPreset(config.preset);
  const replacements = await buildReplacements(config);

  console.log(chalk.dim('Generating project configuration...\n'));

  // 1. Compose and write agent files
  for (const agentName of preset.agents) {
    // For frontend tester, we need the combined testing content
    let agentReplacements = { ...replacements };
    if (agentName === 'fe-tester') {
      // Frontend tester gets E2E + component testing content
      const e2eContent = config.testingE2E !== 'none'
        ? await loadStackContent(TESTING_STACK_PATH[config.testingE2E])
        : '';
      const componentTestKey = FRONTEND_TESTING_MAP[config.frontend];
      const componentContent = componentTestKey
        ? await loadStackContent(TESTING_STACK_PATH[componentTestKey])
        : '';
      agentReplacements = {
        ...agentReplacements,
        TESTING_STACK_INSTRUCTIONS: [componentContent, e2eContent].filter(Boolean).join('\n\n---\n\n')
          || '_No testing stack configured._',
      };
    }

    const composed = await composeAgent(agentName, config, agentReplacements);
    await writeOutput(targetDir, path.join('agents', `${agentName}.md`), composed);
    console.log(`  ${chalk.green('✓')} Agent: ${agentName}`);
  }

  // 2. Copy command files
  for (const commandName of preset.commands) {
    await copyTemplate(
      path.join('commands', `${commandName}.md`),
      targetDir,
      path.join('commands', `${commandName}.md`),
    );
    console.log(`  ${chalk.green('✓')} Command: ${commandName}`);
  }

  // 3. Compose and write skill files
  for (const skillName of preset.skills) {
    await composeSkill(skillName, config, replacements, targetDir);
    console.log(`  ${chalk.green('✓')} Skill: ${skillName}`);
  }

  // 4. Copy hook files
  for (const hookName of preset.hooks) {
    await copyTemplate(
      path.join('hooks', `${hookName}.sh`),
      targetDir,
      path.join('hooks', `${hookName}.sh`),
    );
    console.log(`  ${chalk.green('✓')} Hook: ${hookName}`);
  }
  if (preset.hooks.length > 0) {
    await copyTemplate(
      path.join('hooks', 'package.json'),
      targetDir,
      path.join('hooks', 'package.json'),
    );
  }

  // 5. Generate config files from templates
  // CLAUDE.md
  const claudeMdTemplate = await readTemplate('config', 'CLAUDE.md.template');
  if (claudeMdTemplate) {
    const claudeMd = replacePlaceholders(claudeMdTemplate, replacements);
    // Write to project root, not inside .claude/
    const claudeMdPath = path.join(targetDir, 'CLAUDE.md');
    await fs.ensureDir(path.dirname(claudeMdPath));
    await fs.writeFile(claudeMdPath, claudeMd, 'utf-8');
    console.log(`  ${chalk.green('✓')} Config: CLAUDE.md`);
  }

  // settings.json
  const settingsTemplate = await readTemplate('config', 'settings.json.template');
  if (settingsTemplate) {
    const settings = replacePlaceholders(settingsTemplate, replacements);
    await writeOutput(targetDir, 'settings.json', settings);
    console.log(`  ${chalk.green('✓')} Config: settings.json`);
  }

  // agent-registry.md
  const registryTemplate = await readTemplate('config', 'agent-registry.md.template');
  if (registryTemplate) {
    const registry = replacePlaceholders(registryTemplate, replacements);
    await writeOutput(targetDir, 'agent-registry.md', registry);
    console.log(`  ${chalk.green('✓')} Config: agent-registry.md`);
  }

  // Done
  console.log();
  console.log(chalk.green.bold('Done!'));
  console.log();
  console.log(`Your agent configuration has been generated in ${chalk.bold('.claude/')}`);
  console.log();
  console.log(chalk.dim('Next steps:'));
  console.log(`  1. Review the generated files in ${chalk.bold('.claude/')}`);
  console.log(`  2. Install the agentic-sdlc plugin: ${chalk.cyan('claude plugin add agentic-sdlc')}`);
  console.log(`  3. Customise CLAUDE.md with your project-specific details`);
  console.log(`  4. Start using agents: ${chalk.cyan('claude "Use @task-orchestrator to build feature X"')}`);
  console.log();
}
