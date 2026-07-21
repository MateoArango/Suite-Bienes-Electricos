import { test, expect } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";

test.describe("Full Path", () => {
  test("Full path and all the filters", async ({ page }) => {
    // generate code here.
    /* buttons
    getByTestId('generateReportClearButton')
getByTestId('generateReportCancelButton')
*/
    const exportAssetPage = new ExportAssetPage(page);
    await exportAssetPage.login("qa", "123456");
    await page.getByRole("button").filter({ hasText: "download" }).click();
    await exportAssetPage.startDateInput.fill("1/1/2025");
    await exportAssetPage.endDateInput.fill("21/7/2026");
    await exportAssetPage.departmentSelect.click();
    await page.getByRole("option", { name: "ANTIOQUIA" }).click();
    await page.keyboard.press("Escape");
    await exportAssetPage.municipalitySelect.click();
    await page.getByRole("option", { name: "ABEJORRAL" }).click();
    await page.keyboard.press("Escape");
    //await page.getByTestId("generateReportLicensePlateInput").fill("123");
    //await page.getByTestId("generateReportStateSelect").click();
    //await page.getByRole("option", { name: "Descargo" }).click();
    await page.keyboard.press("Escape");
    //await page.getByTestId("generateReportGroupSelect").click();
    //await page.getByRole("option", { name: "Bodegas" }).click();
    await page.keyboard.press("Escape");

    await exportAssetPage.submitButton.click();
    //await expect(page.getByText('No hay datos para exportar con los filtros enviados')).toBeVisible();
    await expect(page.getByText(exportAssetPage.msgSuccess)).toBeVisible({
      timeout: 10000,
    });
  });
});

