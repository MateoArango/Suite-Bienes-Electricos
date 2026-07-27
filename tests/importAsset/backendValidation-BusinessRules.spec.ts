import { test, expect } from "../fixtures";
import path from "path";
import fs from "fs/promises";
import { ImportAssetPage } from "../pages/ImportAssetPage";
import { testMetadata } from "../helpers/testMetadata";

const PLATE = "00000401";
const REORDERED_TEMPLATE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "reordered-template.xlsx",
);

const EXPECTED_LOCATION = {
  localidad: "https://mateo.google.com/qyf-aynk-omd",
  codigoDane: "5002",
  // The article-resume API exposes the department catalog code: 05 = ANTIOQUIA.
  departamento: "05",
};
const SPARSE_GOOD_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "rows_3of5_Populated-Good.xlsx",
);
const SPARSE_ERROR_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "rows_3of5_Populated-Error.xlsx",
);
const ASSET_ARTICLE_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "asset-article.xlsx",
);
const INVALID_PLATE_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "invalidPlate.xlsx",
);
const SAME_PLATE_TWICE_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "samePlateTwice.xlsx",
);
const DANE_WRONG_MUNICIPALITY_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "dane-wrong-municipality.xlsx",
);
const MUNICIPALITY_WRONG_DEPARTMENT_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "municipality-wrong-department.xlsx",
);
const BOUNDARIES_DIR = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "boundaries",
);
const UPDATE_EXISTING_PLATE_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "update_full_existing_plate.xlsx",
);
const RESTORE_EXISTING_PLATE_FILE = path.join(
  process.cwd(),
  "fixtures",
  "importFixtures",
  "restore_full_existing_plate.xlsx",
);
const FILE_ERRORS_MESSAGE = "Se encontraron errores en el archivo";
const BOUNDARY_CASES = [
  {
    id: "QA-IMP-017",
    fileName: "text-max-plus-one.xlsx",
    column: "TIPO DE INSTALACI\u00d3N",
    expectedError: "longitud entre 0 y 8 caracteres (actual: 10)",
  },
  {
    id: "QA-IMP-018",
    fileName: "number-out-of-range.xlsx",
    column: "EDAD_AGOTADA",
    expectedError: "longitud entre 0 y 5 caracteres (actual: 6)",
  },
  {
    id: "QA-IMP-019",
    fileName: "number-decimal-not-allowed.xlsx",
    column: "VALOR ASOCIADO A SU MANTENIMIENTO",
    expectedError: "longitud entre 0 y 16 caracteres (actual: 17)",
  },
  {
    id: "QA-IMP-020",
    fileName: "decimal-invalid-format.xlsx",
    column: "VALOR ASOCIADO A SU MANTENIMIENTO",
    expectedError: "debe ser numérico. Ejemplos válidos: 1, 1.5 o 1,5.",
  },
  {
    id: "QA-IMP-021",
    fileName: "date-wrong-format.xlsx",
    column: "FECHA_INICIAL_POLIZAS_CONTRATO_DE_OBRA",
    expectedError: "debe tener formato dd/MM/yyyy. Ejemplo válido: 25/05/2026.",
  },
];
const REQUIRED_FIELD_CASES = [
  { id: "QA-IMP-026", fileName: "requiredField1-Error - 1.xlsx", column: "ARTICULO" },
  { id: "QA-IMP-027", fileName: "requiredField1-Error - 2.xlsx", column: "N° PLACA" },
  { id: "QA-IMP-028", fileName: "requiredField1-Error - 3.xlsx", column: "FOTOS (enlace)" },
  { id: "QA-IMP-029", fileName: "requiredField1-Error - 4.xlsx", column: "PLANILLA (ARCGIS)" },
  { id: "QA-IMP-030", fileName: "requiredField1-Error - 5.xlsx", column: "DEPARTAMENTO" },
  { id: "QA-IMP-031", fileName: "requiredField1-Error - 6.xlsx", column: "MUNICIPIO" },
  { id: "QA-IMP-032", fileName: "requiredField1-Error -7.xlsx", column: "COD_LOCALIZACION_DANE" },
];

test("Import accepts sparse rows with blank lines", testMetadata('QA-IMP-010', 'Imports populated rows successfully when blank physical rows are interspersed in the workbook.'), async ({ page }) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();

  await page.setInputFiles('input[type="file"]', SPARSE_GOOD_FILE);
  await importAssetPage.submitButton.click();

  await expect(importAssetPage.successMessage).toBeVisible();
});

