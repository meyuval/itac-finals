# Accessibility

The accessibility statement for the Stonewake dashboard and this documentation, on one page. The target is WCAG 2.1 level AA. The statement dates from 2 September 2026 and was updated on 12 October 2026.

## What is in place

- Colour and contrast come from one design system, where text colours are defined once and referenced by every component. Body and secondary text reach at least 5.6:1 against every surface, and the status colours at least 4.6:1 on their washes.
- Keyboard use. Interactive controls are native buttons and links, with no click handler on a plain container; keyboard focus is always visible, as a ring in the accent colour on the focused element or on the card hosting it; the entity digest, the full-screen network view and the first-run tour close with Escape.
- Assistive technology. Navigation, dialogs, status messages and icon-only controls carry ARIA roles and labels; polite live regions announce export and report outcomes; decorative icons are hidden from screen readers; the document language is declared, in English and German on this documentation.
- Transitions respect the reduced-motion preference.

## Known gaps

- No external accessibility audit has been carried out, and no automated accessibility check runs in our release gate yet.
- Many form fields are labelled by their visible placeholder and the surrounding text rather than a programmatic label.
- The network graph is drawn on a canvas and has no text alternative of the drawing itself; the underlying ownership and financing data is available in the entity profile cards.
- There is no link to skip to the content.

## Feedback

Report an accessibility problem to [contact@stonewake.ai](mailto:contact@stonewake.ai) with "Accessibility" in the subject, or through Report an issue in the dashboard sidebar.

See also [Security overview](/security-overview), [Enterprise onboarding](/enterprise-onboarding).
