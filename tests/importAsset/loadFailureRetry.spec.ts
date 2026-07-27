import { test, expect } from '../fixtures';
import path from 'path';
import { ImportAssetPage } from '../pages/ImportAssetPage';
import { testMetadata } from '../helpers/testMetadata';

const LOAD_FAILURE_RETRY_FILE = path.join(
    process.cwd(),
    'fixtures',
    'importFixtures',
    'failures',
    'load-failure-retry.xlsx'
);
const LOAD_TIMEOUT_RETRY_FILE = path.join(
    process.cwd(),
    'fixtures',
    'importFixtures',
    'failures',
    'load-timeout-retry.xlsx'
);
const LOAD_DISCONNECTED_RETRY_FILE = path.join(
    process.cwd(),
    'fixtures',
    'importFixtures',
    'failures',
    'load-disconnected-retry.xlsx'
);

test('Import retains the validated file and retries after a final-load 500', testMetadata('QA-IMP-007', 'Retains the validated workbook after a load 500 and retries loading without repeating validation.'), async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);
    let validationAttempts = 0;
    let loadAttempts = 0;

    page.on('request', request => {
        if (
            request.method() === 'POST' &&
            request.url().includes('/electrical-assets/import/validate?')
        ) {
            validationAttempts++;
        }
    });

    await page.route('**/electrical-assets/import/load?**', async route => {
        loadAttempts++;

        if (loadAttempts === 1) {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Temporary import failure' }),
            });
            return;
        }

        await route.continue();
    });

    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', LOAD_FAILURE_RETRY_FILE);
    await expect(importAssetPage.submitButton).toBeEnabled();
    await importAssetPage.submitButton.click();
    await expect.poll(() => loadAttempts).toBe(1);

    await expect(page.getByText('No se pudo importar el archivo')).toBeVisible();
    await expect(page.getByText('Temporary import failure').first()).toBeVisible();
    await expect(page.getByText('load-failure-retry.xlsx')).toBeVisible();
    await expect(importAssetPage.submitButton).toBeEnabled();
    expect(validationAttempts).toBe(1);

    await importAssetPage.submitButton.click();

    await expect(importAssetPage.successMessage).toBeVisible();
    await expect.poll(() => loadAttempts).toBe(2);
    expect(validationAttempts).toBe(1);
    await expect(page.getByText('load-failure-retry.xlsx')).not.toBeVisible();
});

test('Import retains the validated file and retries after a final-load timeout', testMetadata('QA-IMP-008', 'Retains the validated workbook after a load timeout and retries loading without repeating validation.'), async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);
    let validationAttempts = 0;
    let loadAttempts = 0;

    page.on('request', request => {
        if (
            request.method() === 'POST' &&
            request.url().includes('/electrical-assets/import/validate?')
        ) {
            validationAttempts++;
        }
    });

    await page.route('**/electrical-assets/import/load?**', async route => {
        loadAttempts++;

        if (loadAttempts === 1) {
            await route.abort('timedout');
            return;
        }

        await route.continue();
    });

    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', LOAD_TIMEOUT_RETRY_FILE);
    await expect(importAssetPage.submitButton).toBeEnabled();
    await importAssetPage.submitButton.click();
    await expect.poll(() => loadAttempts).toBe(1);

    await expect(page.getByText('No se pudo importar el archivo')).toBeVisible();
    await expect(page.getByText('load-timeout-retry.xlsx')).toBeVisible();
    await expect(importAssetPage.submitButton).toBeEnabled();
    expect(validationAttempts).toBe(1);

    await importAssetPage.submitButton.click();

    await expect(importAssetPage.successMessage).toBeVisible();
    await expect.poll(() => loadAttempts).toBe(2);
    expect(validationAttempts).toBe(1);
    await expect(page.getByText('load-timeout-retry.xlsx')).not.toBeVisible();
});

test('Import retains the validated file and retries after internet disconnection', testMetadata('QA-IMP-009', 'Retains the validated workbook after a disconnected load and retries without repeating validation.'), async ({ page }) => {
    const importAssetPage = new ImportAssetPage(page);
    let validationAttempts = 0;
    let loadAttempts = 0;

    page.on('request', request => {
        if (
            request.method() === 'POST' &&
            request.url().includes('/electrical-assets/import/validate?')
        ) {
            validationAttempts++;
        }
    });

    await page.route('**/electrical-assets/import/load?**', async route => {
        loadAttempts++;

        if (loadAttempts === 1) {
            await route.abort('internetdisconnected');
            return;
        }

        await route.continue();
    });

    await importAssetPage.openImport();
    await page.setInputFiles('input[type="file"]', LOAD_DISCONNECTED_RETRY_FILE);
    await expect(importAssetPage.submitButton).toBeEnabled();
    await importAssetPage.submitButton.click();
    await expect.poll(() => loadAttempts).toBe(1);

    await expect(page.getByText('No se pudo importar el archivo')).toBeVisible();
    await expect(page.getByText('load-disconnected-retry.xlsx')).toBeVisible();
    await expect(importAssetPage.submitButton).toBeEnabled();
    expect(validationAttempts).toBe(1);

    await importAssetPage.submitButton.click();

    await expect(importAssetPage.successMessage).toBeVisible();
    await expect.poll(() => loadAttempts).toBe(2);
    expect(validationAttempts).toBe(1);
    await expect(page.getByText('load-disconnected-retry.xlsx')).not.toBeVisible();
});
