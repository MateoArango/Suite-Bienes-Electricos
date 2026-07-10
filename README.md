# Bienes Electricos Playwright Tests

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

Current stable baseline observed locally:

```txt
63 passed using 4 workers Average 6 minutes
```
