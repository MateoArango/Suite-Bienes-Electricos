import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) { }

  async login(username: string, password: string) {
    await this.page.goto('/');
    await this.page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await this.page.getByRole('textbox', { name: 'Usuario' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
    await this.page.getByTestId('loginSubmitButton').click();
    await this.page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await this.page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await this.page.getByTestId('loginSubmitButton').click();
  }
  
  async selectAvailableCalendarDate(index?: number) {
    const calendar = this.page.locator('.mat-calendar-body');
    await calendar.waitFor({ state: 'visible' });

    const enabledCells = this.page.locator(
      '.mat-calendar-body-cell:not(.mat-calendar-body-disabled)'
    );

    const count = await enabledCells.count();
    if (count === 0) {
      throw new Error('No enabled dates found in calendar view');
    }

    const targetIndex = index ?? Math.floor(count / 2);
    await enabledCells.nth(targetIndex).click();
  }

}