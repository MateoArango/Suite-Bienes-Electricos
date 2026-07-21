// spec: specs/exportAsset.plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Response } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";

test.describe("Lookup data and dependent filters", () => {
  test("loads report lookup APIs with authorization and renders their values", async ({
    page,
  }) => {
    const exportAssetPage = new ExportAssetPage(page);
    await exportAssetPage.login("qa", "123456");
    await expect(page).toHaveURL(/\/dashboard\/bienelectrico\/?$/);

    // 1. Open the drawer while recording report lookup requests.
    const waitForLookup = (endpoint: string) =>
      page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname === `/electrical-assets/report/${endpoint}` &&
          response.request().method() === "GET"
        );
      });

    const departmentsPromise = waitForLookup("departments");
    const citiesPromise = waitForLookup("cities");
    const groupsPromise = waitForLookup("grupos");
    const statesPromise = waitForLookup("estados");

    await exportAssetPage.open();

    const lookupResponses: Response[] = await Promise.all([
      departmentsPromise,
      citiesPromise,
      groupsPromise,
      statesPromise,
    ]);

    for (const response of lookupResponses) {
      await expect(response.status()).toBe(200);
      expect(
        Boolean(response.request().headers().authorization?.trim()),
      ).toBe(true);
    }

    const [departmentsResponse, , groupsResponse] = lookupResponses;
    expect(
      new URL(departmentsResponse.url()).searchParams.get("sortDirection"),
    ).toBe("asc");

    const groupsPayloadText = JSON.stringify(await groupsResponse.json());

    // 2. Open each select and verify its lookup-backed values.
    await exportAssetPage.departmentSelect.click();

    const departmentOptions = page.getByRole("option");
    const departmentLabels = (await departmentOptions.allTextContents()).map(
      (label) => label.trim(),
    );

    expect(departmentLabels[0]).toBe("Todos");

    const departmentNames = departmentLabels.slice(1);
    expect(departmentNames.length).toBeGreaterThan(0);
    expect(departmentNames).toEqual([...departmentNames].sort());

    await page.keyboard.press("Escape");

    await exportAssetPage.stateSelect.click();

    const stableStates = [
      "Ninguno",
      "Activo",
      "Baja o Devolucion",
      "Descargo",
      "Inactivo",
      "Malo",
      "Reintegro Bodega",
      "Reparacion",
      "Uso",
    ];

    for (const state of stableStates) {
      await expect(
        page.getByRole("option", { name: state, exact: true }),
      ).toBeVisible();
    }

    await page.keyboard.press("Escape");

    await exportAssetPage.groupSelect.click();

    await expect(
      page.getByRole("option", { name: "Ninguno", exact: true }),
    ).toBeVisible();

    const stableGroupDescriptions = ["Bodegas", "Subestaciones", "Terrenos"];

    for (const description of stableGroupDescriptions) {
      expect(groupsPayloadText).toContain(description);
      await expect(
        page.getByRole("option", { name: description, exact: true }),
      ).toBeVisible();
    }
  });
});
