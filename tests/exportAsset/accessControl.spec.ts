// spec: specs/exportAsset.plan.md
// seed: tests/exportAsset/seed.spec.ts

import { test, expect, Page } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";

const exportEndpoint =
  "/electrical-assets/report/electrical-assets/excel";

async function logoutFrom(page: Page) {
  // TODO: Replace this explicit blocker when the application exposes a
  // stable logout test ID, accessible name, or shared page-object helper.
  // No reliable logout locator is currently established in the repository.
  void page;
  throw new Error("A stable logout locator must be defined");
}

test.describe("Generate Report access control", () => {
  test.fixme(
    "4.8 invalidates the authenticated session across open tabs after logout",
    async ({ browser }) => {
      // Confirmed current defect: after logout in tab A, the already-open tab B
      // still receives HTTP 200 from protected departments, grupos, estados,
      // and excel endpoints. Keep this fixme until the token is invalidated
      // server-side and logout propagates to every tab.
      const context = await browser.newContext();
      const tabA = await context.newPage();
      const tabAExportPage = new ExportAssetPage(tabA);

      // 1. Authenticate in one browser context and open two tabs sharing the same session.
      await tabAExportPage.login("qa", "123456");
      const tabB = await context.newPage();
      await tabB.goto("/dashboard/bienelectrico");

      // 2. Open Generate Report in tab B and set the safe non-empty plate filter 00000109.
      const tabBExportPage = new ExportAssetPage(tabB);
      await tabBExportPage.open();
      await tabBExportPage.licensePlateInput.fill("00000109");
      await expect(tabBExportPage.licensePlateInput).toHaveValue(
        "00000109",
      );

      // 3. Log out in tab A and wait for logout to complete.
      await logoutFrom(tabA);

      // 4. From the already-open tab B, submit only the filtered report while synchronizing with its POST.
      let downloadOccurred = false;
      tabB.on("download", () => {
        downloadOccurred = true;
      });
      const responsePromise = tabB.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          new URL(response.url()).pathname === exportEndpoint,
      );
      await tabBExportPage.submitButton.click();
      const response = await responsePromise;

      // 5. Verify the invalidated session blocks export and propagates to tab B without a manual reload.
      expect([401, 403]).toContain(response.status());
      await expect(
        tabB.getByText(tabBExportPage.msgSuccess),
      ).toBeHidden();
      await expect(tabB).not.toHaveURL(/generar-reporte/);
      expect(downloadOccurred).toBe(false);

      await context.close();
    },
  );
});
