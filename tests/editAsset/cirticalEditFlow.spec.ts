import { test, expect } from '../createAsset/fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

test('Open existing asset - Critical Edit Flow', async ({ page }) => {
    const basePage = new BasePage(page);
    const saveBtn = page.getByTestId('activesDetailSave');
    const deleteBtn = page.getByTestId('activesDetailDelete');
    const descriptionBtn = page.getByTestId('activesDetailDescription');
    const editAsset = new EditAssetPage(page);
    const cancelBtn = page.getByTestId('activesDetailCancel');

    await basePage.login('qa', '123456');

    //UBICATION AND REGISTER
    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/dashboard/bienelectrico/detalle/00000198'); //196 - 198 - 077 -041
});