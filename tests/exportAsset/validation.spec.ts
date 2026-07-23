// spec: specs/exportAsset.plan.md
// seed: tests/exportAsset/seed.spec.ts

import { test, expect, Locator, Page } from "@playwright/test";
import { ExportAssetPage } from "../pages/ExportAssetPage";

const exportEndpoint =
  "/electrical-assets/report/electrical-assets/excel";

function normalizeDate(value: string) {
  if (value === "") {
    return "";
  }

  const [day, month, year] = value.split("/");
  return [
    day.padStart(2, "0"),
    month.padStart(2, "0"),
    year,
  ].join("/");
}

async function selectFirstCalendarDateIn2025(
  page: Page,
  dateInput: Locator,
) {
  await page
    .locator("mat-form-field", { has: dateInput })
    .getByLabel("Open calendar")
    .click();
  await page.locator("mat-calendar .mat-calendar-period-button").click();
  await page.getByRole("button", { name: "2025", exact: true }).click();

  const enabledCalendarCells = page.locator(
    "mat-calendar button.mat-calendar-body-cell:not([disabled])",
  );
  await enabledCalendarCells.first().click();
  await enabledCalendarCells.first().click();
  await expect(dateInput).not.toHaveValue("");
}

async function waitForExportRequest(page: Page) {
  return page.waitForRequest(
    (request) =>
      request.method() === "POST" &&
      new URL(request.url()).pathname === exportEndpoint,
  );
}

