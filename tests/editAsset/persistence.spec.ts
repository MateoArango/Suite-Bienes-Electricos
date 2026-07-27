import { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';
import { testMetadata } from '../helpers/testMetadata';

const PLATE = '00000564';
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

async function openResponsablePanel(page: Page) {
  await page.getByRole('tab', { name: /Proyecto y gesti.n/ }).click();
  await page.getByRole('button', { name: /Responsable y contratos/ }).click();
}

test.describe('Edit asset persistence', () => {
  test('QA-EDIT-032: browser back and forward do not show stale cached form data after save', testMetadata('QA-EDIT-032', 'Verifies browser history navigation reloads the saved value instead of stale form state.'), async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValue = false;
    let originalMemorando = '';

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      await openResponsablePanel(page);

      originalMemorando = await editAsset.memorandoField.inputValue();
      const editedMemorando = originalMemorando === 'QA browser nav'
        ? 'QA browser nav 2'
        : 'QA browser nav';

      await editAsset.memorandoField.fill(editedMemorando);
      await expect(editAsset.memorandoField).toHaveValue(editedMemorando);

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValue = true;

      await page.goBack();
      await expect(page).toHaveURL(/dashboard/);
      expect(page.url()).not.toContain(`/detalle/${PLATE}`);

      await page.goForward();
      await expect(page).toHaveURL(new RegExp(`/dashboard/bienelectrico/detalle/${PLATE}`));
      await expect(editAsset.editBtn).toBeVisible();

      await editAsset.editBtn.click();
      await openResponsablePanel(page);
      await expect(editAsset.memorandoField).toHaveValue(editedMemorando);
    } finally {
      if (savedEditedValue) {
        await editAsset.goto(PLATE);
        await openResponsablePanel(page);
        await editAsset.memorandoField.fill(originalMemorando);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });
});
