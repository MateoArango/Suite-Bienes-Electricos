# exportAsset – Generate Report (XLS) Playwright Test Plan

## Application Overview

Evidence basis and scope

This plan covers the Generate report drawer reached from the download icon on the electrical-asset dashboard. Every scenario starts from a fresh browser context and must be independently runnable.

Repository references:
- tests/seed.spec.ts — seed/style baseline: BasePage login, download-icon entry, generateReport* test IDs, ANTIOQUIA/ABEJORRAL selection, submit, and success toast. The file currently has local user modifications and must not be overwritten.
- tests/pages/ExportAssetPage.ts — currently empty; later generation should define the page object here using the stable generateReport* selectors below.
- tests/pages/BasePage.ts — login helper and calendar-selection helper.
- tests/fixtures.ts — authenticated API fixtures and animation suppression; API base is https://bieneselectricosapi-qa.adacsc.co.
- playwright.config.ts — UI base URL, Chromium project, 60 s test timeout, 15 s action timeout, 30 s navigation timeout.
- specs/README.md — test plans live under specs/.

Live UI and route:
- Entry: dashboard download icon.
- Drawer route/title: /dashboard/bienelectrico/generar-reporte, “Generar reporte”.
- Closing returns to /dashboard/bienelectrico.
- Stable selectors observed: generateReportForm, generateReportDatesContainer, generateReportStartDate, generateReportEndDate, generateReportDepartamentoSelect, generateReportMunicipioSelect, generateReportLocationContainer, generateReportLicensePlateInput, generateReportStateSelect, generateReportGroupSelect, generateReportActionsContainer, generateReportCancelButton, generateReportClearButton, generateReportSubmitButton.
- Municipality starts disabled and becomes enabled after department selection.
- Department and municipality are multi-selects with “Todos”; state and group are single-selects with “Ninguno”.
- Calendar disables dates after the current day.

Observed API contract:
- GET /electrical-assets/report/departments?sortDirection=asc
- GET /electrical-assets/report/cities, then GET /electrical-assets/report/cities?departmentIds=<code> (repeated query keys for multiple departments)
- GET /electrical-assets/report/grupos
- GET /electrical-assets/report/estados
- POST /electrical-assets/report/electrical-assets/excel
- POST JSON keys: fechaInicial, fechaFinal, departamentos, municipios, estado, grupo, placa.
- Successful export: status 200, XLSX MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, timestamped filename reporte-bienes-electricos-YYYYMMDD-HHmmss.xlsx, and success toast “Reporte generado correctamente”.
- Observed lookup mappings include ANTIOQUIA code 05, ARAUCA code 81, ABEJORRAL code 002; status Activo code A; group Bodegas code 603.
- Seed regression risk: typing 21/7/2026 left the end-date control invalid and the observed POST sent fechaFinal as an empty string, yet the UI still showed success. Calendar selection made the same date control valid. Tests must assert semantic date validity and payload, not toast alone.
- Lookup data currently contains duplicate display labels in cities and groups. Automation must select unambiguous options or identify options by backing code/API reconciliation.

Automation guidance:
- Use Promise.all([page.waitForResponse(...), page.waitForEvent('download'), submit.click()]) where the UI emits a browser download; otherwise capture the POST response and validate headers/body.
- Treat the POST response and downloaded workbook as the primary success oracle; the toast alone is insufficient.
- Avoid fixed sleeps. Wait for lookup responses, municipality enabled state, spinner/button state, toast, and download events.
- Do not share downloaded paths across parallel workers; use testInfo.outputPath().
- For workbook content assertions, use a spreadsheet reader rather than treating XLSX as text.

## Test Scenarios

### 1. Navigation, initial state, and selector contract

**Seed:** `tests/seed.spec.ts`

#### 1.1. opens the Generate report drawer from the dashboard

**File:** `tests/exportAsset/navigation.spec.ts`

