import { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '0000247634';
const UPDATE_PATH = `/electrical-assets/article-resume/${PLATE}`;
const SUCCESS_TOAST = 'Cambios guardados correctamente';
const ERROR_TOAST = 'Error guardando cambios';

async function saveAndExpectSuccess(page: Page, editAsset: EditAssetPage) {
  const updateResponsePromise = page.waitForResponse(response =>
    response.request().method() === 'PATCH' &&
    response.url().includes(UPDATE_PATH)
  );

  await editAsset.saveBtn.click();

  const updateResponse = await updateResponsePromise;
  expect(updateResponse.ok(), `Update failed: ${updateResponse.status()} ${await updateResponse.text()}`).toBe(true);
  await expect(page.getByText(SUCCESS_TOAST)).toBeVisible();
}

test.describe('Edit asset robustness', () => {
  test('QA-EDIT-035: failed save can be retried without losing the edited value', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let patchAttempts = 0;
    let savedEditedValue = false;
    let originalLocalidad = '';

    await page.route(`**${UPDATE_PATH}`, async route => {
      if (route.request().method() !== 'PATCH') {
        await route.continue();
        return;
      }

      patchAttempts++;

      if (patchAttempts === 1) {
        await route.abort('failed');
        return;
      }

      await route.continue();
    });

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLocalidad = await editAsset.localidadField.inputValue();
      const editedLocalidad = originalLocalidad === 'QA no internet save'
        ? 'QA no internet save 2'
        : 'QA no internet save';

      await editAsset.localidadField.fill(editedLocalidad);
      await expect(editAsset.localidadField).toHaveValue(editedLocalidad);

      const failedSaveRequest = page.waitForEvent('requestfailed', request =>
        request.method() === 'PATCH' &&
        request.url().includes(UPDATE_PATH)
      );

      await editAsset.saveBtn.click();
      await failedSaveRequest;

      expect(patchAttempts).toBe(1);
      await expect(page.getByText(ERROR_TOAST)).toBeVisible();
      await expect(page.getByText(SUCCESS_TOAST)).toBeHidden();
      await expect(editAsset.localidadField).toHaveValue(editedLocalidad);
      await expect(editAsset.saveBtn).toBeEnabled();

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValue = true;
      expect(patchAttempts).toBe(2);

      await editAsset.goto(PLATE);
      await expect(editAsset.localidadField).toHaveValue(editedLocalidad);
    } finally {
      if (savedEditedValue) {
        await editAsset.goto(PLATE);
        await editAsset.localidadField.fill(originalLocalidad);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });
});
