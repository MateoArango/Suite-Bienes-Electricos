import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { testMetadata } from '../helpers/testMetadata';


test.describe('Access control gate', () => {
    //this test is to validate that the edit button is enabled and visible
    test('Editar enabled asset', testMetadata('QA-EDIT-036', 'Shows an enabled Editar action for an asset that permits editing.'), async ({ page }) => {
    const basePage = new BasePage(page);
    const editBtn = page.getByTestId('activesDetailEdit');

    await basePage.login('qa', '123456');

    //UBICATION AND REGISTER
    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/dashboard/bienelectrico/detalle/00000198'); //196 - 198 - 077 -041
    await expect(editBtn).toBeVisible();
    await expect(editBtn).toBeEnabled();
});
//this test is to validate that the edit button is disabled
test ('Editar disabled asset', testMetadata('QA-EDIT-037', 'Shows but disables the Editar action for an asset whose status prevents editing.'), async ({ page }) => {
    const basePage = new BasePage(page);
    const editBtn = page.getByTestId('activesDetailEdit');

    await basePage.login('qa', '123456');

    //UBICATION AND REGISTER
    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/dashboard/bienelectrico/detalle/00000076'); //076 - 016
    await expect(editBtn).toBeVisible();
    await expect(editBtn).toBeDisabled();
});

//Baja asset opens read-only details, not an editable form
test('read-only asset fields', testMetadata('QA-EDIT-038', 'Renders a Baja asset in read-only detail mode with editing blocked.'), async ({ page }) => {
    const basePage = new BasePage(page);
    const editBtn = page.getByTestId('activesDetailEdit');
    const editUrl = '/dashboard/bienelectrico/detalle/00000076'; //076 - 016

    await basePage.login('qa', '123456');

    await expect(page).toHaveURL(/dashboard/);
    await page.goto(editUrl);

    await page.getByRole('tab', { name: 'Proyecto y gestión' }).click();

    // Verify the app rendered the read-only details view
    await expect(page.getByText('Proyecto e infraestructura')).toBeVisible();
    await expect(page.getByText('Responsable y contratos')).toBeVisible();

    // Verify editing is blocked
    await expect(editBtn).toBeDisabled();
    });
});
