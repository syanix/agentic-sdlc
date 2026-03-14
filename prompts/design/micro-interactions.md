---
name: Micro-interactions
domain: design
complexity: medium
works-with: [ux-designer agent, /feature command]
---

# Micro-interactions

## When to Use

Use this prompt when designing and implementing UI animations and micro-interactions that provide feedback, communicate state changes, or guide user attention.

## The Prompt

Design and implement micro-interactions for **[INTERACTION_TYPE]** triggered
by **[TRIGGER]** using **[ANIMATION_LIBRARY]**.

### Performance Budget

[PERFORMANCE_BUDGET]

Follow these principles for each micro-interaction:

1. **Purpose** - Every animation must communicate something: confirmation,
   state change, spatial relationship, or feedback. Never animate purely
   for decoration.

2. **Timing** - Use appropriate durations:
   - Feedback (button press, toggle): 100-200ms
   - State transitions (expand, collapse): 200-350ms
   - Page transitions: 300-500ms
   - Never exceed 500ms for UI animations

3. **Easing** - Use natural easing curves:
   - Entering elements: ease-out (decelerate)
   - Exiting elements: ease-in (accelerate)
   - State changes: ease-in-out
   - Avoid linear easing for UI elements

4. **Properties** - Only animate `transform` and `opacity` for 60fps
   performance. Avoid animating `width`, `height`, `top`, `left`, or
   other layout-triggering properties.

For [INTERACTION_TYPE], deliver:

- Animation specification (duration, easing, properties, keyframes)
- Implementation code using [ANIMATION_LIBRARY]
- Fallback behaviour for `prefers-reduced-motion`
- Performance profile showing frame rate impact

## Variations

### Feedback Animations

Design micro-interactions that confirm user actions: button clicks, form
submissions, toggle switches, drag-and-drop placement. Each should provide
immediate visual feedback (under 100ms response time). Include success,
error, and loading states. Haptic feedback specifications for mobile.

### State Transitions

Design animations for component state changes: accordion expand/collapse,
modal open/close, tab switching, sidebar toggle. Focus on spatial continuity
so users understand where content comes from and goes to. Use shared element
transitions where elements persist across states.

### Loading States

Design skeleton screens, progress indicators, and content placeholder
animations. Avoid spinners where possible - use progressive loading that
shows content structure. Include optimistic UI patterns where the interface
updates before server confirmation.

## Tips

- Always implement `prefers-reduced-motion: reduce` - use instant state changes
- Test on low-end devices - smooth on your machine may stutter on budget phones
- Use `will-change` sparingly and remove it after animation completes
- Measure with browser DevTools Performance tab - aim for consistent 60fps
- Stagger list animations (30-50ms delay between items) for a polished feel
- Keep the total animation budget under [PERFORMANCE_BUDGET] per interaction
- Use CSS animations over JavaScript when possible for better performance
- Consider colour-blind users when using colour transitions as feedback
