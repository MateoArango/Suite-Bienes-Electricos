import { test, expect } from '../fixtures';
import path from 'path';
import { ImportAssetPage } from '../pages/ImportAssetPage';

const SPARSE_GOOD_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'rows_3of5_Populated-Good.xlsx');
const SPARSE_ERROR_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'rows_3of5_Populated-Error.xlsx');
const FILE_ERRORS_MESSAGE = 'Se encontraron errores en el archivo';
const REQUIRED_FIELD_CASES = [
    { fileName: 'requiredField1-Error - 1.xlsx', column: 'ARTICULO' },
    { fileName: 'requiredField1-Error - 2.xlsx', column: 'N° PLACA' },
    { fileName: 'requiredField1-Error - 3.xlsx', column: 'FOTOS (enlace)' },
    { fileName: 'requiredField1-Error - 4.xlsx', column: 'PLANILLA (ARCGIS)' },
    { fileName: 'requiredField1-Error - 5.xlsx', column: 'DEPARTAMENTO' },
    { fileName: 'requiredField1-Error - 6.xlsx', column: 'MUNICIPIO' },
    { fileName: 'requiredField1-Error -7.xlsx', column: 'COD_LOCALIZACION_DANE' },
];

test('Import accepts sparse rows with blank lines', async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);

    await importAssetPage.openImport();

    await page.setInputFiles('input[type="file"]', SPARSE_GOOD_FILE);
    await importAssetPage.submitButton.click();

    await expect(importAssetPage.successMessage).toBeVisible();
});

test('Import reports physical row number for sparse row errors', async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);

    await importAssetPage.openImport();

    await page.setInputFiles('input[type="file"]', SPARSE_ERROR_FILE);
    await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
    await importAssetPage.errorsButton.click();
    await expect(page.getByText('CALIBRE CONDUCTOR').first()).toBeVisible();
    const calibreErrorRow = page.locator('tr', { has: page.locator('.col-column', { hasText: 'CALIBRE CONDUCTOR' }) }).last();
    await expect(calibreErrorRow.locator('.col-row')).toHaveText('6');
});

for (const requiredFieldCase of REQUIRED_FIELD_CASES) {
    test(`Import rejects missing required field ${requiredFieldCase.column}`, async ({ page }) => {
        const importAssetPage = new ImportAssetPage(page);
        const filePath = path.join(process.cwd(), 'fixtures', 'importFixtures', requiredFieldCase.fileName);

        await importAssetPage.openImport();

        await page.setInputFiles('input[type="file"]', filePath);
        await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
        await importAssetPage.errorsButton.click();

        const requiredFieldErrorRow = page.locator('tr', {
            has: page.locator('.col-column', { hasText: requiredFieldCase.column }),
        }).first();

        await expect(requiredFieldErrorRow.locator('.col-row')).toHaveText('2');
        await expect(requiredFieldErrorRow.locator('.col-column')).toHaveText(requiredFieldCase.column);
        await expect(requiredFieldErrorRow.locator('.col-desc')).toContainText('obligatorio');
    });
}
