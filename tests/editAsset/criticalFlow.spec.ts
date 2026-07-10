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

async function waitForUnexpectedUpdate(page: Page) {
  return page.waitForRequest(
    request =>
      request.method() === 'PATCH' &&
      request.url().includes(UPDATE_PATH),
    { timeout: 1000 }
  )
    .then(() => true)
    .catch(() => false);
}


test.describe.configure({ mode: 'serial' });// Run tests in this file serially to avoid conflicts on the same asset.
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

  test('QA-EDIT-003: edit required fields across panels and persist them after save', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValues = false;
    let originalLatitud = '';
    let originalCarpetaAltitud = '';

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLatitud = await editAsset.latitudField.inputValue();
      const editedLatitud = originalLatitud === '12.19888889' ? '12.19888888' : '12.19888889';
      await openRegistroPanel(page);
      await editAsset.latitudField.fill(editedLatitud);
      await expect(editAsset.latitudField).toHaveValue(editedLatitud);

      
      originalCarpetaAltitud = await editAsset.carpetaAltitudField.inputValue();
      const editedCarpetaAltitud = originalCarpetaAltitud === 'https://www.google.com/?qa=edit003-altitud'
        ? 'https://www.google.com/?qa=edit003-altitud-b'
        : 'https://www.google.com/?qa=edit003-altitud';

      await editAsset.carpetaAltitudField.fill(editedCarpetaAltitud);

      await expect(editAsset.latitudField).toHaveValue(editedLatitud);
      await expect(editAsset.carpetaAltitudField).toHaveValue(editedCarpetaAltitud);

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValues = true;

      await editAsset.goto(PLATE);
      await openRegistroPanel(page);
      await expect(editAsset.latitudField).toHaveValue(editedLatitud);
      await expect(editAsset.carpetaAltitudField).toHaveValue(editedCarpetaAltitud);
    } finally {
      if (savedEditedValues) {
        await editAsset.goto(PLATE);
        await editAsset.latitudField.fill(originalLatitud);
        await openRegistroPanel(page);
        await editAsset.carpetaAltitudField.fill(originalCarpetaAltitud);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });

  test('QA-EDIT-004: clear required field blocks save with inline validation', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);
    await openRegistroPanel(page);

    await editAsset.enlaceFotosField.fill('');
    await editAsset.enlaceArcgisField.click();

    await expect(page.getByText('Campo obligatorio').first()).toBeVisible();
    await expect(editAsset.saveBtn).toBeDisabled();
  });

  test('QA-EDIT-005: clear optional field and persist empty value after save', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEmptyValue = false;
    let originalLocalidad = '';

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLocalidad = await editAsset.localidadField.inputValue();

      await editAsset.localidadField.fill('');
      await editAsset.latitudField.click();

      await expect(editAsset.localidadField).toHaveValue('');
      await expect(page.getByTestId('activesDetailUbicacionForm').locator('mat-error').filter({ hasText: 'Campo obligatorio' })).toHaveCount(0);

      await saveAndExpectSuccess(page, editAsset);
      savedEmptyValue = true;

      await editAsset.goto(PLATE);
      await expect(editAsset.localidadField).toHaveValue('');
    } finally {
      if (savedEmptyValue) {
        await editAsset.goto(PLATE);
        await editAsset.localidadField.fill(originalLocalidad);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });

  test('QA-EDIT-007: cancel discards changes without sending update request', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    await openRegistroPanel(page);

    const originalNombrePlantilla = await editAsset.nombrePlantillaField.inputValue();
    const editedNombrePlantilla = originalNombrePlantilla === 'QA cancel'
      ? 'QA cancel2'
      : 'QA cancel';
    const updateRequestPromise = waitForUnexpectedUpdate(page);

    await editAsset.nombrePlantillaField.fill(editedNombrePlantilla);
    await expect(editAsset.nombrePlantillaField).toHaveValue(editedNombrePlantilla);
    await editAsset.cancelBtn.click();
    await editAsset.cancelDialogBtn.click();
    expect(await updateRequestPromise).toBe(false);

    await editAsset.goto(PLATE);
    await openRegistroPanel(page);
    await expect(editAsset.nombrePlantillaField).toHaveValue(originalNombrePlantilla);
  });

  test('QA-EDIT-008: saved value survives hard reload and reopen', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValue = false;
    let originalLocalidad = '';

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLocalidad = await editAsset.localidadField.inputValue();
      const editedLocalidad = originalLocalidad === 'QA reload check'
        ? 'QA reload check 2'
        : 'QA reload check';

      await editAsset.localidadField.fill(editedLocalidad);
      await expect(editAsset.localidadField).toHaveValue(editedLocalidad);

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValue = true;

      await page.reload();
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

  test('QA-EDIT-009: direct URL opens a valid asset edit form', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);

    await page.goto(`/dashboard/bienelectrico/detalle/${PLATE}`);
    await expect(editAsset.editBtn).toBeVisible();
    await expect(editAsset.editBtn).toBeEnabled();

    await editAsset.editBtn.click();

    await expect(editAsset.saveBtn).toBeVisible();
    await expect(editAsset.cancelBtn).toBeVisible();
    await expect(editAsset.latitudField).toBeVisible();
    await expect(editAsset.longitudField).toBeVisible();
    await expect(editAsset.veredaField).toBeVisible();
  });
});
