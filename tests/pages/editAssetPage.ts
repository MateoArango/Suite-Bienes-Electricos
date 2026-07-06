import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
export class EditAssetPage extends BasePage {
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.saveBtn = page.getByTestId('activesDetailSave');
        this.cancelBtn = page.getByTestId('activesDetailCancel');
    }


}
