import { test, expect } from "@playwright/test";
import { BasePage } from "./pages/BasePage";

test.describe("Test group", () => {
  test("seed", async ({ page }) => {
    // generate code here.
    /* buttons
    getByTestId('generateReportClearButton')
getByTestId('generateReportCancelButton')
*/
    const basePage = new BasePage(page);
    await basePage.login("qa", "123456");
    await page.getByRole("button").filter({ hasText: "download" }).click();
    await page.getByTestId("generateReportStartDate").click();
    await page.getByTestId("generateReportStartDate").fill("1/1/2025");
    await page.getByTestId("generateReportEndDate").click();
    await page.getByTestId("generateReportEndDate").fill("21/7/2026");
    await page
      .getByTestId("generateReportForm")
      .getByText("Departamento")
      .click();
    await page.getByRole("option", { name: "ANTIOQUIA" }).click();
    await page.keyboard.press("Escape");
    await page.getByTestId("generateReportForm").getByText("Municipio").click();
    await page.getByRole("option", { name: "ABEJORRAL" }).click();
    await page.keyboard.press("Escape");
    //await page.getByTestId("generateReportLicensePlateInput").fill("123");
    //await page.getByTestId("generateReportStateSelect").click();
    //await page.getByRole("option", { name: "Descargo" }).click();
    await page.keyboard.press("Escape");
    //await page.getByTestId("generateReportGroupSelect").click();
    //await page.getByRole("option", { name: "Bodegas" }).click();
    await page.keyboard.press("Escape");

    await page.getByTestId("generateReportSubmitButton").click();
    //await expect(page.getByText('No hay datos para exportar con los filtros enviados')).toBeVisible();
    await expect(page.getByText("Reporte generado correctamente")).toBeVisible({
      timeout: 10000,
    });
  });
});
