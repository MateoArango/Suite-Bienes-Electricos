import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditAssetPage extends BasePage {
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;

    // Ubicación y Registro
    readonly departamentoField: Locator;
    readonly municipioField: Locator;
    readonly latitudField: Locator;
    readonly longitudField: Locator;
    readonly veredaField: Locator;

constructor(page: Page) {
    super(page);
    this.saveBtn = page.getByTestId('activesDetailSave');
    this.cancelBtn = page.getByTestId('activesDetailCancel');

    // mat-select fields - testid sits directly on the value trigger -> toContainText()
    this.departamentoField = page.getByTestId('departamento');
    this.municipioField = page.getByTestId('municipio');

    // real inputs -> toHaveValue()
    this.latitudField = page.getByTestId('latitud');
    this.longitudField = page.getByTestId('longitud');
    this.veredaField = page.getByTestId('vereda');
}

    async goto(plate: string) {
        await this.page.goto(`/dashboard/bienelectrico/detalle/${plate}`);
        await this.page.getByTestId('activesDetailEdit').click();
        await this.page.getByRole('button', { name: 'Ubicación Datos geográficos' }).waitFor({ state: 'visible' });
    }
}