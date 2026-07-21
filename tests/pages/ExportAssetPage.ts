import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ExportAssetPage extends BasePage {
  readonly openButton: Locator;
  readonly drawer: Locator;
  readonly heading: Locator;
  readonly form: Locator;
  readonly datesContainer: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly departmentSelect: Locator;
  readonly municipalitySelect: Locator;
  readonly locationContainer: Locator;
  readonly licensePlateInput: Locator;
  readonly stateSelect: Locator;
  readonly groupSelect: Locator;
  readonly actionsContainer: Locator;
  readonly cancelButton: Locator;
  readonly clearButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.openButton = page
      .getByRole("button")
      .filter({ hasText: "download" });
    this.drawer = page.getByRole("complementary");
    this.heading = this.drawer.getByRole("heading", {
      name: "Generar reporte",
    });
    this.form = page.getByTestId("generateReportForm");
    this.datesContainer = page.getByTestId("generateReportDatesContainer");
    this.startDateInput = page.getByTestId("generateReportStartDate");
    this.endDateInput = page.getByTestId("generateReportEndDate");
    this.departmentSelect = page.getByTestId(
      "generateReportDepartamentoSelect",
    );
    this.municipalitySelect = page.getByTestId(
      "generateReportMunicipioSelect",
    );
    this.locationContainer = page.getByTestId(
      "generateReportLocationContainer",
    );
    this.licensePlateInput = page.getByTestId(
      "generateReportLicensePlateInput",
    );
    this.stateSelect = page.getByTestId("generateReportStateSelect");
    this.groupSelect = page.getByTestId("generateReportGroupSelect");
    this.actionsContainer = page.getByTestId(
      "generateReportActionsContainer",
    );
    this.cancelButton = page.getByTestId("generateReportCancelButton");
    this.clearButton = page.getByTestId("generateReportClearButton");
    this.submitButton = page.getByTestId("generateReportSubmitButton");
  }

  readonly msgSuccess = "Reporte generado correctamente";

  async open() {
    await this.openButton.click();
  }
}
