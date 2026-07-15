import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ImportAssetPage {
    readonly importButton: Locator;
    readonly tabsContainer: Locator;
    readonly importTab: Locator;
    readonly historyTab: Locator;
    readonly instructionsContainer: Locator;
    readonly downloadTemplateButton: Locator;
    readonly uploaderContainer: Locator;
    readonly actionsContainer: Locator;
    readonly cancelButton: Locator;
    readonly submitButton: Locator;
    readonly errorsButton: Locator;
    readonly exportErrors: Locator;
    readonly retryButton: Locator;
    readonly successMessage: Locator;
    readonly selectFileButton: Locator;

    constructor(readonly page: Page) {
        this.tabsContainer = page.getByTestId('importActiveTabsContainer');
        this.importTab = page.getByTestId('importActiveImportTab');
        this.historyTab = page.getByTestId('importActiveHistoryTab');
        this.instructionsContainer = page.getByTestId('importActiveInstructionsContainer');
        this.downloadTemplateButton = page.getByTestId('importActiveDownloadTemplateButton');
        this.uploaderContainer = page.getByTestId('importActiveUploaderContainer');
        this.actionsContainer = page.getByTestId('importActiveActionsContainer');
        this.cancelButton = page.getByTestId('importActiveCancelButton');
        this.submitButton = page.getByTestId('importActiveSubmitButton');
        this.errorsButton = page.getByRole('button', { name: 'Ver errores' });
        this.exportErrors = page.getByRole('button', { name: 'Exportar errores' });
        this.retryButton = page.getByRole('button', { name: 'Reintentar' });
        this.importButton = page.getByRole('button').filter({ hasText: 'upload' })
        this.successMessage = page.getByText('Archivo importado');
        this.selectFileButton = page.getByRole('button', { name: 'Seleccionar archivo' });
    }

    async openImport(username = 'qa', password = '123456') {
        const basePage = new BasePage(this.page);

        await basePage.login(username, password);
        await this.importButton.click();
    }
}
