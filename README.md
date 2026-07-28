# Bienes Eléctricos Playwright Test Suite

Welcome! This repository contains the Playwright end-to-end coverage for the main Bienes Eléctricos workflows: login, asset creation, asset editing, Excel import, and report export.

The suite currently discovers **117 tests in 31 spec files**. Every test has a stable QA ID and a short behavior-focused description, making it easier to find a scenario, understand its purpose, run it directly, and identify it in a Playwright report.

## Test documentation

The complete user-friendly test catalog is available in both languages:

- [Guía de pruebas en español](PLAYWRIGHT_TEST_GUIDE_ES.md)
- [English test guide](PLAYWRIGHT_TEST_GUIDE_EN.md)
- [Errores y mejoras para la próxima versión](NEXT_VERSION_IMPROVEMENTS.md)

Both guides use the same feature order and contain the ID, scenario, and expected result for every test. They describe the expected behavior, not a live pass/fail result. Blocked `test.fixme` scenarios and the heap-sensitive unfiltered export are clearly identified.

## Test IDs and descriptions

Every test must use `testMetadata` from `tests/helpers/testMetadata.ts` with a unique domain-scoped ID and a short description of the verified behavior.

```ts
test(
  'rejects an empty required field',
  testMetadata('QA-AREA-001', 'Blocks submission and displays the required-field validation.'),
  async ({ page }) => {
    // Test steps and assertions.
  },
);
```

The helper exposes the ID as the `@QA-AREA-001` Playwright tag and records both `test_id` and `description` annotations for reports. It also rejects an invalid ID format or an empty description during test discovery.

IDs must match `QA-AREA-001` and remain unique across the suite. To select one test by ID:

```powershell
npx playwright test --grep '@QA-AREA-001'
```

## Keeping tests and guides synchronized

When a test is added, renamed, or removed:

1. Assign or preserve its unique `QA-AREA-001` ID.
2. Keep its `testMetadata` description short and focused on observable behavior.
3. Update both language guides in the same change.
4. Run `npx playwright test --list` to verify discovery.
5. Check that the ID selects the expected test with `--grep`.

This keeps the source code, Playwright reports, and user documentation aligned.

## Stability Rules

These tests can run in parallel, but edit tests must avoid sharing mutable backend state.

- Prefer one owned `PLATE` per spec file.
- Keep mutation-heavy specs serial when tests inside the same file reuse the same `PLATE`.
- Avoid using the same high-traffic field across many specs, especially `Localidad`.
- Prefer optional, low-risk fields for edit/save tests, such as `Nombre planilla`, `Descripcion`, `Memorando`, `Enlace ARCGIS`, or similar fields.
- Always restore changed persisted data in a `finally` block.
- When a test changes backend data, assume another worker can collide unless the spec owns a different plate.

Example:

```ts
const PLATE = '00000542';

test.describe.configure({ mode: 'serial' });
```

Use `serial` only where the tests in that spec intentionally share the same record. Do not use `--workers=1` for the whole suite unless debugging, because it hides shared-state bugs and makes the suite slower.

## Useful Commands

Once cloned the repository, install npm (node)

```powershell
npm install
```
Install Playwright


```powershell
npx playwright install
```

List every discovered test without opening a browser:

```powershell
npx playwright test --list
```

Run one test by its QA ID:

```powershell
npx playwright test --grep '@QA-EDIT-001'
```

Run all tests:

```powershell
npx playwright test
```

Run all edit asset tests:

```powershell
npx playwright test editAsset
```

Debug shared-state issues with one worker:

```powershell
npx playwright test editAsset --workers=1
```

Historical baseline recorded before the current suite expansion:

```txt
63 passed using 4 workers Average 6 minutes
```

Treat this number as historical evidence, not the current result. Run the relevant suite when a fresh pass/fail baseline is required.
