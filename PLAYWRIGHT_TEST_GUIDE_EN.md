# Playwright Test Guide

This guide covers the 117 tests discovered in 31 files. It describes what each test is expected to verify; it is not a report of the latest execution result. Every test is implemented and active unless marked as `test.fixme`.

To run one test by ID:

```powershell
npx playwright test --grep '@QA-AUTH-001'
```

To inspect the inventory without opening a browser:

```powershell
npx playwright test --list
```

### Login

Source: `tests/login/loginPortal.spec.ts`

| ID | Scenario | Expected result |
|---|---|---|
| QA-AUTH-001 | Valid login | The user authenticates and reaches the dashboard. |
| QA-AUTH-002 | Incorrect password | The credentials are rejected and the authentication error appears. |
| QA-AUTH-003 | Empty username | The continue action remains disabled. |
| QA-AUTH-004 | Empty password | The login action remains disabled. |
| QA-AUTH-005 | Invalid username | Access is rejected even with the valid test password. |

### Create Asset

Sources: `tests/createAsset/*.spec.ts`

| ID | Scenario | Expected result |
|---|---|---|
| QA-CREATE-000 | Complete creation flow | Every step is completed and the asset is registered successfully. |
| QA-CREATE-001 | Create with required fields only | The asset is created after required Location values are completed and optional steps remain empty. |
| QA-CREATE-002 | Create without selecting a plate | Final creation is blocked and plate validation appears. |
| QA-CREATE-003 | Location without Departamento | Progress remains blocked while Departamento is missing. |
| QA-CREATE-004 | Location without Municipio | Progress remains blocked while Municipio is missing. |
| QA-CREATE-005 | Location without Fotos | Progress remains blocked while the required Fotos link is missing. |
| QA-CREATE-006 | Location without ARCGIS link | Progress remains blocked while the required ARCGIS link is missing. |
| QA-CREATE-007 | Empty optional fields | Progress is allowed when required Location values are complete. |
| QA-CREATE-008 | Fotos maximum length | The field accepts 200 characters and discards the additional character. |
| QA-CREATE-009 | ARCGIS maximum length | The field accepts 100 characters and discards the additional character. |
| QA-CREATE-010A | Financial valuation limits | The evaluated fields reject a sixth character. |
| QA-CREATE-010B | Machine-feature limits | The evaluated fields reject a sixth character. |
| QA-CREATE-010C | Support-height limit | Altura apoyo rejects a sixth character. |
| QA-CREATE-010D | Driver and network limits | The evaluated fields reject a sixth character. |
| QA-CREATE-011 | Invalid characters in masked inputs | Characters outside each accepted format are ignored. |
| QA-CREATE-012 | Fotos limit when typing and pasting | The same maximum is applied to keyboard and clipboard input. |
| QA-CREATE-013 | Manual typing in date fields | Date inputs reject direct keyboard entry. |
| QA-CREATE-014 | Calendar date selection | Each date field is populated correctly through its calendar. |
| QA-CREATE-015 | Step shown after plate selection | The stepper displays Location and its correct sub-step. |
| QA-CREATE-016 | Field counter | The counter tracks populated values independently from required validity. |
| QA-CREATE-017 | Navigate back without losing Location | Location values remain after advancing and returning. |
| QA-CREATE-018 | Validation after navigating back | Siguiente is enabled or blocked according to the current required fields. |
| QA-CREATE-023 | Change Departamento | Municipio is cleared when Departamento changes. |
| QA-CREATE-025 | Optional long text | Empty values do not block progress and overflow is capped. |

### Edit Asset

Sources: `tests/editAsset/*.spec.ts`

