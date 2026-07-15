import { Page, Locator } from '@playwright/test';

export class CreateAssetPage {
    readonly nextBtn: Locator;
    readonly stepper: Locator;
    readonly plateOption: Locator;
    readonly endBtn: Locator;
    readonly backBtn: Locator;


    constructor(private page: Page) {
        this.nextBtn = page.getByRole('button', { name: 'Siguiente' });
        this.stepper = page.getByTestId('activesCreateStepper');
        this.plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
        this.endBtn = page.getByRole('button', { name: 'Finalizar' });
        this.backBtn = page.getByRole('button', { name: 'Atrás' });

    }

    async openAndSelectPlate() {
        await this.page.getByRole('button', { name: 'Crear activo' }).click();
        await this.page.getByText('Cargando más placas...').waitFor({ state: 'visible' });
        await this.plateOption.waitFor({ state: 'visible', timeout: 120000 });
        await this.plateOption.click();
    }

    async fillRequiredLocationFields() {
        await this.page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
        await this.page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
        await this.page.getByRole('option', { name: '-ATLÁNTICO' }).click();
        await this.page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
        await this.page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
        await this.page.getByRole('option', { name: '-GALAPA' }).click();
        await this.page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
        await this.page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');
        await this.page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
        await this.page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');
    }


}