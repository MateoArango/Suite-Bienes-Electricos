import { Page, Request } from '@playwright/test';
import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

/**
 * QA-EDIT-006
 *
 * The edit save endpoint uses PATCH, but sends the full article-resume object.
 * This test edits a small safe set of fields, verifies the outgoing payload keeps
 * the full object contract, confirms the changed values are sent, and checks a
 * small set of important unchanged fields are preserved.
 *
 * The changed values are restored in finally so the QA plate is not left dirty.
 */

const PLATE = '0000247634';
const UPDATE_PATH = `/electrical-assets/article-resume/${PLATE}`;

async function waitForUpdateRequest(page: Page): Promise<Request> {
  return page.waitForRequest(request =>
    request.method() === 'PATCH' &&
    request.url().includes(UPDATE_PATH)
  );
}

async function saveAndCapturePayload(page: Page, editAsset: EditAssetPage) {
  const updateRequestPromise = waitForUpdateRequest(page);

  await editAsset.saveBtn.click();

  const updateRequest = await updateRequestPromise;
  const updateResponse = await updateRequest.response();
  const payload = updateRequest.postDataJSON();

  expect(updateResponse?.ok(), 'Update request should succeed').toBeTruthy();

  return {
    request: updateRequest,
    payload,
  };
}

test('QA-EDIT-006: save sends full update payload and preserves important fields', async ({ page, apiContext, authToken }) => {
  const basePage = new BasePage(page);
  const editAsset = new EditAssetPage(page);

  const response = await apiContext.get(UPDATE_PATH, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  expect(response.ok(), `API call failed for plate ${PLATE}`).toBeTruthy();

  const original = await response.json();
  const originalVereda = original.ubicacionYRegistro.vereda ?? '';
  const originalLatitud = original.ubicacionYRegistro.latitud ?? '';
  const originalLocalidad = original.ubicacionYRegistro.localidad ?? '';
  const editedVereda = originalVereda === 'QA payload check'
    ? 'QA payload check 2'
    : 'QA payload check';
  const editedLatitud = originalLatitud === '12.19888889' ? '12.19888888' : '12.19888889';
  const editedLocalidad = originalLocalidad === 'QA localidad payload check'
    ? 'QA localidad payload check 2'
    : 'QA localidad payload check';

  let savedEditedValue = false;

  await basePage.login('qa', '123456');
  await expect(page).toHaveURL(/dashboard/);
  await editAsset.goto(PLATE);

  try {
    await editAsset.veredaField.fill(editedVereda);
    await editAsset.latitudField.fill(editedLatitud);
    await editAsset.localidadField.fill(editedLocalidad);

    const { request, payload } = await saveAndCapturePayload(page, editAsset);
    savedEditedValue = true;

    expect(request.method()).toBe('PATCH');
    expect(request.url()).toContain(UPDATE_PATH);

    expect(payload).toEqual(expect.objectContaining({
      codigoPlaca: original.codigoPlaca,
      placa: original.placa,
      codigoExterno: original.codigoExterno,
    }));

    expect(payload).toHaveProperty('codigoPlaca');
    expect(payload).toHaveProperty('placa');
    expect(payload).toHaveProperty('codigoExterno');
    expect(payload).toHaveProperty('descripcionArticulo');
    expect(payload).toHaveProperty('estado');
    expect(payload).toHaveProperty('descripcionEstado');
    expect(payload).toHaveProperty('ubicacionYRegistro');
    expect(payload).toHaveProperty('proyectoYGestion');
    expect(payload).toHaveProperty('equipoYAvaluo');
    expect(payload).toHaveProperty('redYEstructura');
    expect(payload).toHaveProperty('datosGenerales');
    expect(payload).toHaveProperty('datosAdicionales');

    expect(payload.ubicacionYRegistro.vereda).toBe(editedVereda);
    expect(payload.ubicacionYRegistro.latitud).toBe(editedLatitud);
    expect(payload.ubicacionYRegistro.localidad).toBe(editedLocalidad);
    expect(payload.ubicacionYRegistro.longitud).toBe(original.ubicacionYRegistro.longitud);

    console.log('Changed field comparison:', {
      vereda: { original: originalVereda, sent: payload.ubicacionYRegistro.vereda },
      latitud: { original: originalLatitud, sent: payload.ubicacionYRegistro.latitud },
      localidad: { original: originalLocalidad, sent: payload.ubicacionYRegistro.localidad },
    });
  } finally {
    if (savedEditedValue) {
      await editAsset.goto(PLATE);
      await editAsset.veredaField.fill(originalVereda);
      await editAsset.latitudField.fill(originalLatitud);
      await editAsset.localidadField.fill(originalLocalidad);
      await saveAndCapturePayload(page, editAsset);
    }
  }
});