| ID | Scenario | Expected result |
|---|---|---|
| QA-EDIT-000 | Complete edit flow | Form sections are edited and the changes are saved. |
| QA-EDIT-001 | API data displayed in the form | Prepopulated controls match normalized API values. |
| QA-EDIT-002 | Edit one required field | The PATCH succeeds and the value persists after reopening. |
| QA-EDIT-003 | Edit fields across panels | All saved required values persist after reopening. |
| QA-EDIT-004 | Clear a required field | Save is blocked and inline validation appears. |
| QA-EDIT-005 | Clear an optional field | The empty value is saved and persists. |
| QA-EDIT-006 | Complete PATCH contract | The payload contains the edits and preserves important unchanged fields. |
| QA-EDIT-007 | Cancel an edit | Changes are discarded and no PATCH is sent. |
| QA-EDIT-008 | Hard reload after saving | The saved value remains after reload and reopen. |
| QA-EDIT-009 | Open edit by direct URL | A valid asset URL renders the editable form. |
| QA-EDIT-011 | Replace all text | Selecting all and typing replaces the complete value. |
| QA-EDIT-012 | Append text | New text is added without replacing the existing prefix. |
| QA-EDIT-013 | Insert text in the middle | Characters are inserted at the cursor position. |
| QA-EDIT-014 | Delete the first character | Delete removes the first character and preserves the rest. |
| QA-EDIT-015 | Delete the last character | Backspace removes the final character and preserves the rest. |
| QA-EDIT-016 | Replace with Ctrl+A | The platform select-all shortcut replaces the value. |
| QA-EDIT-017 | Copy Vereda into Localidad | The exact clipboard value is pasted into Localidad. |
| QA-EDIT-018 | Cut Vereda and paste into Localidad | Vereda is cut and its exact value is pasted into Localidad. |
| QA-EDIT-019 | Vereda typing maximum | The field stops accepting characters at its limit. |
| QA-EDIT-020 | Paste beyond the maximum | Pasted content is trimmed to the allowed length. |
| QA-EDIT-021 | Letters in numeric fields | Numeric inputs reject alphabetic characters. |
| QA-EDIT-023 | Unicode text | Unicode persists through save and reload, then the original backend value is restored. |
| QA-EDIT-024 | Undo and redo | Browser shortcuts revert and reapply the edit. |
| QA-EDIT-025 | Valor UC currency mask | The value formats while typing and preserves its numeric meaning. |
| QA-EDIT-026 | Departamento–Municipio dependency | Changing Departamento clears Municipio and Codigo DANE. |
| QA-EDIT-028 | Edit across accordion panels | An unsaved value remains while panels are collapsed and expanded. |
| QA-EDIT-029 | Reload during an edit | Unsaved changes are discarded and the persisted value returns. |
| QA-EDIT-030 | Navigate to another plate | Unsaved changes are discarded without a dialog. |
| QA-EDIT-030B | Multiple Red y estructuras panels | Multiple panels remain open and their fields stay editable. |
| QA-EDIT-032 | Back and forward after saving | Browser history loads the saved value instead of stale form state. |
| QA-EDIT-035 | Retry after a failed save | The edited value survives the failure and persists after the successful retry. |
| QA-EDIT-036 | Editable asset | The Editar action is visible and enabled. |
| QA-EDIT-037 | Non-editable asset | The Editar action is visible but disabled. |
| QA-EDIT-038 | Read-only asset | Asset details render while editing remains blocked. |

### Generate Report

Sources: `tests/exportAsset/*.spec.ts`

> Caution: `QA-EXPORT-019` performs a real unfiltered export. It is sensitive to dataset size and server memory and should not be repeated casually.

| ID | Scenario | Expected result |
|---|---|---|
| QA-EXPORT-000 | Baseline filtered flow | The report is generated with dates, Departamento, and Municipio filters. |
| QA-EXPORT-001 | Open Generate Report | The correct route, drawer, controls, and accessible actions are displayed. |
| QA-EXPORT-002 | Cancel and reopen | No export is sent and temporary filters are blank after reopening. |
| QA-EXPORT-003 | Load lookup data | Authorized requests succeed and lookup values appear in the selectors. |
| QA-EXPORT-004 | Municipalities for one department | Municipality becomes enabled and only applicable options appear. |
| QA-EXPORT-005 | Multiple departments | Repeated `departmentIds` are requested and stale UI options are removed. |
| QA-EXPORT-006 | Todos and Ninguno semantics | Contradictory selections and duplicate municipality codes are prevented. |
| QA-EXPORT-007 | Clear filters | Every filter is cleared, Municipality is disabled again, and no export is sent. |
| QA-EXPORT-008 | Valid calendar dates | Normalized dates reach the request and the XLSX download contract is verified. |
| QA-EXPORT-009 | Future dates | Future calendar dates remain disabled and no export request is sent. |
| QA-EXPORT-010 | Start date after end date | Start dates beyond the selected end boundary cannot be selected. |
| QA-EXPORT-011 | Equal start and end dates | The same day is accepted and serialized equally in both fields. |
| QA-EXPORT-012 | Blank optional start date | `fechaInicial: ""` is sent while the selected end date is preserved. |
| QA-EXPORT-013 | Blank optional end date | `fechaFinal: ""` is sent while the selected start date is preserved. |
| QA-EXPORT-014 | Both dates blank | Both optional dates are serialized as empty strings. |
| QA-EXPORT-015 | Plate with leading zeros | The known plate preserves its leading zeros exactly in the payload. |
| QA-EXPORT-016 | Plate with ASCII whitespace | Surrounding whitespace is preserved exactly and the no-data result is verified. |
| QA-EXPORT-017 | Letters and numeric maximum | **Blocked (`test.fixme`)** until the business plate limit is documented. |
| QA-EXPORT-018 | Filtered export and XLSX | The exact seven-key payload and identifying workbook values are verified. |
| QA-EXPORT-019 | Unfiltered export | The canonical empty payload and a real XLSX are verified; the path is slow and heap-sensitive. |
| QA-EXPORT-020 | Lookup failures and recovery | 401, 403, 500, timeout, and malformed JSON are handled before controls recover. |
| QA-EXPORT-021 | Prevent duplicate exports | Only one request is sent while a slow response is pending. |
| QA-EXPORT-022 | Logout across tabs | **Blocked (`test.fixme`)** by the missing stable logout locator and observed session defect. |

