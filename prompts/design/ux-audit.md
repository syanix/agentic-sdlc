---
name: UX Flow Audit
domain: design
complexity: medium
works-with: [ux-designer agent, /analyze command]
---

# UX Flow Audit

## When to Use

Use this prompt when you need to evaluate an existing user flow for friction points, accessibility gaps, and opportunities to improve task completion rates.

## The Prompt

Audit the user experience flow for **[FLOW_NAME]** where the user's primary goal
is to **[USER_GOAL]**.

The current flow has these steps:

[CURRENT_STEPS]

Known pain points or complaints:

[PAIN_POINTS]

For each step in the flow, evaluate:

1. **Clarity** - Is the user's next action obvious without instruction?
2. **Efficiency** - Can any steps be combined or eliminated?
3. **Error recovery** - What happens when the user makes a mistake?
4. **Feedback** - Does the system confirm progress at each stage?
5. **Accessibility** - Can the step be completed with keyboard, screen reader, or voice?

Produce a report with:

- A friction score (1-5) for each step
- Specific recommendations ranked by impact vs effort
- A revised flow diagram showing the optimised path
- Metrics to track improvement (task completion rate, time on task, error rate)

## Variations

### Onboarding Audit

Focus on first-time user experience. Pay special attention to time-to-value,
progressive disclosure of features, and the moment the user first achieves
[USER_GOAL]. Flag any step where the user might abandon the flow.

### Checkout Flow Audit

Focus on conversion-critical paths. Evaluate guest checkout availability,
form field count, payment friction, trust signals, and error handling for
failed payments. Measure drop-off between each step.

### Settings / Configuration Audit

Focus on discoverability and safe defaults. Check whether settings are
grouped logically, whether changes require confirmation, and whether the
user can undo or reset to defaults. Evaluate bulk operations support.

## Tips

- Measure **task completion rate** before and after changes to quantify impact
- Walk through the flow yourself before auditing - screenshots help identify
  issues that descriptions miss
- Look for "false floors" where users think they are done but are not
- Check behaviour on slow connections and older devices
- User friction often hides in transitions between steps, not within them
- Ask "what would happen if the user left mid-flow and came back tomorrow?"
- Prioritise fixes that reduce the total number of decisions the user must make
- Consider cultural and localisation factors that affect the flow

## Example Usage

```
Use the ux-designer agent with /analyze to run this audit:

/analyze --agent ux-designer --flow "account-registration"
```
