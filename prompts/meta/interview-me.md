---
name: Interview Me
domain: meta
complexity: low
works-with: [po agent, /feature command]
---

# Interview Me

## When to Use

Use this prompt when you need to gather requirements from a stakeholder through a structured interview, moving from broad exploration to specific priorities.

## The Prompt

Interview me to gather requirements for **[PROJECT_NAME]**, specifically
around **[FEATURE_AREA]**.

### Context

[CONTEXT]

Conduct the interview following this structure:

1. **Open exploration** (3-5 questions) - Ask broad, open-ended questions to
   understand the problem space, user needs, and business goals. Do not
   suggest solutions yet.

2. **Clarification** (3-5 questions) - Dig deeper into ambiguous areas.
   Ask "why" at least twice to get past surface-level requirements. Probe
   for edge cases, scale expectations, and integration points.

3. **Constraints** (2-3 questions) - Identify timeline, budget, technical
   limitations, regulatory requirements, and team capacity.

4. **Prioritisation** (2-3 questions) - Rank must-have vs nice-to-have.
   Identify what can be deferred and the minimum viable version.

5. **Summary and validation** - Present back a problem statement, user
   stories with acceptance criteria, out-of-scope items, and open questions.

Ask questions **one at a time**. Wait for my response before proceeding.
Adapt follow-up questions based on what I share.

## Variations

### Requirements Gathering

Focus on functional and non-functional requirements. Use a structured
template to capture each requirement with priority, acceptance criteria,
and dependencies. Flag requirements that conflict with each other.

### Technical Discovery

Focus on technical constraints, architecture decisions, and integration
points. Ask about existing infrastructure, data models, APIs, and
deployment environments. Identify technical risks early.

### User Research Synthesis

I have raw user research data (interview transcripts, survey results,
analytics). Help me synthesise it into actionable insights, personas,
and user journey maps. Ask me to share data in chunks and identify
patterns across multiple sources.

## Tips

- Ask one question at a time - multiple questions in one message overwhelm
- Start broad, then narrow - premature specificity misses important context
- Echo back what you hear to confirm understanding before moving on
- Watch for assumptions - ask "is that an assumption or a confirmed fact?"
- If the user is unsure, offer 2-3 options to react to rather than blank prompts
- Capture the "why" behind every requirement - it guides future trade-offs
- Note contradictions without judgement and revisit them in prioritisation