### Import Asset

Sources: `tests/importAsset/*.spec.ts`

| ID | Scenario | Expected result |
|---|---|---|
| QA-IMP-001 | Complete import flow | The workbook is imported and its 102 mapped fields match the asset API. |
| QA-IMP-002 | Template headers | The downloaded template contains the expected headers in exact order. |
| QA-IMP-003 | Non-Excel file | The file is rejected and the supported-format message appears. |
| QA-IMP-004 | File larger than 10 MB | The large file is rejected and a later smaller file can still be validated. |
| QA-IMP-005 | Empty workbook | A workbook without data is rejected with the corresponding message. |
| QA-IMP-006 | Batch import | The verified batch workbook completes successfully. |
| QA-IMP-007 | Retry after load 500 | The validated file remains and load retries without another validation. |
| QA-IMP-008 | Retry after load timeout | The validated file remains and load retries without another validation. |
| QA-IMP-009 | Retry after disconnection | The validated file remains and load retries without another validation. |
| QA-IMP-010 | Sparse rows with blank lines | Populated rows import successfully despite intervening blank physical rows. |
| QA-IMP-011 | Physical error row number | The error identifies the real spreadsheet row after blank lines. |
| QA-IMP-012 | Plate does not match article | The workbook is rejected with the plate–article relationship error. |
| QA-IMP-013 | Plate in Baja or Devolucion | Import is rejected because of the plate's current status. |
| QA-IMP-014 | Repeated plate in one workbook | The duplicated plate is detected and reported. |
| QA-IMP-015 | Incorrect DANE code | Import is rejected when Codigo DANE does not match Municipio. |
| QA-IMP-016 | Municipality from another department | Import is rejected when Municipio does not belong to Departamento. |
| QA-IMP-017 | Text beyond maximum | The Tipo de instalación length error is reported and exported. |
| QA-IMP-018 | Number beyond its limit | The Edad agotada length error is reported and exported. |
| QA-IMP-019 | Numeric value beyond its limit | The Valor asociado a mantenimiento error is reported and exported. |
| QA-IMP-020 | Invalid decimal format | The numeric-format error is reported and exported. |
| QA-IMP-021 | Invalid date format | The `dd/MM/yyyy` format is required and its error is exported. |
| QA-IMP-022 | Multiple boundary errors | Every error from the same workbook is displayed and exported. |
| QA-IMP-025 | Replace an existing asset | Populated and blank fields are replaced, verified through the API, and restored afterward. |
| QA-IMP-026 | Required ARTICULO | The workbook is rejected when ARTICULO is blank. |
| QA-IMP-027 | Required N° PLACA | The workbook is rejected when N° PLACA is blank. |
| QA-IMP-028 | Required FOTOS | The workbook is rejected when FOTOS (enlace) is blank. |
| QA-IMP-029 | Required PLANILLA | The workbook is rejected when PLANILLA (ARCGIS) is blank. |
| QA-IMP-030 | Required DEPARTAMENTO | The workbook is rejected when DEPARTAMENTO is blank. |
| QA-IMP-031 | Required MUNICIPIO | The workbook is rejected when MUNICIPIO is blank. |
| QA-IMP-032 | Required DANE code | The workbook is rejected when COD_LOCALIZACION_DANE is blank. |
| QA-IMP-033 | Reordered Location columns | Columns map by header and imported values match the target asset API. |

## Maintenance rule

When a test is added, renamed, or removed, update this file and `PLAYWRIGHT_TEST_GUIDE_ES.md` in the same change. Keep the ID identical to `testMetadata`, and describe the observable result rather than the implementation steps.

