import { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '0000247634';
const UPDATE_PATH = `/electrical-assets/article-resume/${PLATE}`;
const SUCCESS_TOAST = 'Cambios guardados correctamente';

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

async function openRegistroPanel(page: Page) {
  await page.getByRole('button', { name: /Registro Enlaces y/ }).click();
}

test.describe('Edit asset critical flow', () => {
  test('QA-EDIT-002: edit one required field and persist it after save', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValue = false;
    let originalFotos = '';

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      await openRegistroPanel(page);
      originalFotos = await editAsset.enlaceFotosField.inputValue();
      const editedFotos = originalFotos === 'https://www.google.com/?qa=edit002'
        ? 'https://www.google.com/?qa=edit002b'
        : 'https://www.google.com/?qa=edit002';

      await editAsset.enlaceFotosField.fill(editedFotos);

      await expect(editAsset.enlaceFotosField).toHaveValue(editedFotos);

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValue = true;

      await editAsset.goto(PLATE);
      await openRegistroPanel(page);
      await expect(editAsset.enlaceFotosField).toHaveValue(editedFotos);
    } finally {
      if (savedEditedValue) {
        await editAsset.goto(PLATE);
        await openRegistroPanel(page);
        await editAsset.enlaceFotosField.fill(originalFotos);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });
});
