---
name: Accessibility Review
domain: frontend
complexity: medium
works-with: [ux-designer agent, /review command]
---

# Accessibility Review Prompt

## When to Use

Use this prompt when you need to conduct a thorough WCAG 2.1 compliance review and produce actionable remediation steps.

## The Prompt

```
Perform a WCAG 2.1 [WCAG_LEVEL] accessibility review of [COMPONENT_OR_PAGE] built with [FRAMEWORK].

**Review checklist:**

1. **Perceivable:**
   - All images have meaningful alt text (or alt="" for decorative images)
   - Colour contrast meets minimum ratios (4.5:1 for normal text, 3:1 for large text at Level AA)
   - Information is not conveyed by colour alone
   - Text can be resized to 200% without loss of content or functionality
   - All video/audio content has captions or transcripts

2. **Operable:**
   - Every interactive element is reachable and operable via keyboard alone
   - Focus order follows a logical reading sequence
   - Focus is never trapped (except in modals, which must trap focus intentionally)
   - No content flashes more than 3 times per second
   - Page has a visible focus indicator that meets 3:1 contrast ratio
   - Skip navigation link is present and functional

3. **Understandable:**
   - Page language is declared via lang attribute on <html>
   - Form labels are persistent and visible (not placeholder-only)
   - Error messages identify the field and describe how to fix the problem
   - Navigation is consistent across pages
   - Unexpected context changes do not occur on focus or input

4. **Robust:**
   - HTML validates without errors that affect assistive technology
   - ARIA roles, states, and properties are used correctly
   - Custom components implement the correct WAI-ARIA design pattern
   - Content works across current versions of NVDA, VoiceOver, and JAWS

**Output format:**
For each issue found:
- WCAG criterion violated (e.g. 1.4.3 Contrast Minimum)
- Severity: critical (blocks access) | major (significant barrier) | minor (inconvenience)
- Element or component affected
- Current behaviour
- Required behaviour
- Code fix with before/after example

Group findings by WCAG principle (Perceivable, Operable, Understandable, Robust).
```

## Variations

### Screen Reader Audit
Add to the prompt:
```
Focus on the screen reader experience specifically:
- Read through the page using VoiceOver (macOS) or NVDA (Windows) commands
- Verify all landmarks are announced correctly
- Check that dynamic content updates are announced via aria-live regions
- Confirm form field labels, descriptions, and errors are read in the correct order
- Verify that modal dialogs announce their title and trap focus
- Check that custom widgets (tabs, accordions, comboboxes) announce their state changes
- List the full screen reader announcement sequence for the primary user flow
```

### Keyboard Navigation Audit
Add to the prompt:
```
Focus on keyboard accessibility:
- Map the complete Tab order for the page and flag any illogical jumps
- Verify all dropdown menus, modals, and popovers can be opened, navigated, and closed with keyboard
- Check that arrow keys work correctly in composite widgets (tabs, menus, tree views)
- Confirm Escape closes the topmost overlay
- Verify no keyboard shortcuts conflict with assistive technology shortcuts
- Test with keyboard only (no mouse) for the entire user journey: [USER_JOURNEY]
```

### Colour and Visual Audit
Add to the prompt:
```
Focus on colour and visual accessibility:
- Test all text/background combinations against WCAG [WCAG_LEVEL] contrast ratios
- Simulate colour vision deficiencies: protanopia, deuteranopia, tritanopia
- Verify the interface is usable in Windows High Contrast Mode
- Check that all interactive states (hover, focus, active, disabled) are distinguishable without colour
- Confirm dark mode (if present) maintains the same contrast standards
- Verify spacing and target sizes meet WCAG 2.5.8 (Target Size minimum 24x24px)
```

## Tips

- **Automated tools catch roughly 30% of issues.** axe-core, Lighthouse, and WAVE are essential starting points, but they cannot assess reading order, meaningful alt text, or keyboard flow. Manual testing is not optional.
- **Test with real assistive technology.** At minimum, test with VoiceOver on macOS and NVDA on Windows. Screen reader behaviour varies significantly -- what works in one may break in another.
- **Focus management is the most common failure.** When content appears dynamically (modals, toasts, route changes), focus must move to the new content. When it disappears, focus must return to a sensible location. Test every show/hide interaction.
- **Accessibility is not a separate task.** Bolting it on after development is five times more expensive than building it in. Review accessibility at the component level during development, not as a final gate before release.
