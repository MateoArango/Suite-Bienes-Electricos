import { test, expect } from '../fixtures';
import path from 'path';
import { ImportAssetPage } from '../pages/ImportAssetPage';

const BATCH_FILE = path.join(
    process.cwd(),
    'fixtures',
    'importFixtures',
    'batch.xlsx'
);

test('Import completes a batch workbook', async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);

    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', BATCH_FILE);
    await importAssetPage.submitButton.click();

    await expect(importAssetPage.successMessage).toBeVisible({ timeout: 10_000 });
});
