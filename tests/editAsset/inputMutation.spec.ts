import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '0000247634';
const SELECT_ALL_SHORTCUT = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
const COPY_SHORTCUT = process.platform === 'darwin' ? 'Meta+C' : 'Control+C';
const PASTE_SHORTCUT = process.platform === 'darwin' ? 'Meta+V' : 'Control+V';

test.describe('Input mutation', () => {
    test('QA-EDIT-011: overwrite text with select all and type', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const newValue = 'QA overwrite localidad';
        await editAsset.localidadField.click();
        await editAsset.localidadField.selectText();
        await editAsset.localidadField.pressSequentially(newValue);

        await expect(editAsset.localidadField).toHaveValue(newValue);
    });

    test('QA-EDIT-012: append text at the end of an existing value', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const originalValue = await editAsset.localidadField.inputValue();
        const appendedText = ' appended';

        await editAsset.localidadField.click();
        await editAsset.localidadField.press('End');
        await editAsset.localidadField.pressSequentially(appendedText);

        await expect(editAsset.localidadField).toHaveValue(`${originalValue}${appendedText}`);
    });

    test('QA-EDIT-013: insert text in the middle of an existing value', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const originalValue = await editAsset.localidadField.inputValue();
        const insertText = 'MID';
        const insertIndex = Math.floor(originalValue.length / 2);
        const expectedValue = `${originalValue.slice(0, insertIndex)}${insertText}${originalValue.slice(insertIndex)}`;

        await editAsset.localidadField.click();
        await editAsset.localidadField.press('Home');
        for (let index = 0; index < insertIndex; index++) {
            await editAsset.localidadField.press('ArrowRight');
        }
        await editAsset.localidadField.pressSequentially(insertText);

        await expect(editAsset.localidadField).toHaveValue(expectedValue);
    });

    test('QA-EDIT-014: delete first character with forward delete', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const originalValue = await editAsset.localidadField.inputValue();
        const expectedValue = originalValue.slice(1);

        await editAsset.localidadField.click();
        await editAsset.localidadField.press('Home');
        await editAsset.localidadField.press('Delete');

        await expect(editAsset.localidadField).toHaveValue(expectedValue);
    });

    test('QA-EDIT-015: delete last character with backspace at the end', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const originalValue = await editAsset.localidadField.inputValue();
        const expectedValue = originalValue.slice(0, -1);

        await editAsset.localidadField.click();
        await editAsset.localidadField.press('End');
        await editAsset.localidadField.press('Backspace');

        await expect(editAsset.localidadField).toHaveValue(expectedValue);
    });

    test('QA-EDIT-016: replace full value with Ctrl+A and type', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const newValue = 'QA ctrl a replacement';

        await editAsset.localidadField.click();
        await editAsset.localidadField.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
        await editAsset.localidadField.pressSequentially(newValue);

        await expect(editAsset.localidadField).toHaveValue(newValue);
    });

    test('QA-EDIT-017: copy Vereda and paste exact value into Localidad', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        let sourceValue = await editAsset.veredaField.inputValue();
        if (!sourceValue) {
            sourceValue = 'QA copy paste source';
            await editAsset.veredaField.fill(sourceValue);
        }

        await editAsset.veredaField.click();
        await editAsset.veredaField.press(SELECT_ALL_SHORTCUT);
        await editAsset.veredaField.press(COPY_SHORTCUT);

        await editAsset.localidadField.click();
        await editAsset.localidadField.press(SELECT_ALL_SHORTCUT);
        await editAsset.localidadField.press(PASTE_SHORTCUT);

        await expect(editAsset.localidadField).toHaveValue(sourceValue);
    });
});
