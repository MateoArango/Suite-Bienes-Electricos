import { test, expect } from './fixtures';

test.describe('Crear Activo - P1 Date Picker Behavior', () => {

  test('13. Date fields do not allow manual typing', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const dateBtn = page.locator('button[aria-current="date"]');

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

    // Proyecto e infraestructura - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    // Target field: Fecha suscripción contrato A.O.M


    const dateFieldContainer = page.getByTestId('activesCreateProyectoFechaSuscripcionContratoAom');
    const dateInput = dateFieldContainer.locator('input');

    // Try to type a date manually
    // force: true is needed because Angular Material's mat-label overlaps the
    // input and intercepts pointer events, causing a timeout without it.
    await dateInput.click({ force: true });
    await page.keyboard.type('2026-06-30', { delay: 20 });
    const typedValue = await dateInput.inputValue();

    // Value should remain empty / unchanged by manual typing
    expect(typedValue).not.toBe('2026-06-30');

    // Now select via calendar - value should populate
    await dateFieldContainer.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();

    const calendarValue = await dateInput.inputValue();
    expect(calendarValue.length).toBeGreaterThan(0);

  });

  test('14. Date fields can only be populated via calendar selection', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const dateBtn = page.locator('button[aria-current="date"]');
 
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
 
    // Proyecto e infraestructura - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });
 
    // --- Fecha suscripción contrato A.O.M ---
    const fechaSuscripcionAom = page.getByTestId('activesCreateProyectoFechaSuscripcionContratoAom');
    const fechaSuscripcionAomInput = fechaSuscripcionAom.locator('input');
    await fechaSuscripcionAomInput.click({force: true});
    await page.keyboard.type('2026-06-30', { delay: 20 });
    expect(await fechaSuscripcionAomInput.inputValue()).not.toBe('2026-06-30');
    await fechaSuscripcionAom.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();
    await expect(fechaSuscripcionAomInput).not.toHaveValue('');
 
    // --- Fecha inicial pólizas obra ---
    const fechaInicialPolizasObra = page.getByTestId('activesCreateProyectoFechaInicialPolizasObra');
    const fechaInicialPolizasObraInput = fechaInicialPolizasObra.locator('input');
    await fechaInicialPolizasObraInput.click({force: true});
    await page.keyboard.type('2026-06-30', { delay: 20 });
    expect(await fechaInicialPolizasObraInput.inputValue()).not.toBe('2026-06-30');
    await fechaInicialPolizasObra.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();
    await expect(fechaInicialPolizasObraInput).not.toHaveValue('');
 
    // --- Fecha final pólizas obra ---
    const fechaFinalPolizasObra = page.getByTestId('activesCreateProyectoFechaFinalPolizasObra');
    const fechaFinalPolizasObraInput = fechaFinalPolizasObra.locator('input');
    await fechaFinalPolizasObraInput.click({force: true});
    await page.keyboard.type('2026-06-30', { delay: 20 });
    expect(await fechaFinalPolizasObraInput.inputValue()).not.toBe('2026-06-30');
    await fechaFinalPolizasObra.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();
    await expect(fechaFinalPolizasObraInput).not.toHaveValue('');
 
    // Advance to Responsable y contratos required fields, then continue toward CREG step
    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });
 
    // Valoración financiera - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });
 
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });
 
    // Support and Structure - skip, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });
 
    // Driver and network - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableAtributosApoyo').waitFor({ state: 'visible' });
 
    // --- Fecha final pólizas AOM ---
    const fechaFinalPolizasAom = page.getByTestId('activesCreateCodigoFechaFinalPolizasAom');
    const fechaFinalPolizasAomInput = fechaFinalPolizasAom.locator('input');
    await fechaFinalPolizasAomInput.click({force: true});
    await page.keyboard.type('2026-06-30', { delay: 20 });
    expect(await fechaFinalPolizasAomInput.inputValue()).not.toBe('2026-06-30');
    await fechaFinalPolizasAom.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();
    await expect(fechaFinalPolizasAomInput).not.toHaveValue('');
 
    // --- Fecha inicial pólizas AOM ---
    const fechaInicialPolizasAom = page.getByTestId('activesCreateCodigoFechaInicialPolizasAom');
    const fechaInicialPolizasAomInput = fechaInicialPolizasAom.locator('input');
    await fechaInicialPolizasAomInput.click({force: true});
    await page.keyboard.type('2026-06-30', { delay: 20 });
    expect(await fechaInicialPolizasAomInput.inputValue()).not.toBe('2026-06-30');
    await fechaInicialPolizasAom.getByRole('button', { name: 'Open calendar' }).click();
    await dateBtn.waitFor({ state: 'visible' });
    await dateBtn.click();
    await expect(fechaInicialPolizasAomInput).not.toHaveValue('');
  });

});