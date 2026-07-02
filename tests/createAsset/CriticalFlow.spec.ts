import { test, expect } from './fixtures';

/**
 * P0 - Critical Flow
 * Scenarios 1-7 from the QA analysis (activeCreaterobustesness.pdf).
 *
 * Fully hardcoded/inline phase - no helper functions, no POM yet.
 * Each test repeats login + selectors directly, matching test-3.spec.ts style.
 *
 * ASSUMPTION (scenario 1): only the Location step fields are required to
 * create an active (Departamento, Municipio, Fotos, Enlace ARCGIS). Steps
 * 2-7 (Proyecto, Responsable, Valoración, Machine features, Support,
 * Driver, CREG) are treated as optional - just advancing with Siguiente
 * without filling them. If any of those steps blocks navigation without
 * specific fields, flag which ones and I'll adjust.
 */

test.describe('Crear Activo - P0 Critical Flow', () => {

  test('1. Create active successfully with only required fields', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: 'Crear activo' })).toBeVisible();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);

    const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
    await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();
    await expect(stepper).toContainText('Sub paso 1 de 1');

    // Only required Location fields
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

    // Localidad, Vereda, Tipo de zona, Latitud, Longitud, Carpeta altitud,
    // Nombre planilla, Descripción left empty - not required

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    // Proyecto e infraestructura - not necessary to create the active, just advance
    await expect(stepper).toContainText('Proyecto e infraestructura');
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    // Responsable y contratos - not necessary, just advance
    await expect(stepper).toContainText('Responsable y contratos');
    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    // Valoración financiera - not necessary, just advance
    await expect(stepper).toContainText('Valoración financiera');
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    // Machine features - not necessary, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    // Support and Structure - not necessary, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });

    // Driver and network - not necessary, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableAtributosApoyo').waitFor({ state: 'visible' });

    // CREG code and others - not necessary, just finalize
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await expect(page.getByText('El activo se registró')).toBeVisible();
    
  });

  test('2. Cannot create asset without selecting Plate', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: 'Crear activo' })).toBeVisible();
    await expect(page.getByText('Selección placa')).toBeVisible();
    await expect(page.getByText('Cargando más placas...')).toBeVisible();
    await page.waitForTimeout(20000);

    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();
    await expect(stepper).toContainText('Sub paso 1 de 1');

    // Only required Location fields
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

    // Localidad, Vereda, Tipo de zona, Latitud, Longitud, Carpeta altitud,
    // Nombre planilla, Descripción left empty - not required

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    // Proyecto e infraestructura - not necessary to create the active, just advance
    await expect(stepper).toContainText('Proyecto e infraestructura');
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    // Responsable y contratos - not necessary, just advance
    await expect(stepper).toContainText('Responsable y contratos');
    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    // Valoración financiera - not necessary, just advance
    await expect(stepper).toContainText('Valoración financiera');
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    // Machine features - not necessary, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    // Support and Structure - not necessary, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });

    // Driver and network - not necessary, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableAtributosApoyo').waitFor({ state: 'visible' });

    // CREG code and others - not necessary, just finalize
    await page.getByRole('button', { name: 'Finalizar' }).click();
    await expect(page.getByText('Seleccione una placa para crear el activo.')).toBeVisible();
  });

  test('3. Cannot continue Location step without Departamento', async ({ page }) => {
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

    // Municipio is dependent on Departamento - skipped since Departamento is intentionally left empty
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');

    // Departamento left empty
    await expect(nextBtn).toBeDisabled();
    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();

    
  });

  test('4. Cannot continue Location step without Municipio', async ({ page }) => {
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

    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');

    // Municipio left empty
    await expect(nextBtn).toBeDisabled();
    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();

  });

  test('5. Cannot continue Location step without Fotos', async ({ page }) => {
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

    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
    await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com/arcgis-test');

    // Fotos left empty
    await expect(nextBtn).toBeDisabled();
    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();
  });

  test('6. Cannot continue Location step without Enlace ARCGIS', async ({ page }) => {
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

    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
    await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com/fotos-test');

    // Enlace ARCGIS left empty
    await expect(nextBtn).toBeDisabled();
    await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();
  });

  test('7. Optional Location fields are not required to advance', async ({ page }) => {
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

    // Localidad, Vereda, Tipo de zona, Latitud, Longitud, Carpeta altitud,
    // Nombre planilla, Descripción intentionally left empty

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });
    await expect(page.getByTestId('activesCreateStepper')).toContainText('Proyecto e infraestructura');
  });

});