**Steps:**
  1. From a fresh context, log in with BasePage.login and wait for the electrical-asset dashboard to finish loading.
    - expect: The dashboard URL is /dashboard/bienelectrico and the inventory table is visible.
  2. Click the header button containing the download icon.
    - expect: The URL becomes /dashboard/bienelectrico/generar-reporte.
    - expect: A complementary drawer headed “Generar reporte” is visible.
    - expect: The underlying inventory remains visible and no data is mutated.
  3. Assert every generateReport* test ID listed in the overview.
    - expect: Each selector resolves exactly once inside the drawer/form.
    - expect: Buttons are named Cancelar, Limpiar filtros, and Generar reporte (XLS).

#### 1.2. shows a blank fresh form with the correct enabled states

**File:** `tests/exportAsset/navigation.spec.ts`

**Steps:**
  1. Open the drawer in a fresh context without carrying state from another test.
    - expect: Both date inputs and the plate input are empty.
    - expect: Department, state, and group are empty and enabled.
    - expect: Municipality is empty and aria-disabled=true.
    - expect: No validation message or success/error toast is present.
  2. Inspect the action controls.
    - expect: Cancel, clear, and submit are keyboard-focusable and enabled according to the product contract.
    - expect: No network export request has occurred merely by opening the drawer.

#### 1.3. closes with Cancel without persisting draft values

**File:** `tests/exportAsset/navigation.spec.ts`

**Steps:**
  1. Open the drawer, populate several filters, then click Cancelar.
    - expect: The drawer closes and URL returns to /dashboard/bienelectrico.
    - expect: No export POST is sent.
  2. Reopen the drawer.
    - expect: All filters are blank and municipality is disabled.
### 2. Lookup data and dependent filters

**Seed:** `tests/seed.spec.ts`

#### 2.1. loads report lookup APIs with authorization and renders their values

**File:** `tests/exportAsset/lookups.spec.ts`

**Steps:**
  1. Open the drawer while recording report lookup requests.
    - expect: Departments, cities, groups, and states endpoints return 200.
    - expect: Requests include an authorization header without exposing the token in test output.
    - expect: Departments request includes sortDirection=asc.
  2. Open each select.
    - expect: Department is alphabetically ordered and includes Todos.
    - expect: State includes Ninguno plus Activo, Baja o Devolucion, Descargo, Inactivo, Malo, Reintegro Bodega, Reparacion, and Uso.
    - expect: Group includes Ninguno and API-backed group descriptions.

#### 2.2. enables and filters municipalities for one department

**File:** `tests/exportAsset/dependentFilters.spec.ts`

**Steps:**
  1. Assert municipality is disabled, then select ANTIOQUIA.
    - expect: A GET cities?departmentIds=05 request succeeds.
    - expect: Municipality becomes enabled only after the response is usable.
  2. Open Municipality.
    - expect: Todos and ANTIOQUIA municipalities such as ABEJORRAL are shown.
    - expect: Municipalities belonging only to unselected departments are absent.
  3. Select ABEJORRAL.
    - expect: Department displays ANTIOQUIA and Municipality displays ABEJORRAL.

#### 2.3. supports multiple departments and sends repeated departmentIds

**File:** `tests/exportAsset/dependentFilters.spec.ts`

**Steps:**
  1. Select ANTIOQUIA and ARAUCA in the department multi-select.
    - expect: Both selections remain displayed.
    - expect: The city lookup URL contains departmentIds=05&departmentIds=81.
  2. Open Municipality and choose one city from each selected department.
    - expect: The municipality options are the union of both department results and accept multiple selections.
    - expect: The selected municipal codes can later be reconciled to the POST payload.
  3. Deselect one department.
    - expect: Cities from the removed department and any now-invalid municipality selections are removed; stale codes are not submitted.

#### 2.4. implements Todos and Ninguno semantics without contradictory selections

**File:** `tests/exportAsset/dependentFilters.spec.ts`

**Steps:**
  1. Select Todos in Department, then attempt to select or deselect individual departments.
    - expect: The UI has one deterministic all-selection state and does not display contradictory values.
    - expect: Municipality behavior matches the all-departments contract.
  2. Select Todos in Municipality after choosing a department.
    - expect: The payload represents all municipalities deterministically, without duplicate codes.
  3. Select a state/group and then choose Ninguno.
    - expect: The visible choice clears and the export payload uses null for that field.

#### 2.5. handles duplicate lookup labels without losing backing-code identity

