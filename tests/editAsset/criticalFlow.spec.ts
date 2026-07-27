import { Page } from "@playwright/test";
import { test, expect } from "../fixtures";
import { BasePage } from "../pages/BasePage";
import { EditAssetPage } from "../pages/editAssetPage";
import { testMetadata } from "../helpers/testMetadata";

const PLATE = "0000247634";
const UPDATE_PATH = `/electrical-assets/article-resume/${PLATE}`;
const SUCCESS_TOAST = "Cambios guardados correctamente";

async function saveAndExpectSuccess(page: Page, editAsset: EditAssetPage) {
  const updateResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "PATCH" &&
      response.url().includes(UPDATE_PATH),
  );

  await editAsset.saveBtn.click();

  const updateResponse = await updateResponsePromise;
  expect(
    updateResponse.ok(),
    `Update failed: ${updateResponse.status()} ${await updateResponse.text()}`,
  ).toBe(true);
  await expect(page.getByText(SUCCESS_TOAST)).toBeVisible();
}

async function openRegistroPanel(page: Page) {
  await page.getByRole("button", { name: /Registro Enlaces y/ }).click();
}

async function waitForUnexpectedUpdate(page: Page) {
  return page
    .waitForRequest(
      (request) =>
        request.method() === "PATCH" && request.url().includes(UPDATE_PATH),
      { timeout: 1000 },
    )
    .then(() => true)
    .catch(() => false);
}

test.describe.configure({ mode: 'serial' });
test.describe("Edit asset critical flow", () => {
  test("QA-EDIT-002: edit one required field and persist it after save", testMetadata('QA-EDIT-002', 'Edits one required field, confirms the PATCH succeeds, and verifies persistence after reopening.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValue = false;
    let originalFotos = "";

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      await openRegistroPanel(page);
      originalFotos = await editAsset.enlaceFotosField.inputValue();
      const editedFotos =
        originalFotos === "https://www.google.com/?qa=edit002"
          ? "https://www.google.com/?qa=edit002b"
          : "https://www.google.com/?qa=edit002";

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

  test("QA-EDIT-003: edit required fields across panels and persist them after save", testMetadata('QA-EDIT-003', 'Edits required fields in multiple panels and verifies all saved values after reopening.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValues = false;
    let originalLatitud = "";
    let originalCarpetaAltitud = "";

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLatitud = await editAsset.latitudField.inputValue();
      const editedLatitud =
        originalLatitud === "12.19888889" ? "12.19888888" : "12.19888889";
      await openRegistroPanel(page);
      await editAsset.latitudField.fill(editedLatitud);
      await expect(editAsset.latitudField).toHaveValue(editedLatitud);

      originalCarpetaAltitud = await editAsset.carpetaAltitudField.inputValue();
      const editedCarpetaAltitud =
        originalCarpetaAltitud === "https://www.google.com/?qa=edit003-altitud"
          ? "https://www.google.com/?qa=edit003-altitud-b"
          : "https://www.google.com/?qa=edit003-altitud";

      await editAsset.carpetaAltitudField.fill(editedCarpetaAltitud);

      await expect(editAsset.latitudField).toHaveValue(editedLatitud);
      await expect(editAsset.carpetaAltitudField).toHaveValue(
        editedCarpetaAltitud,
      );

      await saveAndExpectSuccess(page, editAsset);
      savedEditedValues = true;

      await editAsset.goto(PLATE);
      await openRegistroPanel(page);
      await expect(editAsset.latitudField).toHaveValue(editedLatitud);
      await expect(editAsset.carpetaAltitudField).toHaveValue(
        editedCarpetaAltitud,
      );
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

  test("QA-EDIT-004: clear required field blocks save with inline validation", testMetadata('QA-EDIT-004', 'Blocks save and displays inline validation after a required edit field is cleared.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);
    await openRegistroPanel(page);

    await editAsset.enlaceFotosField.fill("");
    await editAsset.enlaceArcgisField.click();

    await expect(page.getByText("Campo obligatorio").first()).toBeVisible();
    await expect(editAsset.saveBtn).toBeDisabled();
  });

  test("QA-EDIT-005: clear optional field and persist empty value after save", testMetadata('QA-EDIT-005', 'Allows an optional field to be cleared and persists its empty value after save.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEmptyValue = false;
    let originalDescripcion = "";

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalDescripcion =
        await editAsset.ubicacionDescripcionField.inputValue();
      await openRegistroPanel(page);
      await editAsset.ubicacionDescripcionField.fill("");
      await editAsset.latitudField.click();

      await expect(editAsset.ubicacionDescripcionField).toHaveValue("");
      await expect(
        page
          .getByTestId("activesDetailUbicacionForm")
          .locator("mat-error")
          .filter({ hasText: "Campo obligatorio" }),
      ).toHaveCount(0);

      await saveAndExpectSuccess(page, editAsset);
      savedEmptyValue = true;

      await editAsset.goto(PLATE);
      await expect(editAsset.ubicacionDescripcionField).toHaveValue("");
    } finally {
      if (savedEmptyValue) {
        await editAsset.goto(PLATE);
        await openRegistroPanel(page);
        await editAsset.ubicacionDescripcionField.fill(originalDescripcion);
        await saveAndExpectSuccess(page, editAsset);
      }
    }
  });

  test("QA-EDIT-007: cancel discards changes without sending update request", testMetadata('QA-EDIT-007', 'Cancels an edit, restores the persisted value, and sends no update request.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    await openRegistroPanel(page);

    const originalNombrePlantilla =
      await editAsset.nombrePlantillaField.inputValue();
    const editedNombrePlantilla =
      originalNombrePlantilla === "QA cancel" ? "QA cancel2" : "QA cancel";
    const updateRequestPromise = waitForUnexpectedUpdate(page);

    await editAsset.nombrePlantillaField.fill(editedNombrePlantilla);
    await expect(editAsset.nombrePlantillaField).toHaveValue(
      editedNombrePlantilla,
    );
    await editAsset.cancelBtn.click();
    await editAsset.cancelDialogBtn.click();
    expect(await updateRequestPromise).toBe(false);

    await editAsset.goto(PLATE);
    await openRegistroPanel(page);
    await expect(editAsset.nombrePlantillaField).toHaveValue(
      originalNombrePlantilla,
    );
  });

  test("QA-EDIT-008: saved value survives hard reload and reopen", testMetadata('QA-EDIT-008', 'Confirms a saved field value survives hard reload and a fresh reopen of the asset.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    let savedEditedValue = false;
    let originalLocalidad = "";

    await basePage.login("qa", "123456");
    await expect(page).toHaveURL(/dashboard/);
    await editAsset.goto(PLATE);

    try {
      originalLocalidad = await editAsset.localidadField.inputValue();
      const editedLocalidad =
        originalLocalidad === "QA reload check"
          ? "QA reload check 2"
          : "QA reload check";

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

  test("QA-EDIT-009: direct URL opens a valid asset edit form", testMetadata('QA-EDIT-009', 'Opens a valid asset directly by URL and renders its editable form controls.'), async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const editAsset = new EditAssetPage(page);

    await basePage.login("qa", "123456");
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
