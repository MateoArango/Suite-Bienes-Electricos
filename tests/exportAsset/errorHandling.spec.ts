// spec: specs/exportAsset.plan.md
// seed: tests/seed.spec.ts

import { expect, test, type Locator } from "@playwright/test";
import * as XLSX from "xlsx";
import { ExportAssetPage } from "../pages/ExportAssetPage";
import { testMetadata } from "../helpers/testMetadata";

const exportEndpoint = "/electrical-assets/report/electrical-assets/excel";

test.describe("Export report error handling", () => {
  test("handles lookup endpoint failures and recovery", testMetadata('QA-EXPORT-020', 'Exercises lookup 401, 403, 500, timeout, and malformed responses, then verifies controls recover after successful reloads.'), async ({ page }) => {
    const exportAssetPage = new ExportAssetPage(page);
    const endpoints = ["departments", "cities", "estados", "grupos"] as const;
    type Endpoint = (typeof endpoints)[number];

    /**
     * Lookup failure meanings:.
     * - 401 Unauthorized: the user is not authenticated or the session expired.
     * - 403 Forbidden: the user is authenticated but lacks permission.
     * - 500 Internal Server Error: the server failed while processing the request.
     * - timeout: the lookup request did not complete in time.
     * - malformed: the server returned HTTP 200 with invalid JSON.
     */
    type Failure = 401 | 403 | 500 | "timeout" | "malformed";

    const controls: Record<Endpoint, Locator> = {
      departments: exportAssetPage.departmentSelect,
      cities: exportAssetPage.municipalitySelect,
      estados: exportAssetPage.stateSelect,
      grupos: exportAssetPage.groupSelect,
    };
    const responseBodies = new Map<
      Endpoint,
      { body: Buffer; contentType: string }
    >();
    let failure: { endpoint: Endpoint; kind: Failure } | undefined;

    for (const endpoint of endpoints) {
      await page.route(
        `**/electrical-assets/report/${endpoint}**`,
        async (route) => {
          if (failure?.endpoint === endpoint) {
            if (failure.kind === "timeout") {
              await route.abort("timedout");
              return;
            }

            if (failure.kind === "malformed") {
              await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: "{not-valid-json",
              });
              return;
            }

            await route.fulfill({
              status: failure.kind,
              contentType: "application/json",
              body: JSON.stringify({ message: "Stubbed lookup failure" }),
            });
            return;
          }

          const cached = responseBodies.get(endpoint);
          if (cached) {
            await route.fulfill({
              status: 200,
              contentType: cached.contentType,
              body: cached.body,
            });
            return;
          }

          const response = await route.fetch();
          const body = await response.body();
          responseBodies.set(endpoint, {
            body,
            contentType:
              response.headers()["content-type"] ?? "application/json",
          });
          await route.fulfill({ response, body });
        },
      );
    }

    await exportAssetPage.login("qa", "123456");
    await expect(page).toHaveURL(/\/dashboard\/bienelectrico\/?$/);

    const waitForLookupRequests = () =>
      Promise.all(
        endpoints.map((endpoint) =>
          page.waitForRequest((request) => {
            const url = new URL(request.url());
            return (
              request.method() === "GET" &&
              url.pathname === `/electrical-assets/report/${endpoint}`
            );
          }),
        ),
      );

    const openAndWaitForLookups = async () => {
      const requests = waitForLookupRequests();
      await page.reload();
      await expect(page).toHaveURL(/\/dashboard\/bienelectrico\/?$/);
      await exportAssetPage.open();
      await requests;
      await expect(exportAssetPage.drawer).toBeVisible();
      await expect(exportAssetPage.heading).toBeVisible();
    };

    const optionLabels = async (control: Locator) => {
      await control.click();
      const labels = (await page.getByRole("option").allTextContents()).map(
        (label) => label.trim(),
      );
      await page.keyboard.press("Escape");
      return labels;
    };

    const prepareMunicipality = async () => {
      await exportAssetPage.departmentSelect.click();
      const department = page
        .getByRole("option")
        .filter({ hasNotText: /^Todos$/ })
        .first();
      await expect(department).toBeVisible();
      await department.click();
      await page.keyboard.press("Escape");
    };

    await exportAssetPage.open();
    await expect(exportAssetPage.drawer).toBeVisible();
    await expect.poll(() => responseBodies.size).toBe(endpoints.length);

    const successfulLabels = new Map<Endpoint, string[]>();
    successfulLabels.set(
      "departments",
      await optionLabels(exportAssetPage.departmentSelect),
    );
    await prepareMunicipality();
    successfulLabels.set(
      "cities",
      await optionLabels(exportAssetPage.municipalitySelect),
    );
    successfulLabels.set("estados", await optionLabels(exportAssetPage.stateSelect));
    successfulLabels.set("grupos", await optionLabels(exportAssetPage.groupSelect));
    await exportAssetPage.cancelButton.click();

    /**
     * Product gap: the application currently fails silently for these lookup
     * errors. This test therefore proves only that the drawer remains stable,
     * stale values are hidden, and data can be recovered after a reload. It
     * does not yet prove complete user-facing error handling because there is
     * no visible error toast/message or explicit Retry action.
     *
     * The commented assertions below document the intended UX contract. They
     * should be enabled when the frontend implements the notification and its
     * final copy is confirmed.
     */
    const cases: ReadonlyArray<{
      endpoint: Endpoint;
      kind: Failure;
      expectedError: string;
    }> = [
      {
        endpoint: "departments",
        kind: 401,
        expectedError: "Tu sesión ha expirado. Inicia sesión nuevamente.",
      },
      {
        endpoint: "cities",
        kind: 403,
        expectedError: "No tienes permisos para consultar estos datos.",
      },
      {
        endpoint: "estados",
        kind: 500,
        expectedError: "No fue posible cargar los datos. Inténtalo nuevamente.",
      },
      {
        endpoint: "grupos",
        kind: "malformed",
        expectedError: "No fue posible cargar los datos. Inténtalo nuevamente.",
      },
      {
        endpoint: "departments",
        kind: "timeout",
        expectedError: "La solicitud tardó demasiado. Inténtalo nuevamente.",
      },
    ];

    // 1. Independently stub departments, cities, states, and groups with 401/403, 500, timeout, and malformed JSON.
    for (const currentFailure of cases) {
      failure = currentFailure;
      await openAndWaitForLookups();

      // TODO: Enable when lookup failures produce a user-visible notification.
      // await expect(
      //   page.getByText(currentFailure.expectedError, { exact: true }),
      // ).toBeVisible();

      // The drawer must remain usable and provide its real recovery affordance: close and reopen.
      await expect(exportAssetPage.cancelButton).toBeVisible();
      await expect(exportAssetPage.clearButton).toBeVisible();
      await expect(exportAssetPage.submitButton).toBeVisible();

      if (currentFailure.endpoint === "cities") {
        await prepareMunicipality();
      }

      const control = controls[currentFailure.endpoint];
      await expect(control).not.toContainText(
        new RegExp(
          (successfulLabels.get(currentFailure.endpoint) ?? [])
            .filter((label) => !["Todos", "Ninguno"].includes(label))
            .slice(0, 3)
            .map((label) => label.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&"))
            .join("|") || "a^",
        ),
      );

      await exportAssetPage.cancelButton.click();
      await expect(exportAssetPage.drawer).toBeHidden();
    }

    // 2. Retry by reopening after restoring every lookup to a 200 response.
    failure = undefined;
    await openAndWaitForLookups();

    for (const endpoint of endpoints) {
      if (endpoint === "cities") {
        await prepareMunicipality();
      }

      const labels = await optionLabels(controls[endpoint]);
      expect(labels.length).toBeGreaterThan(0);
      // Some distinct API records legitimately share a display label. Equality
      // with the initial list proves recovery did not append another copy.
      expect(labels).toEqual(successfulLabels.get(endpoint));
    }
  });

  test("prevents duplicate exports during a slow request", testMetadata('QA-EXPORT-021', 'Allows only one export request while a slow response is pending and restores the submit action afterward.'), async ({ page }) => {
    const exportAssetPage = new ExportAssetPage(page);
    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([["Placa"], ["00000502"]]),
      "Bienes",
    );
    const validXlsx = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    }) as Buffer;

    let releaseResponse!: () => void;
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    let exportPostCount = 0;
    let markFirstRequest!: () => void;
    const firstRequestReceived = new Promise<void>((resolve) => {
      markFirstRequest = resolve;
    });

    await page.route(`**${exportEndpoint}`, async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }

      exportPostCount += 1;
      if (exportPostCount === 1) {
        markFirstRequest();
      }

      await responseGate;
      await route.fulfill({
        status: 200,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers: {
          "Content-Disposition":
            'attachment; filename="reporte_2026-07-27_12.00.xlsx"',
        },
        body: validXlsx,
      });
    });

    let downloadCount = 0;
    page.on("download", () => {
      downloadCount += 1;
    });

    const responsePromise = page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        response.request().method() === "POST" &&
        url.pathname === exportEndpoint
      );
    });
    const downloadPromise = page.waitForEvent("download");

    // 1. Rapidly submit while the mocked successful response remains pending.
    await exportAssetPage.submitButton.evaluate((button) => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        (button as HTMLElement).click();
      }
    });
    await firstRequestReceived;

    await expect(exportAssetPage.submitButton).toBeDisabled();
    expect(exportPostCount).toBe(1);
    expect(downloadCount).toBe(0);
    await expect(
      page.getByText(exportAssetPage.msgSuccess),
    ).not.toBeVisible();

    // 2. Release the response and verify one clean completion.
    releaseResponse();
    const [response, download] = await Promise.all([
      responsePromise,
      downloadPromise,
    ]);

    expect(response.status()).toBe(200);
    expect(exportPostCount).toBe(1);
    expect(downloadCount).toBe(1);
    expect(download.suggestedFilename()).toMatch(
      /^reporte_\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.xlsx$/,
    );
    await expect(
      page.getByText(exportAssetPage.msgSuccess),
    ).toHaveCount(1);
    await expect(exportAssetPage.submitButton).toBeEnabled();
    await expect(exportAssetPage.drawer).toBeVisible();
  });
});
