# SkyLab — Autonomous Coding Agent Prompt

You are the autonomous coding agent working inside my VS Code workspace. I have attached `skylab-isa-atmosphere-explorer-brief.md`. Read the entire brief before doing anything. Treat it as the project specification and build the complete, working project in the current workspace.

## Operating mode — execute, do not just advise

- You are responsible for the implementation. Use your terminal and workspace tools to inspect, create, edit, and verify files yourself.
- Do not respond with code snippets for me to copy manually. Do not merely explain what I should do. Make the changes directly in the workspace.
- Work through the project in the brief's milestones, in order: page skeleton, altitude control, ISA calculations, unit toggle, density profile, then polish and documentation.
- Complete all milestones in this run. Do not stop after a milestone to ask me whether to continue. You may report brief progress updates, but keep working until the project is complete.
- Make sensible implementation decisions without asking routine questions. Ask me only if a genuine blocker requires information or access that you cannot obtain yourself (for example, GitHub authentication).
- Before changing anything, inspect the current directory and existing files. Preserve unrelated files and existing user work. Do not overwrite unrelated projects or delete files just to make the workspace clean.

## Resolve the technology-stack requirements

The attached brief's core requirement is a dependency-free website using plain HTML, CSS, and JavaScript that runs by opening `index.html`. Keep that requirement. The later UI/UX section mentions Tailwind and shadcn/ui, but the brief's compatibility note explains that these are not compatible with the required no-framework stack. Therefore:

- Do not add React, Tailwind, shadcn/ui, npm, a bundler, a package manager, external APIs, or runtime dependencies.
- Reproduce the design principles with semantic HTML, reusable CSS component classes, CSS custom properties/design tokens, and CSS Grid.
- Use a restrained dark neutral palette with one primary accent and functional success/error colors. Avoid generic gradients, especially purple/blue gradients. Define colors as centralized CSS variables rather than scattering literal color values through component rules.
- Use a clear type scale, strong heading hierarchy, muted secondary text, consistent spacing tokens, and responsive multi-column layouts that collapse appropriately on mobile.
- Avoid arbitrary one-off card styling, decorative clutter, fake data, and unnecessary animation. Respect `prefers-reduced-motion`.

## Implementation requirements

Follow the attached brief for the ISA equations, constants, supported altitude range, conversions, expected reference values, features, and limitations. In particular:

- Keep calculations internally in SI units. Convert values only for display.
- Implement and keep the calculation logic in readable, reusable functions. Add concise comments explaining the equations and conversions.
- Make the altitude slider update all result readouts and the selected point on the density profile immediately.
- Ensure the metric/imperial toggle changes presentation only, not the underlying physical values.
- Draw the density profile with lightweight SVG or Canvas; do not add a charting library.
- Include accessible labels, keyboard-operable controls, useful focus states, readable units, and responsive behavior.
- Clearly label the app as an educational ISA model, not live weather data or a flight-planning/safety-critical tool.
- Keep the project structure close to the brief: `index.html`, `styles.css`, `script.js`, and `README.md`. Add another file only when it materially improves maintainability and does not introduce dependencies.

## Work sequence — use commands and verify each stage

1. Inspect the workspace and available tools (including whether Git and, if useful, Node.js are installed). Check for existing files and Git status before editing.
2. Create or update the project files directly. Use terminal commands for file creation, inspection, and checks where appropriate; use your editing tools for precise code changes.
3. Build the page skeleton and responsive visual system.
4. Implement the altitude control and live altitude display.
5. Implement the ISA model and four metric readouts. Check the sea-level and 11,000 m expected values in the brief.
6. Implement unit conversion and verify that switching units and switching back preserves the same physical results, subject only to display rounding.
7. Implement the density profile, including axes, labels, and a selected-altitude marker that tracks the slider.
8. Complete accessibility, responsive behavior, reduced-motion handling, explanatory notes, and the README.
9. Run all relevant checks available in the environment. Check for JavaScript syntax errors, broken file references, missing assets, and console/runtime errors if a browser is available. Test at least the two reference altitudes and inspect a narrow mobile layout. Do not claim a test passed unless you actually ran it. If browser automation is unavailable, perform the strongest available static and calculation checks and state that limitation clearly.
10. Review the finished app against every requirement in the attached brief. Fix issues you find before declaring completion.

## Git and GitHub handling

- Inspect `git status` before making Git changes. Never discard, reset, or overwrite existing user changes.
- Do not create fake activity, empty commits, date-manipulated commits, or commits for trivial command execution.
- If this project is already in a Git repository, make genuine milestone commits containing only the files for this project, using clear messages. Do not stage unrelated files.
- If there is a configured `origin` remote and the current branch is appropriate, you may push the genuine milestone commits after checking that no unrelated changes will be included. Do not change the remote URL or branch without permission.
- If Git is not initialized, do not invent a GitHub repository URL or credentials. Finish the project first, then tell me the exact commands needed to initialize, connect, commit, and push it. If a push is blocked by authentication or missing remote configuration, do not pretend it succeeded; finish all local work and report the precise blocker and next command.
- Never commit secrets, tokens, credentials, `.env` files, or machine-specific files.

## Completion report

When the work is actually finished, give me a concise report containing:

1. What you built.
2. The files you created or modified.
3. The checks you actually ran and their results.
4. How to open and use the app locally.
5. Git commit/push status, including any exact remaining command I must run because of missing GitHub authentication or repository setup.
6. Any known limitations or unverified behavior.

Do not claim the project is complete while required features are missing. Do not stop at a plan or a code sample. Execute the full implementation now, milestone by milestone, in the workspace.
