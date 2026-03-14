---
name: Form Handling
domain: frontend
complexity: high
works-with: [ux-designer agent, /feature command]
---

# Form Handling Prompt

## When to Use

Use this prompt when you need to build a robust form with multi-step flow, validation, error handling, and accessible feedback.

## The Prompt

```
Create a [FORM_PURPOSE] form using [FRAMEWORK] with the following specification:

**Form fields:**
[FIELDS]

**Validation rules:**
[VALIDATION_RULES]

**Form behaviour:**
1. Validate on blur for individual fields, validate all on submit
2. Show inline error messages directly below the invalid field
3. On submit failure, move focus to the first invalid field and announce the error count to screen readers via a live region
4. Disable the submit button while a submission is in flight (show a spinner)
5. Preserve form data if the user navigates away and returns (sessionStorage)
6. Debounce async validations (e.g. username availability) by 400ms
7. Support both keyboard (Enter to submit) and mouse submission

**Accessibility requirements:**
- Every field must have a visible <label> element (no placeholder-only labels)
- Error messages must be linked via aria-describedby
- Required fields must use aria-required="true" and a visual indicator
- Group related fields with <fieldset> and <legend>
- Form progress (for multi-step) must be announced to screen readers

**Error UX:**
- Inline errors appear immediately after blur validation fails
- A summary banner appears above the form on submit with failed fields as anchor links
- Errors clear as soon as the user corrects the input (validate on change after first blur)

**Submission:**
- POST to [API_ENDPOINT] with JSON body
- Handle 422 (validation), 429 (rate limit), and 5xx (server error) responses distinctly
- Show a success confirmation with a clear next action

Generate the form component, validation logic, and unit tests for all validation rules.
```

## Variations

### Multi-Step Wizard
Add to the prompt:
```
Split the form into [STEP_COUNT] steps:
[STEP_BREAKDOWN]

Additional requirements:
- Show a progress indicator with step names (not just numbers)
- Validate each step before allowing progression to the next
- Allow backward navigation without losing entered data
- Persist current step and data in URL params or sessionStorage
- Final step shows a review summary of all entered data before submission
```

### Inline Editing Form
Add to the prompt:
```
This form uses inline editing (click to edit, not a separate form page):
- Display values as plain text by default with an edit icon
- Clicking a value transforms it into an editable field with save/cancel buttons
- Only one field should be editable at a time
- Save on Enter, cancel on Escape
- Show optimistic updates with rollback on server error
```

### Search and Filter Form
Add to the prompt:
```
This is a search and filter form. Adjust behaviour:
- No explicit submit button -- filters apply as the user changes them
- Debounce text inputs by 300ms before applying
- Sync all filter values to URL query parameters for shareable state
- Show active filter count and a "Clear all" button
- Preserve filter state across page navigation using the URL
```

## Tips

- **Never rely solely on colour for error states.** Add an icon, bold text, or a border change alongside the red colour. Approximately 8% of men have some form of colour vision deficiency.
- **Test with a password manager.** Autofill can break custom form controls. Use standard `<input>` types and `autocomplete` attributes so password managers and browsers can fill fields correctly.
- **Validate on the server too.** Client-side validation is a UX convenience, not a security measure. Every rule you enforce in the browser must also be enforced on the API.
- **Keep form state close to the form.** Resist the urge to put form state in global state management. Use a form library (React Hook Form, Formik, VeeValidate) or local component state. Global state is for data that outlives the form.
