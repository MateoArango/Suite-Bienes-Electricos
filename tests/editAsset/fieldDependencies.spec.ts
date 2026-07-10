import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '00000560';

test.describe('Edit asset field dependencies', () => {
  test('QA-EDIT-026: changing Departamento resets Municipio and Codigo DANE', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);
    const codigoDaneField = page.getByRole('textbox', { name: /C.digo DANE/ });

    await basePage.login('qa', '123456');
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    const originalMunicipioText = (await editAsset.municipioField.textContent())?.trim();
    await expect(codigoDaneField).not.toHaveValue('');

    await editAsset.departamentoField.click();
    await page.getByRole('option', { name: /CAQUET/i }).click();

    if (originalMunicipioText) {
      await expect(editAsset.municipioField).not.toContainText(originalMunicipioText);
    }
    await expect(codigoDaneField).toHaveValue('');
  });
});