test("Import reports physical row number for sparse row errors", testMetadata('QA-IMP-011', 'Reports the original physical spreadsheet row for an error after blank rows.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();

  await page.setInputFiles('input[type="file"]', SPARSE_ERROR_FILE);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
  await importAssetPage.errorsButton.click();
  await expect(page.getByText("CALIBRE CONDUCTOR").first()).toBeVisible();
  const calibreErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "CALIBRE CONDUCTOR" }),
    })
    .last();
  await expect(calibreErrorRow.locator(".col-row")).toHaveText("6");
});

test("Import rejects a plate that does not correspond to the article", testMetadata('QA-IMP-012', 'Rejects a workbook whose plate does not belong to the supplied article.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', ASSET_ARTICLE_FILE);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const articleErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "ARTICULO" }),
    })
    .first();

  await expect(articleErrorRow.locator(".col-row")).toHaveText("2");
  await expect(articleErrorRow.locator(".col-column")).toHaveText("ARTICULO");
  await expect(articleErrorRow.locator(".col-desc")).toContainText(
    "no corresponde al artículo",
  );
});

test("Import rejects a plate in Baja or Devolucion status", testMetadata('QA-IMP-013', 'Rejects import of a plate whose current status is Baja or Devolucion.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', INVALID_PLATE_FILE);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible({ timeout: 20_000 });
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const plateErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "PLACA" }),
    })
    .first();

  await expect(plateErrorRow.locator(".col-row")).toHaveText("2");
  await expect(plateErrorRow.locator(".col-column")).toHaveText("PLACA");
  await expect(plateErrorRow.locator(".col-desc")).toContainText(
    "se encuentra en estado Baja o Devolucion",
  );
});

test("Import rejects a plate repeated in the same workbook", testMetadata('QA-IMP-014', 'Detects and reports a plate duplicated within the same workbook.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', SAME_PLATE_TWICE_FILE);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible({ timeout: 20_000 });
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const duplicatePlateErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "PLACA" }),
    })
    .first();

  await expect(duplicatePlateErrorRow.locator(".col-row")).toHaveText("2");
  await expect(duplicatePlateErrorRow.locator(".col-column")).toHaveText(
    "PLACA",
  );
  await expect(duplicatePlateErrorRow.locator(".col-desc")).toContainText(
    "La placa '00000535' está repetida",
  );
  await expect(duplicatePlateErrorRow.locator(".col-desc")).toContainText(
    "filas: 2, 7",
  );
});

test("Import rejects a DANE code that does not match the municipality", testMetadata('QA-IMP-015', 'Rejects a location row when Codigo DANE does not correspond to Municipio.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', DANE_WRONG_MUNICIPALITY_FILE);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const daneErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "CODIGO_DANE" }),
    })
    .first();

  await expect(daneErrorRow.locator(".col-row")).toHaveText("2");
  await expect(daneErrorRow.locator(".col-column")).toHaveText("CODIGO_DANE");
  await expect(daneErrorRow.locator(".col-desc")).toContainText(
    "El campo CODIGO_DANE no coincide con DEPARTAMENTO/MUNICIPIO",
  );
  await expect(daneErrorRow.locator(".col-desc")).toContainText(
    "Esperado: 5001, recibido: 5002",
  );
});

test("Import rejects a municipality that does not belong to the department", testMetadata('QA-IMP-016', 'Rejects a location row when Municipio does not belong to Departamento.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);

  await importAssetPage.openImport();
  await page.setInputFiles(
    'input[type="file"]',
    MUNICIPALITY_WRONG_DEPARTMENT_FILE,
  );
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const locationErrorRow = page
    .locator("tr", {
      has: page.locator(".col-column", { hasText: "DEPARTAMENTO/MUNICIPIO" }),
    })
    .first();

  await expect(locationErrorRow.locator(".col-row")).toHaveText("2");
  await expect(locationErrorRow.locator(".col-column")).toHaveText(
    "DEPARTAMENTO/MUNICIPIO",
  );
  await expect(locationErrorRow.locator(".col-desc")).toContainText(
    "Los campos DEPARTAMENTO y MUNICIPIO deben contener una combinación DIVIPOLA válida del catálogo DANE",
  );
});

