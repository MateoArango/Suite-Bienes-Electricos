import { test, expect } from '../createAsset/fixtures';
import { BasePage } from '../pages/BasePage';

test.describe('Input mutation', () => {
    test('overwrite text', async ({ page }) => {
        const basePage = new BasePage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await page.goto('/dashboard/bienelectrico/detalle/00000198');

        await page.getByTestId('activesDetailEdit').click();

        const fields = [
            page.getByTestId('longitud'),
            page.getByTestId('vereda'),
        ];

        for (const field of fields) {
            await field.click();
            await field.selectText();
            await field.pressSequentially('updated');
            await expect(field).toHaveValue('updated');
        }
    });
});