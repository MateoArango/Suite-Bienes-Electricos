import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '0000247634';
const OTHER_PLATE = '00000198';

test.describe('Edit asset accordion behavior', () => {
  test('QA-EDIT-028: panel edits persist across expand and collapse', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    const editedLocalidad = 'QA accordion retained';
    const ubicacionPanel = page.getByRole('button', { name: /Ubicaci.n Datos geogr.ficos/ });
    const registroPanel = page.getByRole('button', { name: /Registro Enlaces y/ });

    await editAsset.localidadField.fill(editedLocalidad);
    await expect(editAsset.localidadField).toHaveValue(editedLocalidad);

    await ubicacionPanel.click();
    await registroPanel.click();
    await ubicacionPanel.click();

    await expect(editAsset.localidadField).toHaveValue(editedLocalidad);
  });

  test('QA-EDIT-029: refresh mid-edit discards unsaved changes', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    const originalLocalidad = await editAsset.localidadField.inputValue();
    const editedLocalidad = originalLocalidad === 'QA unsaved refresh'
      ? 'QA unsaved refresh 2'
      : 'QA unsaved refresh';

    await editAsset.localidadField.fill(editedLocalidad);
    await expect(editAsset.localidadField).toHaveValue(editedLocalidad);

    await page.reload();
    await editAsset.goto(PLATE);

    await expect(editAsset.localidadField).toHaveValue(originalLocalidad);
  });

  test('QA-EDIT-030: navigating to another plate discards unsaved changes without confirmation', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);
    let dialogShown = false;

    page.on('dialog', async dialog => {
      dialogShown = true;
      await dialog.dismiss();
    });

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    const originalLocalidad = await editAsset.localidadField.inputValue();
    const editedLocalidad = originalLocalidad === 'QA leave unsaved'
      ? 'QA leave unsaved 2'
      : 'QA leave unsaved';

    await editAsset.localidadField.fill(editedLocalidad);
    await expect(editAsset.localidadField).toHaveValue(editedLocalidad);

    await page.goto(`/dashboard/bienelectrico/detalle/${OTHER_PLATE}`);
    await expect(page).toHaveURL(new RegExp(OTHER_PLATE));
    expect(dialogShown).toBe(false);

    await editAsset.goto(PLATE);
    await expect(editAsset.localidadField).toHaveValue(originalLocalidad);
  });

  test('QA-EDIT-030B: Red y estructuras keeps multiple panels open and editable', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    await page.getByRole('tab', { name: /Red y estructuras/ }).click();

    const apoyoValue = 'QA apoyo';
    const conductorValue = 'QA conductor';
    const codigoValue = 'QA codigo';

    await editAsset.materialApoyoField.fill(apoyoValue);
    await page.getByRole('button', { name: /Conductor y red/ }).click();

    await expect(editAsset.materialApoyoField).toBeVisible();
    await expect(editAsset.materialApoyoField).toHaveValue(apoyoValue);

    await editAsset.materialConductorField.fill(conductorValue);
    await page.getByRole('button', { name: 'Código Creg y otros' }).click();

    await expect(editAsset.materialApoyoField).toBeVisible();
    await expect(editAsset.materialConductorField).toBeVisible();
    await expect(editAsset.materialApoyoField).toHaveValue(apoyoValue);
    await expect(editAsset.materialConductorField).toHaveValue(conductorValue);

    await editAsset.atributosApoyoField.fill(codigoValue);

    await expect(editAsset.materialApoyoField).toHaveValue(apoyoValue);
    await expect(editAsset.materialConductorField).toHaveValue(conductorValue);
    await expect(editAsset.atributosApoyoField).toHaveValue(codigoValue);
  });
});
