# Tech Assessment — Cypress E2E Test Suite

An end-to-end test suite built with [Cypress](https://www.cypress.io/) for [demoqa.com](https://demoqa.com/), covering UI flows, API contracts, edge cases, and basic accessibility checks. The project follows a Page Object Model structure to keep tests clean and maintainable.

---

## What's being tested

| Spec | Tags | What it covers |
|---|---|---|
| `homePage.cy.js` | `@smoke` `@homePage` | Page title, header, footer, navigation cards, category routing |
| `formsAccordion.cy.js` | `@smoke` `@forms` | Practice form — required fields, full submission, edge cases (invalid email, short mobile) |
| `bookStore.cy.js` | `@smoke` `@bookStore` | Book list UI, search (happy path + edge cases), API contract, sidebar nav, accessibility |

---

## Project structure

```
cypress/
├── e2e/                  # Test specs
│   ├── homePage.cy.js
│   ├── formsAccordion.cy.js
│   └── bookStore.cy.js
├── fixtures/             # Static test data + API-seeded data
│   ├── books.json              ← generated at runtime from the BookStore API
│   ├── practiceFormData.json
│   ├── practiceFormDataRequired.json
│   └── practiceFormEdgeCases.json
├── pages/                # Page Object Model classes
│   ├── HomePage.js
│   ├── FormsPage.js
│   └── BookStorePage.js
├── support/
│   ├── commands.js       # Custom Cypress commands
│   ├── e2e.js            # Global setup
│   └── constants/        # Selectors, URLs, expected values
│       ├── homePages.js
│       ├── formsPage.js
│       └── bookStore.js
└── reports/              # HTML reports (generated after runs)
```

---

## Getting started

### Prerequisites

- Node.js 22+
- npm 11+

### Install dependencies

```bash
npm install
```

---

## Running tests

### Open Cypress in interactive mode

```bash
npm run cy:open
```

### Run the full test suite headlessly

```bash
npm run cy:run
```

### Run tests by tag

Uses [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) under the hood.

```bash
npm run cy:run:tag -- @smoke
npm run cy:run:tag -- @bookStore
npm run cy:run:tag -- @forms
```

---

## Code quality

### Lint

```bash
npm run lint         # check for issues
npm run lint:fix     # auto-fix what's fixable
```

### Format

```bash
npm run format         # format all files with Prettier
npm run format:check   # check formatting without writing
```

---

## Reports

After a headless run, an HTML report is generated in `cypress/reports/`. Open any `.html` file in your browser to see a full breakdown with test results, durations, and failure screenshots.

To clean up old reports before a new run:

```bash
npm run report:clean
```

---

## A few things worth knowing

- **Fixtures are seeded at runtime** — `books.json` is written by the `before()` hook in `bookStore.cy.js` via a live API call to `BookStore/v1/Books`. This keeps the fixture in sync with the actual API data on every run.
- **Page Objects live in `cypress/pages/`** — each class wraps selectors and interactions for one page, so tests stay readable and changes to the UI only need to be fixed in one place.
- **Constants live in `cypress/support/constants/`** — URLs, expected values, and field lists are kept out of test files to avoid magic strings scattered everywhere.
- **Tags are declared per `describe` block** — you can combine tags to narrow down what runs, e.g. `grepTags=@smoke+@bookStore` runs only tests that have both tags.

---

## CI/CD — GitHub Actions

The suite runs automatically on every push and pull request. The workflow lives at `.github/workflows/cypress.yml` and does the following: installs dependencies, runs the full headless suite, and uploads the HTML report as a downloadable artifact.

**Practical tips for scaling this in a real pipeline:**

- **Gate PRs on `@smoke` only** — run the full suite nightly, but keep PR feedback fast by running just the smoke tag: `npm run cy:run:tag -- @smoke`.
- **Parallelize with Cypress Cloud** — once the suite grows, split specs across machines using `cypress run --parallel --record`. Each machine picks up specs from a shared queue, cutting total run time proportionally.
- **Cache `node_modules`** — the `actions/setup-node` `cache: npm` already does this. For Cypress binary caching, add `~/.cache/Cypress` to the cache key to avoid re-downloading it on every run.
- **Run on multiple browsers** — add a matrix strategy (`chrome`, `firefox`, `edge`) if cross-browser coverage is required. Keep the matrix off the PR check and move it to a scheduled workflow to avoid slowing down the feedback loop.

---

## Recommendations for improvement

These are the things I'd prioritize if this suite were going into production.

**Test data**
- Replace hardcoded expected values (book titles, author names) with data driven from fixtures wherever possible — already done for the Book Store suite via the API-seeded `books.json`. Applying the same pattern to forms and other suites would reduce the risk of tests breaking on content changes.
- For authenticated flows, use `cy.session()` to cache login state and avoid repeating the login UI on every test. Store credentials in environment variables, never in source code.

**Suite organization**
- Group specs by feature domain rather than by page — as the app grows, a `bookStore/` folder with separate files for `bookStore.search.cy.js`, `bookStore.api.cy.js`, and `bookStore.auth.cy.js` scales better than one large file.
- Keep API-only tests (no `cy.visit`) in their own spec so they can be run independently and faster as a contract check before the UI suite.

**Tagging strategy**
- `@smoke` — critical happy paths, runs on every PR
- `@regression` — full suite, runs nightly or before releases
- `@api` — API contract tests, can run without a browser
- `@accessibility` — accessibility assertions, useful to track separately as a metric over time

**Metrics to track**
- **Pass rate trend** — a slowly declining pass rate on nightly runs usually signals flakiness creeping in before it becomes a problem.
- **Test duration per spec** — helps identify slow tests that should be split or optimized.
- **Flaky test rate** — Cypress Cloud tracks retries and flags consistently flaky tests. Worth enabling even on a small suite.
- **Coverage by tag** — knowing how many tests are tagged `@smoke` vs `@regression` keeps the pyramid healthy and makes it easy to argue for adding more coverage at the right level.

---

## Summary

### Approach

The goal was to build a maintainable, readable suite rather than just a collection of assertions. Every decision — Page Objects, constants files, fixture seeding, tagging — was made to answer the question: *"will someone who didn't write this be able to fix a failing test in under five minutes?"*

Tests are organized by feature and scenario, not just by page. Each `describe` owns a feature; each `context` describes the condition under which a group of tests runs. `it` blocks describe the expected outcome in plain English.

### Key design decisions

| Decision | Reasoning |
|---|---|
| Page Object Model | Decouples test logic from DOM selectors. A selector change only needs fixing in one file. |
| Constants files | Eliminates magic strings from test files, makes expected values searchable and reusable. |
| API-seeded fixtures | The `books.json` fixture is written fresh from the live API before tests run, so UI assertions always compare against real data rather than a snapshot that can go stale. |
| `@cypress/grep` tagging | Allows running a focused subset without maintaining separate config files or duplicating specs. |
| Separate API `describe` block | API contract tests don't need a browser. Keeping them separate allows running them independently and faster as a sanity check. |

### Trade-offs

- **Live API dependency** — seeding fixtures from the API means the suite has a network dependency even in what might look like a pure UI run. The upside is data accuracy; the downside is fragility if the API is down. A fallback static fixture could mitigate this.
- **No authenticated test flows** — the current suite only covers public pages. Adding `cy.session()`-based login would unlock testing the profile, book collection, and add-to-collection flows, which are the most business-critical parts of the Book Store feature.
- **Accessibility is structural, not a full audit** — the accessibility checks here verify things like `alt` text, button types, and link `href` attributes. A full audit would use `cypress-axe` to run automated WCAG checks on every page, which would catch contrast issues, ARIA misuse, and focus management problems that structural checks miss.

### Notable challenges

- **demoqa.com has ads and slow render times** — the `defaultCommandTimeout` is set to 30 seconds to absorb this. In a real project, a faster and more controlled test environment would be preferable.
- **The Book Store table changed** — the app previously used a ReactTable (`.rt-tbody`) but now renders a plain HTML `<table>`. This is a good example of why Page Objects pay off: the selector change only needed to be fixed in `BookStorePage.js`, not across every test that touches the table.
- **HTML5 validation vs custom CSS classes** — The Practice Form uses Bootstrap's native HTML5 validation (`:invalid` pseudo-class) rather than a custom `field-error` class. Initial assertions checking for a non-existent class had to be rewritten to use pseudo-class matching.
- **Date picker zero-padding inconsistency** — The datepicker renders days without leading zeros (`8`), but the submission modal displays them with leading zeros (`08`). Solution: use raw day values for form interaction and apply `padStart(2, '0')` only during validation assertions.
- **Fixture data field collision** — Using generic or overlapping values in test data (e.g., `lastName: "Mobile"`) caused selector collisions when searching for label values in the submission table. Fixed by ensuring unique, non-conflicting field values across all fixtures.
- **Test data separation for partial vs full submission** — Partial field submission tests and full field submission tests require separate fixture files to avoid conflicts. A shared fixture would cause one test suite to fail because it either omits required fields or adds unexpected optional fields.
- **Eager `cy.get()` evaluation in POM constructors** — Assigning `cy.get(selector)` directly to constructor properties causes Cypress to query the DOM immediately at object construction time. Since `new FormsPage()` is instantiated inside `beforeEach` (before navigating to the Practice Form), it threw `Expected to find element: #firstName, but never found it`. The fix was making all constructor properties lazy functions (`() => cy.get(selector)`) so the DOM query only fires when a method is actually called during a test step.