**File:** `tests/exportAsset/lookups.spec.ts`

**Steps:**
  1. Stub group and city responses with two records sharing the same display label but different codes, matching duplicate patterns observed in QA.
    - expect: The UI remains usable and does not crash or silently collapse distinct records unless product requirements explicitly deduplicate them.
  2. Select each duplicate record in separate independent runs and submit.
    - expect: The POST uses the code corresponding to the selected record.
    - expect: Tests do not rely on an ambiguous getByRole(option, {name}) without exact disambiguation.

#### 2.6. clears every filter and restores dependent-control state

**File:** `tests/exportAsset/dependentFilters.spec.ts`

**Steps:**
  1. Populate start/end dates, two departments, municipalities, plate, status, and group.
    - expect: All values are visibly populated.
  2. Click generateReportClearButton.
    - expect: All inputs/selects become empty.
    - expect: Municipality returns to aria-disabled=true.
    - expect: Validation state is clean, no export POST occurs, and the drawer remains open.

### 3. Date and plate validation

**Seed:** `tests/seed.spec.ts`

#### 3.1. accepts calendar-selected boundary dates and blocks future dates

**File:** `tests/exportAsset/validation.spec.ts`

**Steps:**
  1. Open the start and end calendars.
    - expect: Calendar controls have accessible labels and dates through today are enabled.
    - expect: Tomorrow and later dates, plus the next-month navigation when appropriate, are disabled.
  2. Select the earliest supported start boundary and today as end date through the calendar.
    - expect: Both controls are valid and the form serializes dates as dd/MM/yyyy in the API payload.

#### 3.2. rejects invalid typed dates and never reports false success

**File:** `tests/exportAsset/validation.spec.ts`

**Steps:**
  1. Type invalid values independently: impossible day/month, malformed text, and a future date; blur each field.
    - expect: The affected control is aria-invalid=true or has an equivalent visible error.
    - expect: Generate Report is disabled or clicking it sends no export POST.
    - expect: No success toast/download occurs.
  2. Reproduce the seed-risk value by typing 21/7/2026 in the end-date input in the locale used by the test runner.
    - expect: If invalid, the UI clearly reports the error and does not silently serialize fechaFinal as an empty string.
    - expect: This test fails if an invalid field is omitted while a success toast is shown.
  3. Correct the date using the calendar.
    - expect: The control becomes valid and the corrected non-empty date is sent.

#### 3.3. validates start/end ordering and equal-date boundary

**File:** `tests/exportAsset/validation.spec.ts`

**Steps:**
  1. Set start date after end date.
    - expect: A clear validation error is shown and no export POST/download succeeds.
  2. Set start date equal to end date.
    - expect: The one-day range is accepted unless the documented business rule says otherwise; the POST contains equal normalized dates.
  3. Test blank start only, blank end only, and both blank in independent runs.
    - expect: Optional-date behavior is consistent and blank values serialize as empty strings only when intentionally permitted.

#### 3.4. preserves plate identifiers and safely handles boundary input

**File:** `tests/exportAsset/validation.spec.ts`

**Steps:**
  1. Enter a known plate with leading zeros, for example 00000109, and submit a mocked successful export.
    - expect: The plate remains a string with leading zeros and POST placa is exactly 00000109.
  2. Test whitespace-only, surrounding whitespace, very long input, Unicode, quotes, and script-like text in independent mocked runs.
    - expect: The control enforces documented length/character rules or safely transports normalized text.
    - expect: No script executes, UI crash occurs, or unbounded request is sent.
    - expect: Validation failures produce no success toast.

### 4. Export request, download, content, and failures

**Seed:** `tests/seed.spec.ts`

#### 4.1. exports an XLSX with three filters and an exact API payload

**File:** `tests/exportAsset/exportContract.spec.ts`

