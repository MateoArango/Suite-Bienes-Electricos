// spec: specs/exportAsset.plan.md
// seed: tests/exportAsset/seed.spec.ts

import { test, expect } from "@playwright/test";
import * as XLSX from "xlsx";
import { ExportAssetPage } from "../pages/ExportAssetPage";
import { testMetadata } from "../helpers/testMetadata";

const exportEndpoint =
  "/electrical-assets/report/electrical-assets/excel";

type ExportPayload = {
  fechaInicial: string;
  fechaFinal: string;
  departamentos: string[];
  municipios: string[];
  estado: string | null;
  grupo: string | null;
  placa: string;
};

test.describe("Generate Report export contract", () => {
  test("4.1 exports plate with its exact payload and XLSX data", testMetadata('QA-EXPORT-018', 'Exports a safely filtered plate, validates the exact seven-key payload, and checks identifying values in the downloaded XLSX.'), async ({
    page,
  }, testInfo) => {
    const exportAssetPage = new ExportAssetPage(page);

    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();

    const citiesResponsePromise = page.waitForResponse((response) => {
      const url = new URL(response.url());

      return (
        response.request().method() === "GET" &&
        url.pathname === "/electrical-assets/report/cities" &&
        url.searchParams.getAll("departmentIds").includes("05")
      );
    });

    await exportAssetPage.departmentSelect.click();
    await page
      .getByRole("option", { name: "ANTIOQUIA", exact: true })
      .click();
    expect((await citiesResponsePromise).status()).toBe(200);
    await page.keyboard.press("Escape");

    await exportAssetPage.municipalitySelect.click();
    await page
      .getByRole("option", { name: "ABRIAQUÍ", exact: true })
      .click();
    await page.keyboard.press("Escape");

    await exportAssetPage.licensePlateInput.fill("00000502");

    await expect(exportAssetPage.departmentSelect).toContainText(
      "ANTIOQUIA",
    );
    await expect(exportAssetPage.municipalitySelect).toContainText(
      "ABRIAQUÍ",
    );
    await expect(exportAssetPage.licensePlateInput).toHaveValue(
      "00000502",
    );

    const [response, download] = await Promise.all([
      page.waitForResponse((candidate) => {
        const url = new URL(candidate.url());

        return (
          candidate.request().method() === "POST" &&
          url.pathname === exportEndpoint
        );
      }),
      page.waitForEvent("download"),
      exportAssetPage.submitButton.click(),
    ]);

    const payload =
      response.request().postDataJSON() as ExportPayload;

    expect(Object.keys(payload).sort()).toEqual(
      [
        "departamentos",
        "estado",
        "fechaFinal",
        "fechaInicial",
        "grupo",
        "municipios",
        "placa",
      ].sort(),
    );
    expect(payload).toEqual({
      fechaInicial: "",
      fechaFinal: "",
      departamentos: ["05"],
      municipios: ["004"],
      estado: null,
      grupo: null,
      placa: "00000502",
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(download.suggestedFilename()).toMatch(
      /^reporte_\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.xlsx$/,
    );

    const downloadPath = testInfo.outputPath(
      download.suggestedFilename(),
    );
    await download.saveAs(downloadPath);

    const workbook = XLSX.readFile(downloadPath);
    const firstSheetName = workbook.SheetNames[0];
    expect(firstSheetName).toBeTruthy();

    const rows = XLSX.utils.sheet_to_json<string[]>(
      workbook.Sheets[firstSheetName],
      {
        header: 1,
        raw: false,
        defval: "",
      },
    );
    const headerRowIndex = rows.findIndex(
      (row) =>
        row.includes("Placa") &&
        row.includes("Placa Externa") &&
        row.includes("Nombre Artículo"),
    );
    expect(headerRowIndex).toBeGreaterThanOrEqual(0);

    const headers = rows[headerRowIndex];
    const plateIndex = headers.indexOf("Placa");
    const externalPlateIndex = headers.indexOf("Placa Externa");
    const articleNameIndex = headers.indexOf("Nombre Artículo");
    const assetRow = rows
      .slice(headerRowIndex + 1)
      .find((row) => row[plateIndex] === "00000502");

    expect(assetRow).toBeTruthy();
    expect(assetRow?.[plateIndex]).toBe("00000502");
    expect(assetRow?.[externalPlateIndex]).toBe("0RED1650-199");
    expect(assetRow?.[articleNameIndex]).toBe("Redes");
    await expect(
      page.getByText(exportAssetPage.msgSuccess),
    ).toBeVisible();
  });

  test("4.2 exports with the canonical empty payload", testMetadata('QA-EXPORT-019', 'Verifies the canonical unfiltered payload and a valid XLSX response; this live path remains intentionally slow and heap-sensitive.'), async ({
    page,
  }, testInfo) => {
    test.slow();
    const exportAssetPage = new ExportAssetPage(page);

    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();

    await expect(exportAssetPage.startDateInput).toHaveValue("");
    await expect(exportAssetPage.endDateInput).toHaveValue("");
    await expect(exportAssetPage.departmentSelect).toHaveText("");
    await expect(exportAssetPage.municipalitySelect).toHaveText("");
    await expect(exportAssetPage.licensePlateInput).toHaveValue("");
    await expect(exportAssetPage.stateSelect).toHaveText("");
    await expect(exportAssetPage.groupSelect).toHaveText("");

    const requestPromise = page.waitForRequest((request) => {
      const url = new URL(request.url());

      return (
        request.method() === "POST" &&
        url.pathname === exportEndpoint
      );
    });
    const responsePromise = page.waitForResponse(
      (response) => {
        const url = new URL(response.url());

        return (
          response.request().method() === "POST" &&
          url.pathname === exportEndpoint
        );
      },
      { timeout: 120_000 },
    );
    const downloadPromise = page.waitForEvent("download", {
      timeout: 120_000,
    });

    await exportAssetPage.submitButton.click();

    const request = await requestPromise;
    expect(request.postDataJSON() as ExportPayload).toEqual({
      fechaInicial: "",
      fechaFinal: "",
      departamentos: [],
      municipios: [],
      estado: null,
      grupo: null,
      placa: "",
    });

    const [response, download] = await Promise.all([
      responsePromise,
      downloadPromise,
    ]);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    const downloadPath = testInfo.outputPath(
      download.suggestedFilename(),
    );
    await download.saveAs(downloadPath);

    const downloadedWorkbook = XLSX.readFile(downloadPath);
    expect(downloadedWorkbook.SheetNames.length).toBeGreaterThan(0);
    const firstSheet =
      downloadedWorkbook.Sheets[downloadedWorkbook.SheetNames[0]];
    expect(firstSheet["!ref"]).toBeTruthy();
  });
});