test("QA-IMP-025: import fully replaces an existing asset", testMetadata('QA-IMP-025', 'Replaces an existing asset from the workbook, verifies changed and blanked API fields, and restores the original fixture state.'), async ({
  page,
  apiContext,
  authToken,
}) => {
  const plate = "00000382";
  const importAssetPage = new ImportAssetPage(page);
  const headers = { Authorization: `Bearer ${authToken}` };
  const getAsset = async () => {
    const response = await apiContext.get(
      `/electrical-assets/article-resume/${plate}`,
      { headers },
    );

    expect(response.ok(), `API call failed for plate ${plate}`).toBeTruthy();
    return response.json();
  };
  const snapshot = (asset: any) => ({
    localidad: asset.ubicacionYRegistro?.localidad ?? "",
    longitud: asset.ubicacionYRegistro?.longitud ?? "",
    proyecto: asset.proyectoYGestion?.proyecto ?? "",
    circuito: asset.proyectoYGestion?.circuito ?? "",
    serie: asset.equipoYAvaluo?.serie ?? "",
    cantidad: String(asset.equipoYAvaluo?.cantidad ?? ""),
    clase: asset.equipoYAvaluo?.clase ?? "",
    nroFases: String(asset.redYEstructura?.nroFases ?? ""),
    enlaceFotos: asset.ubicacionYRegistro?.enlaceFotos ?? "",
  });
  const expectedAfterImport = {
    localidad: "update",
    longitud: "",
    proyecto: "PROY-update",
    circuito: "",
    serie: "SERIE-update",
    cantidad: "66",
    clase: "",
    nroFases: "",
    enlaceFotos: "https://update.google.com/qyf-aynk-omd",
  };

  const baseline = snapshot(await getAsset());

  expect(baseline.longitud).not.toBe("");
  expect(baseline.circuito).not.toBe("");
  expect(baseline.clase).not.toBe("");
  expect(baseline.nroFases).not.toBe("");
  expect(baseline.nroFases).not.toBe("");
  expect(baseline.enlaceFotos).not.toBe(expectedAfterImport.enlaceFotos);
  
  try {
    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', UPDATE_EXISTING_PLATE_FILE);
    await importAssetPage.submitButton.click();
    await expect(importAssetPage.successMessage).toBeVisible();

    await expect
      .poll(async () => snapshot(await getAsset()), {
        message: `Plate ${plate} did not match the full replacement workbook`,
        timeout: 15_000,
      })
      .toEqual(expectedAfterImport);

    expect(snapshot(await getAsset())).not.toEqual(baseline);
  } finally {
    await page.goto("/dashboard");
    await importAssetPage.importButton.click();
    await page.setInputFiles('input[type="file"]', RESTORE_EXISTING_PLATE_FILE);
    await importAssetPage.submitButton.click();
    await expect(importAssetPage.successMessage).toBeVisible();
  }
});

for (const boundaryCase of BOUNDARY_CASES) {
  test(`Import rejects ${boundaryCase.fileName} violation in ${boundaryCase.column}`, testMetadata(boundaryCase.id, `Rejects the ${boundaryCase.column} boundary violation and exports its expected validation error.`), async ({
    page,
  }) => {
    const importAssetPage = new ImportAssetPage(page);
    const filePath = path.join(BOUNDARIES_DIR, boundaryCase.fileName);

    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', filePath);
    await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
    await expect(importAssetPage.submitButton).toBeDisabled();
    await importAssetPage.errorsButton.click();

    const boundaryErrorRow = page
      .locator("tr", {
        has: page.locator(".col-column", { hasText: boundaryCase.column }),
      })
      .first();

    await expect(boundaryErrorRow.locator(".col-row")).toHaveText("2");
    await expect(boundaryErrorRow.locator(".col-column")).toHaveText(
      boundaryCase.column,
    );
    await expect(boundaryErrorRow.locator(".col-desc")).toContainText(
      boundaryCase.expectedError,
    );
  });
}

