---
name: Create Skill
domain: meta
complexity: medium
works-with: [architect agent, /feature command]
---

# Create Skill

## When to Use

Use this prompt when you need to create a reusable Claude Code skill that automates a specific workflow, code generation task, or review process.

## The Prompt

Create a Claude Code skill for **[SKILL_PURPOSE]** in the **[DOMAIN]** domain.

### Trigger Patterns

[TRIGGER_PATTERNS]

Design the skill following this structure:

1. **Skill metadata** - Define the skill file with:
   - A clear, descriptive name (2-4 words)
   - Domain category matching [DOMAIN]
   - Trigger patterns that match [TRIGGER_PATTERNS]
   - A one-sentence description of what the skill does

2. **Input gathering** - Determine what information the skill needs:
   - Required inputs (must be provided or prompted for)
   - Optional inputs (with sensible defaults)
   - Context it can infer from the environment (current file, git branch, etc.)

3. **Instruction body** - Write the core instructions that guide Claude:
   - Step-by-step workflow (numbered, sequential)
   - Decision points with clear criteria
   - Output format specification
   - Error handling and edge cases

4. **Progressive disclosure** - Structure the skill in layers:
   - Quick mode: minimum inputs, sensible defaults, fast results
   - Standard mode: full input gathering, thorough output
   - Expert mode: all options exposed, customisation available

5. **Validation** - Include self-check steps:
   - Verify outputs match the expected format
   - Check for common mistakes in generated content
   - Suggest follow-up actions when complete

## Variations

### Development Workflow Skill

Create a skill that automates a development workflow: code generation,
refactoring, migration, or deployment preparation. Focus on idempotency
(safe to run multiple times), clear progress indication, and rollback
guidance if something goes wrong.

### Code Generation Skill

Create a skill that generates code from specifications. Include template
selection logic, placeholder substitution, and post-generation validation.
Ensure generated code follows the project's existing conventions by
reading configuration files and nearby source files for style cues.

### Review / Audit Skill

Create a skill that reviews code, configuration, or documentation against
a checklist. Structure the output as a report with findings categorised
by severity. Include actionable fix suggestions for each finding. Support
both full review and focused review modes.

## Tips

- Keep trigger descriptions specific - vague triggers cause false matches
- Test against edge cases: empty projects, monorepos, non-standard structures
- Use the project's existing file patterns as context rather than hardcoding
- Include examples of good and bad invocations in the skill description
- Skills should be composable - design them to work with other skills
- Avoid skills that require interactive multi-turn input - gather upfront
- Document what the skill does NOT do to set clear expectations
- Keep the instruction body under 100 lines for maintainability
