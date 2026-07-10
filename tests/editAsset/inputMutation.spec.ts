import { Locator, Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

const PLATE = '00000542';
const UPDATE_PATH = `/electrical-assets/article-resume/${PLATE}`;
const SUCCESS_TOAST = 'Cambios guardados correctamente';
const SELECT_ALL_SHORTCUT = process.platform === 'darwin' ? 'Meta+A' : 'Control+A';
const COPY_SHORTCUT = process.platform === 'darwin' ? 'Meta+C' : 'Control+C';
const PASTE_SHORTCUT = process.platform === 'darwin' ? 'Meta+V' : 'Control+V';
const CUT_SHORTCUT = process.platform === 'darwin' ? 'Meta+X' : 'Control+X';
const UNDO_SHORTCUT = process.platform === 'darwin' ? 'Meta+Z' : 'Control+Z';
const REDO_SHORTCUT = process.platform === 'darwin' ? 'Meta+Shift+Z' : 'Control+Y';

async function pasteOverValue(page: Page, field: Locator, value: string) {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(text => navigator.clipboard.writeText(text), value);
    await field.click();
    await field.press(SELECT_ALL_SHORTCUT);
    await field.press(PASTE_SHORTCUT);
}

async function saveAndExpectSuccess(page: Page, editAsset: EditAssetPage) {
    const updateResponsePromise = page.waitForResponse(response =>
        response.request().method() === 'PATCH' &&
        response.url().includes(UPDATE_PATH)
    );

    await editAsset.saveBtn.click();

    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok(), `Update failed: ${updateResponse.status()} ${await updateResponse.text()}`).toBe(true);
    await expect(page.getByText(SUCCESS_TOAST)).toBeVisible();
}

async function openResponsablePanel(page: Page) {
    await page.getByRole('tab', { name: /Proyecto y gesti.n/ }).click();
    await page.getByRole('button', { name: /Responsable y contratos/ }).click();
}

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

    test('QA-EDIT-017: cut Vereda and paste exact value into Localidad', async ({ page }) => {
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
        await editAsset.veredaField.press(CUT_SHORTCUT);

        await editAsset.localidadField.click();
        await editAsset.localidadField.press(SELECT_ALL_SHORTCUT);
        await editAsset.localidadField.press(PASTE_SHORTCUT);

        await expect(editAsset.localidadField).toHaveValue(sourceValue);
        await expect(editAsset.veredaField).toHaveValue('');
    });

    test('QA-EDIT-019: vereda stops accepting typed characters at max length', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);
        const overLimitValue = 'VEREDA-1234567890-ABCDEFGHIJ-XYZ-OVER-LIMIT-50-EXTRA';
        const expectedValue = overLimitValue.slice(0, 50);

        await editAsset.veredaField.click();
        await editAsset.veredaField.selectText();
        await editAsset.veredaField.pressSequentially(overLimitValue);

        await expect(editAsset.veredaField).toHaveValue(expectedValue);
    });

    test('QA-EDIT-020: paste over max length trims pasted data', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const overLimitText = 'VEREDA-1234567890-ABCDEFGHIJ-XYZ-OVER-LIMIT-50-EXTRA';
        const overLimitLatitud = '123456789012345678901234567890999';

        await pasteOverValue(page, editAsset.veredaField, overLimitText);
        await expect(editAsset.veredaField).toHaveValue(overLimitText.slice(0, 50));

        await pasteOverValue(page, editAsset.localidadField, overLimitText);
        await expect(editAsset.localidadField).toHaveValue(overLimitText.slice(0, 50));

        await pasteOverValue(page, editAsset.latitudField, overLimitLatitud);
        await expect(editAsset.latitudField).toHaveValue(overLimitLatitud.slice(0, 30));
    });

    test('QA-EDIT-021: numeric fields reject non-numeric characters', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        await page.getByRole('tab', { name: /Proyecto y gesti.n/ }).click();
        await page.getByRole('button', { name: /Responsable y contratos/ }).click();

        const mixedInput = 'ABC123XYZ456';
        const digitsOnlyCc = '123456';
        const digitsOnlyAvaluo = '123.456';

        await editAsset.nitCcUsuarioField.click();
        await editAsset.nitCcUsuarioField.press(SELECT_ALL_SHORTCUT);
        await editAsset.nitCcUsuarioField.pressSequentially(mixedInput);
        await expect(editAsset.nitCcUsuarioField).toHaveValue(digitsOnlyCc);

        await page.getByRole('tab', { name: /Equipo y aval.o/ }).click();
        await editAsset.avaluoRvField.click();
        await editAsset.avaluoRvField.press(SELECT_ALL_SHORTCUT);
        await editAsset.avaluoRvField.pressSequentially(mixedInput);
        await expect(editAsset.avaluoRvField).toHaveValue(digitsOnlyAvaluo);
    });

    test('QA-EDIT-023: unicode input persists after save and reload', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        let savedUnicodeValue = false;
        let originalEmailOperadorAom = '';

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        try {
            await openResponsablePanel(page);

            originalEmailOperadorAom = await editAsset.emailOperadorAomField.inputValue();
            const unicodeValue = 'qa.\u00f1and\u00fa.caf\u00e9@example.com';

            await editAsset.emailOperadorAomField.fill(unicodeValue);
            await expect(editAsset.emailOperadorAomField).toHaveValue(unicodeValue);

            await saveAndExpectSuccess(page, editAsset);
            savedUnicodeValue = true;

            await page.reload();
            await editAsset.goto(PLATE);
            await openResponsablePanel(page);
            await expect(editAsset.emailOperadorAomField).toHaveValue(unicodeValue);
        } finally {
            if (savedUnicodeValue) {
                await editAsset.goto(PLATE);
                await openResponsablePanel(page);
                await editAsset.emailOperadorAomField.fill(originalEmailOperadorAom);
                await saveAndExpectSuccess(page, editAsset);
            }
        }
    });

    test('QA-EDIT-024: undo and redo revert and reapply an edit', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        const originalValue = await editAsset.localidadField.inputValue();
        const editedValue = originalValue === 'QA undo redo'
            ? 'QA undo redo 2'
            : 'QA undo redo';

        await editAsset.localidadField.fill(editedValue);
        await expect(editAsset.localidadField).toHaveValue(editedValue);

        await editAsset.localidadField.press(UNDO_SHORTCUT);
        await expect(editAsset.localidadField).toHaveValue(originalValue);

        await editAsset.localidadField.press(REDO_SHORTCUT);
        await expect(editAsset.localidadField).toHaveValue(editedValue);
    });

    test('QA-EDIT-025: Valor UC currency mask formats live while typing', async ({ page }) => {
        const basePage = new BasePage(page);
        const editAsset = new EditAssetPage(page);

        await basePage.login('qa', '123456');
        await expect(page).toHaveURL(/dashboard/);
        await editAsset.goto(PLATE);

        await page.getByRole('tab', { name: /Equipo y aval.o/ }).click();

        await editAsset.valorUcField.click();
        await editAsset.valorUcField.press(SELECT_ALL_SHORTCUT);
        await editAsset.valorUcField.pressSequentially('123232132131');

        await expect(editAsset.valorUcField).toHaveValue('$ 123.232.132.131');
    });

});
