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
    await this.plateOption.waitFor({ state: 'visible', timeout: 30000 });
    await this.plateOption.click();
  }
}