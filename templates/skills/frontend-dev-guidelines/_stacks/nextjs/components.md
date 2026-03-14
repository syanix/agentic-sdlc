# Next.js Component Patterns

## Shadcn/ui Integration and Customisation

- Install components individually via `npx shadcn@latest add <component>`
- Components are copied into `components/ui/` as source code you own and can modify
- Customise styles by editing the component source directly, not via wrapper overrides
- Extend Tailwind theme in `tailwind.config.ts` to match design system tokens
- Use CSS variables defined in `globals.css` for consistent theming and dark mode support
- Prefer composing Shadcn primitives into domain-specific components over modifying base components

---

## Component Library Structure

```
components/
  ui/                    # Shadcn/ui base components (Button, Input, Card, etc.)
  forms/                 # Form-specific components (FormField, FormSection)
  data-display/          # Tables, lists, stat cards
  feedback/              # Toasts, alerts, progress indicators
  navigation/            # Sidebar, breadcrumbs, pagination
  layout/                # Page wrappers, section containers
  [feature]/             # Feature-specific composite components
```

- Keep `ui/` for atomic, reusable primitives only
- Build feature components by composing `ui/` primitives
- Co-locate feature-specific components with their route when they are not shared
- Export shared components from a barrel file for clean imports

---

## Client-Side Interactivity Patterns

- Mark interactive components with `'use client'` at the top of the file
- Keep Client Components as small and leaf-level as possible
- Extract interactive parts into separate Client Components; keep the parent as a Server Component
- Pass server-fetched data as props to Client Components rather than re-fetching on the client
- Use `useCallback` and `useMemo` judiciously: only when profiling reveals performance issues

---

## Form Components with react-hook-form and Zod

- Define Zod schemas for all forms; derive TypeScript types with `z.infer<>`
- Use `useForm` with `zodResolver` for integrated validation
- Build reusable `FormField` wrappers that connect Shadcn inputs to react-hook-form
- Display validation errors inline using Shadcn's `FormMessage` component
- Handle server-side errors by mapping them to field-level errors with `setError()`
- Submit forms via Server Actions or API calls from the `onSubmit` handler

```typescript
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '', name: '' },
});
```

---

## Data Tables with Sorting, Filtering, and Pagination

- Use `@tanstack/react-table` for headless table logic
- Build the table UI with Shadcn's `Table` components
- Implement column definitions with type-safe accessors
- Support server-side sorting, filtering, and pagination via URL search parameters
- Sync table state with the URL for shareable, bookmarkable views
- Show loading skeletons during data transitions
- Provide empty states with clear messaging and optional call-to-action

---

## Modal and Dialog Patterns

- Use Shadcn's `Dialog` component for modal interactions
- Control dialog open state via URL search parameters for shareable modals, or local state for ephemeral ones
- Render dialog content lazily: only mount when open to avoid unnecessary data fetching
- Implement confirmation dialogs for destructive actions (delete, discard changes)
- Trap focus within the dialog and return focus on close
- Support Escape key dismissal and backdrop click dismissal
- Avoid nesting dialogs; use a stepped flow within a single dialog instead

---

## Toast and Notification Patterns

- Use Shadcn's `Sonner` integration or `Toast` component for notifications
- Trigger toasts from Server Actions by returning status in the action result
- Use appropriate variants: `success`, `error`, `warning`, `info`
- Position toasts consistently (bottom-right is conventional)
- Auto-dismiss success toasts (3-5 seconds); persist error toasts until dismissed
- Include an action button in toasts when an undo or follow-up action is available
- Avoid showing duplicate toasts for the same event

---

## Loading States and Skeletons

- Use Shadcn's `Skeleton` component to match the shape of expected content
- Show skeletons immediately; avoid empty screens or spinner-only states
- Match skeleton dimensions to actual content dimensions to prevent layout shift
- Use `loading.tsx` for route-level loading states
- Wrap individual async components in `<Suspense fallback={<Skeleton />}>` for granular loading
- Implement optimistic UI updates to skip loading states for common mutations
- Show inline loading indicators (spinners on buttons) for user-initiated actions
