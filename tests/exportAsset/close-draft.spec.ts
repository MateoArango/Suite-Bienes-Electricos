// spec: specs/exportAsset.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";

test.describe("Navigation, initial state, and selector contract", () => {
  test("closes with Cancel without persisting draft values", async ({
    page,
  }) => {
    const exportPosts: string[] = [];
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        new URL(request.url()).pathname ===
          "/electrical-assets/report/electrical-assets/excel"
      ) {
        exportPosts.push(request.url());
      }
    });

    const exportAssetPage = new ExportAssetPage(page);
    await exportAssetPage.login("qa", "123456");

    // 1. Open the drawer, populate several filters, then click Cancelar.
    await exportAssetPage.open();
    await exportAssetPage.startDateInput.fill("1/1/2025");
    await exportAssetPage.endDateInput.fill("21/7/2026");
    await exportAssetPage.licensePlateInput.fill("DRAFT-123");
    expect(exportPosts).toHaveLength(0);
    await exportAssetPage.cancelButton.click();

    await expect(exportAssetPage.form).toBeHidden();
    await expect(page).toHaveURL(/\/dashboard\/bienelectrico\/?$/);
    expect(exportPosts).toHaveLength(0);

    // 2. Reopen and expect populated draft fields to be blank and municipality disabled.
    await exportAssetPage.open();

    await expect(exportAssetPage.form).toBeVisible();
    await expect(exportAssetPage.startDateInput).toHaveValue("");
    await expect(exportAssetPage.endDateInput).toHaveValue("");
    await expect(exportAssetPage.licensePlateInput).toHaveValue("");
    await expect(exportAssetPage.municipalitySelect).toHaveText("");
    await expect(exportAssetPage.municipalitySelect).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(exportPosts).toHaveLength(0);
  });
});
