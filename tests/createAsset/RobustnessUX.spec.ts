import { test, expect } from './fixtures';

test.describe('Crear Activo - P2 Robustness / UX', () => {

  test('23. Changing Departamento resets Municipio', async ({ page }) => {
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
      const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
      await plateOption.waitFor({ state: 'visible', timeout: 30000 });
      await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    // Select Departamento + Municipio
    await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
    await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
    await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
    await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-GALAPA' }).click();

    await expect(page.getByRole('combobox', { name: 'Municipio' })).toContainText('GALAPA');

    // Change Departamento to a different one
    await page.getByRole('combobox', { name: 'Departamento' }).click();
    await page.locator('mat-option', { hasText: '-ANTIOQUIA' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-ANTIOQUIA' }).click();

    // Municipio must reset - previous selection (GALAPA, tied to ATLÁNTICO) no longer valid
    await expect(page.getByRole('combobox', { name: 'Municipio' })).not.toContainText('GALAPA');

    // Siguiente should block again since Municipio now requires re-selection
    await expect(nextBtn).toBeDisabled();

    // Re-selecting a valid Municipio for the new Departamento should unblock
    await page.getByRole('combobox', { name: 'Municipio' }).click();
    await page.locator('mat-option', { hasText: '-AMAGÁ' }).waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '-AMAGÁ' }).click();
    await expect(page.getByRole('combobox', { name: 'Municipio' })).toContainText('AMAGÁ');
  });

  test('25. Optional long-text fields: empty does not block, overflow is capped', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const endBtn = page.getByRole('button', { name: 'Finalizar' });

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
      const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();
      await plateOption.waitFor({ state: 'visible', timeout: 30000 });
      await plateOption.click();
    await nextBtn.click();
    await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

    // Fill only the 4 required Location fields
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

    // --- Descripción: empty should not block advancing ---
    await expect(nextBtn).toBeEnabled();

    // Overflow check on Descripción before moving on
    const descripcion = page.getByRole('textbox', { name: 'Descripción' });
    await page.getByTestId('activesCreateUbicacionContainer').getByText('Descripción').click();
    await descripcion.fill('x'.repeat(2000));
    const descripcionValue = await descripcion.inputValue();
    expect(descripcionValue.length).toBeLessThan(2248);
    expect(descripcionValue.length).toBeGreaterThan(0);

    // Clear it back to empty and confirm Siguiente is still enabled (optional field)
    await descripcion.fill('');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    // Proyecto e infraestructura - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    // Responsable y contratos - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    // Valoración financiera - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    // Machine features - skip, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    // Support and Structure - skip, just advance
    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });

    // --- Atributos de la red: empty should not block, overflow should be capped ---
    await expect(nextBtn).toBeEnabled();

    const atributosRed = page.getByTestId('activesCreateResponsableAtributosRed').getByText('Atributos de la red');
    const atributosRedInput = page.getByTestId('activesCreateResponsableAtributosRed').locator('input');
    await atributosRed.click();
    await atributosRedInput.fill('x'.repeat(2000));
    const atributosRedValue = await atributosRedInput.inputValue();
    expect(atributosRedValue.length).toBeLessThan(2000);
    expect(atributosRedValue.length).toBeGreaterThan(0);

    await atributosRedInput.fill('');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableAtributosApoyo').waitFor({ state: 'visible' });

    // --- Atributos apoyo: empty should not block, overflow should be capped ---
    await expect(endBtn).toBeEnabled();

    const atributosApoyo = page.getByTestId('activesCreateResponsableAtributosApoyo').locator('input');
    await atributosApoyo.fill('x'.repeat(2000));
    const atributosApoyoValue = await atributosApoyo.inputValue();
    expect(atributosApoyoValue.length).toBeLessThan(2000);
    expect(atributosApoyoValue.length).toBeGreaterThan(0);

    await atributosApoyo.fill('');
    await expect(endBtn).toBeEnabled();
  });

});