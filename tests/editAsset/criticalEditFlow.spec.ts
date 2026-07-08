import { test, expect } from '../createAsset/fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '00000196'; // status: editable 196 - 198 - 077

test('QA-EDIT-001: prepopulated fields match API source', async ({ page, apiContext, authToken }) => {
  const basePage = new BasePage(page);
  const editAsset = new EditAssetPage(page);

  // 1. Get source-of-truth data directly from the API
  const response = await apiContext.get(
    `/electrical-assets/article-resume/${PLATE}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  expect(response.ok(), `API call failed for plate ${PLATE}`).toBeTruthy();
  const asset = await response.json();
  console.log('Article resume API response:', JSON.stringify(asset, null, 2));
  const ubicacion = asset.ubicacionYRegistro;

  // 2. Open the edit form in the UI
  await basePage.login('qa', '123456');
  await expect(page).toHaveURL(/dashboard/);
  await editAsset.goto(PLATE);

  // 3. Cross-check each accordion field against the API response
  //    mat-select fields render as visible text -> toContainText()
  await expect(editAsset.departamentoField).toContainText(ubicacion.nombreDepartamento);
  await expect(editAsset.municipioField).toContainText(ubicacion.nombreMunicipio);

  //    real inputs -> toHaveValue()
  if (ubicacion.latitud !== null) {
    await expect(editAsset.latitudField).toHaveValue(String(ubicacion.latitud));
  }
  if (ubicacion.longitud !== null) {
    await expect(editAsset.longitudField).toHaveValue(String(ubicacion.longitud));
  }
  if (ubicacion.vereda !== null) {
    await expect(editAsset.veredaField).toHaveValue(String(ubicacion.vereda));
  }
});