test.describe("Generate Report date validation", () => {
  test("3.1 Calendar-selected valid dates", async ({ page }) => {
    const exportAssetPage = new ExportAssetPage(page);
    const enabledCalendarCells = page.locator(
      "mat-calendar button.mat-calendar-body-cell:not([disabled])",
    );
    const normalizeDate = (value: string) => {
      const [day, month, year] = value.split("/");

      return [
        day.padStart(2, "0"),
        month.padStart(2, "0"),
        year,
      ].join("/");
    };
    const dateValue = (value: string) => {
      const [day, month, year] = value.split("/").map(Number);

      return Date.UTC(year, month - 1, day);
    };

    // 1. Open the Generate Report drawer using ExportAssetPage.
    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();
    await expect(exportAssetPage.form).toBeVisible();

    // 2. Open the start-date calendar and select a valid earlier date.
    await page
      .locator("mat-form-field", { has: exportAssetPage.startDateInput })
      .getByLabel("Open calendar")
      .click();
    await page.locator("mat-calendar .mat-calendar-period-button").click();
    await page
      .getByRole("button", { name: "2025", exact: true })
      .click();
    await enabledCalendarCells.first().click();
    await enabledCalendarCells.first().click();

    // 3. Open the end-date calendar, verify today's DOM marker, and select today semantically.
    await page
      .locator("mat-form-field", { has: exportAssetPage.endDateInput })
      .getByLabel("Open calendar")
      .click();

    const todayButton = page.locator(
      "mat-calendar button[aria-current='date']",
    );
    await expect(todayButton).toHaveCount(1);
    await expect(todayButton).toHaveAttribute("aria-label", /.+/);
    await expect(
      todayButton.locator(".mat-calendar-body-today"),
    ).toHaveCount(1);
    await todayButton.click();

    // 4. Verify both actual date inputs are non-empty and semantically valid.
    await expect(exportAssetPage.startDateInput).not.toHaveValue("");
    await expect(exportAssetPage.endDateInput).not.toHaveValue("");
    await expect(exportAssetPage.startDateInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    await expect(exportAssetPage.endDateInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );

    const startDate = await exportAssetPage.startDateInput.inputValue();
    const endDate = await exportAssetPage.endDateInput.inputValue();
    expect(dateValue(startDate)).toBeLessThan(dateValue(endDate));

    // 5. Submit while synchronizing with the export POST and XLSX download.
    const [request, download] = await Promise.all([
      page.waitForRequest(
        (candidate) =>
          candidate.method() === "POST" &&
          candidate
            .url()
            .endsWith("/electrical-assets/report/electrical-assets/excel"),
      ),
      page.waitForEvent("download", { timeout: 45_000 }),
      exportAssetPage.submitButton.click(),
    ]);

    // 6. Verify fechaInicial and fechaFinal contain the normalized selected dates.
    const payload = request.postDataJSON() as {
      fechaInicial: string;
      fechaFinal: string;
    };

    expect(payload.fechaInicial).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(payload.fechaFinal).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(payload.fechaInicial).toBe(normalizeDate(startDate));
    expect(payload.fechaFinal).toBe(normalizeDate(endDate));
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
  });

  test("3.2 Future dates are unavailable", async ({ page }) => {
    const exportAssetPage = new ExportAssetPage(page);
    const exportRequests: string[] = [];

    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        new URL(request.url()).pathname ===
          "/electrical-assets/report/electrical-assets/excel"
      ) {
        exportRequests.push(request.postData() ?? "");
      }
    });

    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();
    await expect(exportAssetPage.form).toBeVisible();

    for (const dateInput of [
      exportAssetPage.startDateInput,
      exportAssetPage.endDateInput,
    ]) {
      await page
        .locator("mat-form-field", { has: dateInput })
        .getByLabel("Open calendar")
        .click();

      const calendar = page.locator("mat-calendar");
      const calendarCells = calendar.locator(
        "button.mat-calendar-body-cell",
      );
      const todayButton = calendar.locator(
        "button[aria-current='date']",
      );

      await expect(calendar).toBeVisible();
      await expect(todayButton).toBeEnabled();

      const todayIndex = await calendarCells.evaluateAll((cells) =>
        cells.findIndex(
          (cell) => cell.getAttribute("aria-current") === "date",
        ),
      );
      expect(todayIndex).toBeGreaterThanOrEqual(0);

      const calendarCellCount = await calendarCells.count();
      const futureCellCount = calendarCellCount - todayIndex - 1;
      expect(futureCellCount).toBeGreaterThan(0);

      for (let index = 0; index < futureCellCount; index += 1) {
        await expect(
          calendarCells.nth(todayIndex + index + 1),
        ).toBeDisabled();
      }

      const tomorrowButton = calendarCells.nth(todayIndex + 1);
      const valueBeforeAttempt = await dateInput.inputValue();
      let futureSelectionWasBlocked = false;

      try {
        await tomorrowButton.click({ timeout: 1_000 });
      } catch {
        futureSelectionWasBlocked = true;
      }

      expect(futureSelectionWasBlocked).toBe(true);
      await expect(dateInput).toHaveValue(valueBeforeAttempt);

      const nextMonthButton = calendar.getByLabel("Next month");
      await expect(nextMonthButton).toBeDisabled();

      await page.keyboard.press("Escape");
      await expect(calendar).toBeHidden();
    }

    await expect(exportAssetPage.startDateInput).toHaveValue("");
    await expect(exportAssetPage.endDateInput).toHaveValue("");
    expect(exportRequests).toHaveLength(0);
  });

  test("3.3 Start dates after the end boundary are unavailable", async ({
    page,
  }) => {
    const exportAssetPage = new ExportAssetPage(page);
    const exportRequests: string[] = [];

    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        new URL(request.url()).pathname === exportEndpoint
      ) {
        exportRequests.push(request.postData() ?? "");
      }
    });

    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();
    await selectFirstCalendarDateIn2025(
      page,
      exportAssetPage.endDateInput,
    );

    const selectedEndDate =
      await exportAssetPage.endDateInput.inputValue();
    await page
      .locator("mat-form-field", {
        has: exportAssetPage.startDateInput,
      })
      .getByLabel("Open calendar")
      .click();

    const calendar = page.locator("mat-calendar");
    const calendarCells = calendar.locator(
      "button.mat-calendar-body-cell",
    );
    const cellStates = await calendarCells.evaluateAll((cells) =>
      cells.map((cell) => ({
        disabled:
          cell.matches(":disabled") ||
          cell.getAttribute("aria-disabled") === "true" ||
          cell.classList.contains("mat-calendar-body-disabled"),
        label: cell.getAttribute("aria-label"),
      })),
    );
    const lastEnabledIndex = cellStates.findLastIndex(
      (cell) => !cell.disabled,
    );
    const firstUnavailableIndex = cellStates.findIndex(
      (cell, index) => index > lastEnabledIndex && cell.disabled,
    );

    expect(lastEnabledIndex).toBeGreaterThanOrEqual(0);
    expect(firstUnavailableIndex).toBeGreaterThan(lastEnabledIndex);

    const firstDateAfterEnd = calendarCells.nth(
      firstUnavailableIndex,
    );
    await expect(firstDateAfterEnd).toBeDisabled();
    await expect(firstDateAfterEnd).toHaveAttribute("aria-label", /.+/);

    let outOfRangeSelectionWasBlocked = false;
    try {
      await firstDateAfterEnd.click({ timeout: 1_000 });
    } catch {
      outOfRangeSelectionWasBlocked = true;
    }

    expect(outOfRangeSelectionWasBlocked).toBe(true);
    await expect(exportAssetPage.startDateInput).toHaveValue("");
    await expect(exportAssetPage.endDateInput).toHaveValue(
      selectedEndDate,
    );
    await expect(calendar.getByLabel("Next month")).toBeDisabled();
    expect(exportRequests).toHaveLength(0);
  });

  test("3.3 Equal start and end dates are accepted", async ({ page }) => {
    const exportAssetPage = new ExportAssetPage(page);

    await exportAssetPage.login("qa", "123456");
    await exportAssetPage.open();
    await selectFirstCalendarDateIn2025(
      page,
      exportAssetPage.startDateInput,
    );
    await selectFirstCalendarDateIn2025(
      page,
      exportAssetPage.endDateInput,
    );

    const startDate =
      await exportAssetPage.startDateInput.inputValue();
    const endDate = await exportAssetPage.endDateInput.inputValue();

    expect(startDate).toBe(endDate);
    await expect(exportAssetPage.startDateInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    await expect(exportAssetPage.endDateInput).toHaveAttribute(
      "aria-invalid",
      "false",
    );

    const requestPromise = waitForExportRequest(page);
    await exportAssetPage.submitButton.click();
    const payload = (await requestPromise).postDataJSON() as {
      fechaInicial: string;
      fechaFinal: string;
    };

    expect(payload.fechaInicial).toBe(normalizeDate(startDate));
    expect(payload.fechaFinal).toBe(normalizeDate(endDate));
  });

  const optionalDateCases = [
    {
      name: "blank start",
      selectStart: false,
      selectEnd: true,
    },
    {
      name: "blank end",
      selectStart: true,
      selectEnd: false,
    },
    {
      name: "both blank",
      selectStart: false,
      selectEnd: false,
    },
  ];

  for (const dateCase of optionalDateCases) {
    test(`3.3 Optional dates serialize ${dateCase.name}`, async ({
      page,
    }) => {
      const exportAssetPage = new ExportAssetPage(page);

      await exportAssetPage.login("qa", "123456");
      await exportAssetPage.open();

      if (dateCase.selectStart) {
        await selectFirstCalendarDateIn2025(
          page,
          exportAssetPage.startDateInput,
        );
      }
      if (dateCase.selectEnd) {
        await selectFirstCalendarDateIn2025(
          page,
          exportAssetPage.endDateInput,
        );
      }

      const expectedStart =
        await exportAssetPage.startDateInput.inputValue();
      const expectedEnd =
        await exportAssetPage.endDateInput.inputValue();
      const requestPromise = waitForExportRequest(page);

      await exportAssetPage.submitButton.click();
      const payload = (await requestPromise).postDataJSON() as {
        fechaInicial: string;
        fechaFinal: string;
      };

      expect(payload.fechaInicial).toBe(
        normalizeDate(expectedStart),
      );
      expect(payload.fechaFinal).toBe(normalizeDate(expectedEnd));
      expect(payload.fechaInicial === "").toBe(
        !dateCase.selectStart,
      );
      expect(payload.fechaFinal === "").toBe(!dateCase.selectEnd);
    });
  }
});
