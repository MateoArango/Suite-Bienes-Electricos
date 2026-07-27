// spec: specs/exportAsset.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";
import { testMetadata } from "../helpers/testMetadata";

test.describe("Navigation, initial state, and selector contract", () => {
  test("opens the Generate report drawer from the dashboard", testMetadata('QA-EXPORT-001', 'Opens Generate Report from the dashboard and verifies its route, drawer, controls, and accessible actions.'), async ({ page }) => {
    // 1. From a fresh context, log in and verify the dashboard route.
    const exportAssetPage = new ExportAssetPage(page);
    await exportAssetPage.login("qa", "123456");

    await expect(page).toHaveURL(/\/dashboard\/bienelectrico\/?$/);

    // 2. Open Generate report through the header's download-icon button.
    await exportAssetPage.open();

    await expect(page).toHaveURL(
      /\/dashboard\/bienelectrico\/generar-reporte\/?$/,
    );

    await expect(exportAssetPage.drawer).toBeVisible();
    await expect(exportAssetPage.heading).toBeVisible();

    // 3. Assert every generateReport* test ID listed in the overview.
    const reportTestIds = [
      "generateReportForm",
      "generateReportDatesContainer",
      "generateReportStartDate",
      "generateReportEndDate",
      "generateReportDepartamentoSelect",
      "generateReportMunicipioSelect",
      "generateReportLocationContainer",
      "generateReportLicensePlateInput",
      "generateReportStateSelect",
      "generateReportGroupSelect",
      "generateReportActionsContainer",
      "generateReportCancelButton",
      "generateReportClearButton",
      "generateReportSubmitButton",
    ];

    for (const testId of reportTestIds) {
      await expect(page.getByTestId(testId)).toHaveCount(1);
      await expect(exportAssetPage.drawer.getByTestId(testId)).toHaveCount(1);
    }

    await expect(
      exportAssetPage.cancelButton,
    ).toHaveAccessibleName("Cancelar");
    await expect(
      exportAssetPage.clearButton,
    ).toHaveAccessibleName("Limpiar filtros");
    await expect(
      exportAssetPage.submitButton,
    ).toHaveAccessibleName("Generar reporte (XLS)");
  });

});