**Steps:**
  1. Select department ANTIOQUIA, municipality ABRIAQUÍ, and plate 00000502.
    - expect: The three controls display the intended values.
  2. Start response/download waits before clicking generateReportSubmitButton.
    - expect: Exactly one POST is made to /electrical-assets/report/electrical-assets/excel.
    - expect: JSON contains only fechaInicial, fechaFinal, departamentos, municipios, estado, grupo, and placa.
    - expect: Department is 05, municipality is 004, plate preserves 00000502, and unused filters retain their canonical empty values.
  3. Validate the response and saved download.
    - expect: Status is 200.
    - expect: Content-Type is the XLSX MIME.
    - expect: Content-Disposition filename matches reporte_YYYY-MM-DD_HH.mm.xlsx.
    - expect: The downloaded workbook contains plate 00000502, external plate 0RED1650-199, and article name Redes.
    - expect: “Reporte generado correctamente” appears only after success.

#### 4.2. exports with no optional filters using the canonical empty payload

**File:** `tests/exportAsset/exportContract.spec.ts`

**Steps:**
  1. Open a fresh blank drawer and submit through the real export API.
    - expect: Payload is fechaInicial:'', fechaFinal:'', departamentos:[], municipios:[], estado:null, grupo:null, placa:''.
    - expect: A valid XLSX response downloads and can be parsed.

#### 4.3. downloaded workbook contains rows consistent with the filters

**File:** `tests/exportAsset/workbook.spec.ts`

**Steps:**
  1. Export a narrowly filtered known plate/location/status using controlled or seeded data and parse the workbook with a spreadsheet reader.
    - expect: Workbook opens without corruption, has at least one worksheet, and required column headers are present.
  2. Inspect every exported data row.
    - expect: Rows satisfy the selected plate, department, municipality, status, group, and inclusive date-range constraints.
    - expect: Leading zeros and date/cell types are preserved as required.
    - expect: No unrelated record or internal-only secret appears.

#### 4.4. shows no-data feedback and does not create a misleading file

**File:** `tests/exportAsset/errorHandling.spec.ts`

**Steps:**
  1. Use a unique non-existent plate or stub the export endpoint with the documented no-data response.
    - expect: The user sees “No hay datos para exportar con los filtros enviados” or the current documented equivalent.
    - expect: No success toast appears.
    - expect: No empty/corrupt download is accepted as success.

#### 4.5. handles lookup endpoint failures and recovery

**File:** `tests/exportAsset/errorHandling.spec.ts`

**Steps:**
  1. Independently stub departments, cities, states, and groups with 401/403, 500, timeout, and malformed JSON.
    - expect: Affected controls do not expose stale values and the drawer remains stable.
    - expect: A user-visible error or retry affordance appears according to the product contract.
    - expect: Submit cannot silently use stale/undefined codes.
  2. Retry or reopen after restoring a 200 response.
    - expect: Lookup data becomes usable without requiring a new browser context and without duplicated options.

#### 4.6. handles export 4xx, 5xx, timeout, disconnect, and malformed binary

**File:** `tests/exportAsset/errorHandling.spec.ts`

**Steps:**
  1. For each failure mode, stub the POST and submit a valid form.
    - expect: No success toast is shown.
    - expect: No failed response is saved as a valid XLSX.
    - expect: A clear error message appears and the populated filters remain available for retry.
  2. Restore a successful POST and retry once.
    - expect: Exactly one retry request occurs and one valid file downloads.
    - expect: The drawer does not accumulate duplicate toasts or handlers.

#### 4.7. prevents duplicate exports during a slow request

**File:** `tests/exportAsset/errorHandling.spec.ts`

**Steps:**
  1. Delay a mocked successful export response and rapidly click submit multiple times.
    - expect: The UI indicates progress and prevents repeated submission.
    - expect: Only one POST and one download occur.
  2. Resolve the response.
    - expect: Progress ends, one success toast appears, and controls return to a usable state.

#### 4.8. enforces authentication and report permissions

**File:** `tests/exportAsset/accessControl.spec.ts`

**Steps:**
  1. Navigate directly to /dashboard/bienelectrico/generar-reporte in a fresh unauthenticated context.
    - expect: The user is redirected to login or denied; report UI and data are not exposed.
  2. Use an authenticated identity without export permission, if available.
    - expect: The download entry is hidden/disabled or the route/API returns 403 with clear feedback.
    - expect: No file downloads.
  3. Expire authentication during an open drawer and submit.
    - expect: The app handles 401 consistently, clears protected state as required, and never reports export success.