test("Import exports multiple boundary errors from one workbook", testMetadata('QA-IMP-022', 'Reports and exports multiple field-boundary errors found in one workbook.'), async ({
  page,
}) => {
  const importAssetPage = new ImportAssetPage(page);
  const filePath = path.join(BOUNDARIES_DIR, "multiple-boundary-errors.xlsx");

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', filePath);
  await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
  await expect(importAssetPage.submitButton).toBeDisabled();
  await importAssetPage.errorsButton.click();

  const downloadPromise = page.waitForEvent("download");
  await importAssetPage.exportErrors.click();
  const download = await downloadPromise;
  const downloadedFilePath = path.join(
    process.cwd(),
    "tmp",
    "downloads",
    download.suggestedFilename(),
  );

  expect(download.suggestedFilename()).toContain("multiple-boundary-errors");
  expect(download.suggestedFilename()).toMatch(/\.csv$/i);

  await fs.mkdir(path.dirname(downloadedFilePath), { recursive: true });
  await download.saveAs(downloadedFilePath);

  const csvContent = await fs.readFile(downloadedFilePath, "utf8");

  expect(csvContent).toContain("PLANILLA (ARCGIS)");
  expect(csvContent).toContain(
    "longitud entre 0 y 100 caracteres (actual: 106)",
  );
  expect(csvContent).toContain("EDAD_TIPO_VIDA_UTIL");
  expect(csvContent).toContain("longitud entre 0 y 5 caracteres (actual: 6)");
  expect(csvContent).toContain("UC_VALOR_T");
  expect(csvContent).toContain(
    "debe ser numérico. Ejemplos válidos: 1, 1.5 o 1,5.",
  );
  expect(csvContent).toContain("FECHA_SUSCRIPCION_CONTRATO_AOM");
  expect(csvContent).toContain(
    "debe tener formato dd/MM/yyyy. Ejemplo válido: 25/05/2026.",
  );
});

for (const requiredFieldCase of REQUIRED_FIELD_CASES) {
  test(`Import rejects missing required field ${requiredFieldCase.column}`, testMetadata(requiredFieldCase.id, `Rejects the workbook and reports ${requiredFieldCase.column} when that required field is blank.`), async ({
    page,
  }) => {
    const importAssetPage = new ImportAssetPage(page);
    const filePath = path.join(
      process.cwd(),
      "fixtures",
      "importFixtures",
      requiredFieldCase.fileName,
    );

    await importAssetPage.openImport();

    await page.setInputFiles('input[type="file"]', filePath);
    await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
    await importAssetPage.errorsButton.click();

    const requiredFieldErrorRow = page
      .locator("tr", {
        has: page.locator(".col-column", { hasText: requiredFieldCase.column }),
      })
      .first();

    await expect(requiredFieldErrorRow.locator(".col-row")).toHaveText("2");
    await expect(requiredFieldErrorRow.locator(".col-column")).toHaveText(
      requiredFieldCase.column,
    );
    await expect(requiredFieldErrorRow.locator(".col-desc")).toContainText(
      "obligatorio",
    );
  });
}

test("Import maps reordered location columns by header", testMetadata('QA-IMP-033', 'Maps reordered location columns by header and verifies the imported API values for the target plate.'), async ({
  page,
  apiContext,
  authToken,
}) => {
  const importAssetPage = new ImportAssetPage(page);
  let actualLocation: Partial<typeof EXPECTED_LOCATION> = {};

  await importAssetPage.openImport();
  await page.setInputFiles('input[type="file"]', REORDERED_TEMPLATE);
  await importAssetPage.submitButton.click();
  await expect(importAssetPage.successMessage).toBeVisible();

  await expect
    .poll(
      async () => {
        const response = await apiContext.get(
          `/electrical-assets/article-resume/${PLATE}`,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );

        if (!response.ok()) {
          return { status: response.status() };
        }

        const asset = await response.json();
        const location = asset.ubicacionYRegistro;

        actualLocation = {
          localidad: location?.localidad,
          codigoDane: String(location?.codigoDane ?? ""),
          departamento: location?.departamento,
        };

        return actualLocation;
      },
      {
        message: `Imported location fields for plate ${PLATE} did not match the reordered headers`,
        timeout: 15_000,
      },
    )
    .toEqual(EXPECTED_LOCATION);
  /*
    console.log('LOCALIDAD comparison:', {
        expected: EXPECTED_LOCATION.localidad,
        actual: actualLocation.localidad,
    });
    console.log('COD_LOCALIZACION_DANE comparison:', {
        expected: EXPECTED_LOCATION.codigoDane,
        actual: actualLocation.codigoDane,
    });
    console.log('DEPARTAMENTO comparison:', {
        expected: EXPECTED_LOCATION.departamento,
        actual: actualLocation.departamento,
    }); */
});
