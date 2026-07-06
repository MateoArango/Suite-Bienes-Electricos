import { Page, Locator } from '@playwright/test';

export class EditingAssetPage {
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;


    constructor(private page: Page) {
        this.saveBtn = page.getByTestId('activesDetailSave');
        this.cancelBtn = page.getByTestId('activesDetailCancel');

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