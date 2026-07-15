import { test, expect } from '../fixtures';
import path from 'path';
import { ImportAssetPage } from '../pages/ImportAssetPage';

const SPARSE_GOOD_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'rows_3of5_Populated-Good.xlsx');
const SPARSE_ERROR_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'rows_3of5_Populated-Error.xlsx');
const FILE_ERRORS_MESSAGE = 'Se encontraron errores en el archivo';

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
