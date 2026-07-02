import { test, expect } from './fixtures';

test.describe('Crear Activo - P1 Stepper Navigation', () => {

  test('15. Stepper displays correct step after plate selection', async ({ page }) => {
    const stepper = page.getByTestId('activesCreateStepper');
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });

    await page.goto('/');
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('qa');
    await page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
    await page.getByTestId('loginSubmitButton').click();
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
    await page.getByTestId('loginSubmitButton').click();

    await page.getByRole('button', { name: 'Crear activo' }).click();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);

    const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
    await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();
    await expect(stepper).toContainText('Sub paso 1 de 1');
  });

test('16. Field counter tracks all filled fields independently from required validation', async ({ page }) => {
    const stepper = page.getByTestId('activesCreateStepper');
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });

    await page.goto('/');
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('qa');
    await page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
    await page.getByTestId('loginSubmitButton').click();
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
    await page.getByTestId('loginSubmitButton').click();

    await page.getByRole('button', { name: 'Crear activo' }).click();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);

    const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
    await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    // Start: no fields filled, Siguiente should be blocked
    await expect(nextBtn).toBeDisabled();

    // Fill 1st required field: Departamento
    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await expect(stepper).toContainText('Campos1 de 13');
    await expect(nextBtn).toBeDisabled();

    // Fill 2nd required field: Municipio
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();
    await expect(stepper).toContainText('Campos3 de 13');  // Dane Code is automatically filled
    await expect(nextBtn).toBeDisabled();

    // Fill 3rd required field: Fotos
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');
    await expect(stepper).toContainText('Campos4 de 13');
    await expect(nextBtn).toBeDisabled();

    // Fill 4th (last) required field: Enlace ARCGIS -> Siguiente should unblock here,
    // even though counter is only 4 of 13 (not all 13 fields filled)
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');
    await expect(stepper).toContainText('Campos5 de 13');
    await expect(nextBtn).toBeEnabled();

    // Fill an optional field: counter keeps increasing even though Siguiente
    // was already enabled before this field was touched
    await page.getByTestId('activesCreateUbicacionContainer').getByText('Localidad').click();
    await page.getByRole('textbox', { name: 'Localidad' }).fill('localidad test');
    await expect(stepper).toContainText('Campos6 de 13');
    await expect(nextBtn).toBeEnabled();
  });

test('17. User can navigate back without losing Location values', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const backBtn = page.getByRole('button', { name: 'Atrás' });
 
    await page.goto('/');
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('qa');
    await page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
    await page.getByTestId('loginSubmitButton').click();
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
    await page.getByTestId('loginSubmitButton').click();
 
    await page.getByRole('button', { name: 'Crear activo' }).click();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);
 
    const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
    await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });
 
    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');
 
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });
 
    // Go back to Location step
    await backBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });
 
    // Assert values persisted
    await expect(page.getByRole('combobox', { name: 'Departamento' })).toContainText('ATLÁNTICO');
    await expect(page.getByRole('combobox', { name: 'Municipio' })).toContainText('GALAPA');
    await expect(page.getByRole('textbox', { name: 'Fotos' })).toHaveValue('https://www.google.com/fotos-test');
    await expect(page.getByRole('textbox', { name: 'Enlace ARCGIS' })).toHaveValue('https://www.google.com/arcgis-test');
  });

test('18. Siguiente blocks and unblocks correctly on back navigation', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const backBtn = page.getByRole('button', { name: 'Atrás' });
 
    await page.goto('/');
    await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('qa');
    await page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
    await page.getByTestId('loginSubmitButton').click();
    await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
    await page.getByTestId('loginSubmitButton').click();
 
    await page.getByRole('button', { name: 'Crear activo' }).click();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);
 
    const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
    await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });
 
    // Fill all 4 required fields
    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();
    const fotosField = page.getByRole('textbox', { name: 'Fotos' });
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await fotosField.fill('https://www.google.com/fotos-test');
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');
 
    // Confirmed unblocked before advancing
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });
 
    // Go back to Location step
    await backBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });
 
    // Clear a required field (Fotos) that the user "forgot" was required
    await fotosField.fill('');
 
    // Siguiente must block again
    await expect(nextBtn).toBeDisabled();
 
    // Refill the required field
    await fotosField.fill('https://www.google.com/fotos-test');
 
    // Siguiente must unblock again
    await expect(nextBtn).toBeEnabled();
  });

});