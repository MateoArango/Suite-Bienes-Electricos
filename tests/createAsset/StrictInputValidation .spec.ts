import { test, expect } from './fixtures';

test.describe('Crear Activo - P0 Strict Input Validation', () => {

  test('8. Fotos enforces max length exactly', async ({ page }) => {
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

    const fotosField = page.getByRole('textbox', { name: 'Fotos' });
    await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();

    const MAX_LENGTH = 200;

    // Fill exactly max -> value should equal max length
    const maxValue = 'a'.repeat(MAX_LENGTH);
    await fotosField.fill(maxValue);
    await expect(fotosField).toHaveValue(maxValue);

    // Fill max + 1 (extra char distinguishable) -> length stays at max, extra char absent
    const overMaxValue = 'a'.repeat(MAX_LENGTH) + 'Z';
    await fotosField.fill(overMaxValue);
    const result = await fotosField.inputValue();
    expect(result.length).toBe(MAX_LENGTH);
    expect(result).not.toContain('Z');
  });

  test('9. Enlace ARCGIS enforces max length exactly', async ({ page }) => {
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

    const arcgisField = page.getByRole('textbox', { name: 'Enlace ARCGIS' });
    await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();

    const MAX_LENGTH = 100;

    const maxValue = 'a'.repeat(MAX_LENGTH);
    await arcgisField.fill(maxValue);
    await expect(arcgisField).toHaveValue(maxValue);

    const overMaxValue = 'a'.repeat(MAX_LENGTH) + 'Z';
    await arcgisField.fill(overMaxValue);
    const result = await arcgisField.inputValue();
    expect(result.length).toBe(MAX_LENGTH);
    expect(result).not.toContain('Z');
  });

  test('10a. Valoración financiera - 5-char fields reject the 6th character', async ({ page }) => {
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

    // Required Location fields to advance
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

    // Responsable y contratos - skip, just advance
    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    // Valoración financiera - target fields
    const edadAgotada = page.locator('bds-form-field', { hasText: 'Edad agotada' }).locator('input');
    await edadAgotada.fill('123456');
    await expect(edadAgotada).toHaveValue('12345');

    const edadVidaUtil = page.locator('bds-form-field', { hasText: 'Edad tipo de vida útil' }).locator('input');
    await edadVidaUtil.fill('123456');
    await expect(edadVidaUtil).toHaveValue('12345');

    const vidaRemanente = page.locator('bds-form-field', { hasText: 'Vida remanente' }).locator('input');
    await vidaRemanente.fill('123456');
    await expect(vidaRemanente).toHaveValue('12345');
  });
  test('10b. Machine features - 5-char fields reject the 6th character', async ({ page }) => {
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
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    // Machine features - target fields
    const cantidad = page.getByRole('textbox', { name: 'Cantidad' });
    await cantidad.fill('123456');
    await expect(cantidad).toHaveValue('12345');

    const capacidadKvaKw = page.getByTestId('activesCreateResponsableCapacidadKvaKw').locator('input');
    await capacidadKvaKw.fill('123456');
    await expect(capacidadKvaKw).toHaveValue('12345');

    const capacidadKva = page.getByRole('textbox', { name: 'Capacidad kVA', exact: true });
    await capacidadKva.fill('123456');
    await expect(capacidadKva).toHaveValue('12345');

    const capacidadKw = page.getByRole('textbox', { name: 'Capacidad kW' });
    await capacidadKw.fill('123456');
    await expect(capacidadKw).toHaveValue('12345');

    const edadAparente = page.getByRole('textbox', { name: 'Edad aparente' });
    await edadAparente.fill('123456');
    await expect(edadAparente).toHaveValue('12345');
  });

  test('10c. Support and Structure - Altura apoyo rejects the 6th character', async ({ page }) => {
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
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    // Support and Structure - target field
    const alturaApoyo = page.getByRole('textbox', { name: 'Altura apoyo (m)' });
    await alturaApoyo.fill('123456');
    await expect(alturaApoyo).toHaveValue('12345');
  });

  test('10d. Driver and network - 5-char fields reject the 6th character', async ({ page }) => {
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
    await nextBtn.click();
    await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    await nextBtn.click();
    await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });

    // Driver and network - target fields
    const nroFases = page.getByRole('textbox', { name: 'Nro. fases' });
    await nroFases.fill('123456');
    await expect(nroFases).toHaveValue('12345');

    const calibreConductor = page.getByRole('textbox', { name: 'Calibre conductor' });
    await calibreConductor.fill('123456');
    await expect(calibreConductor).toHaveValue('12345');

    const cantCircuitos = page.getByRole('textbox', { name: 'Cant. circuitos' });
    await cantCircuitos.fill('123456');
    await expect(cantCircuitos).toHaveValue('12345');

    const templetes = page.getByRole('textbox', { name: 'Templetes' });
    await templetes.fill('123456');
    await expect(templetes).toHaveValue('12345');

    const cantConductorKm = page.getByRole('textbox', { name: 'Cant. conductor (km)' });
    await cantConductorKm.fill('123456');
    await expect(cantConductorKm).toHaveValue('12345');

    const longitudCalc = page.getByRole('textbox', { name: 'Longitud calc (m)' });
    await longitudCalc.fill('123456');
    await expect(longitudCalc).toHaveValue('12345');
  });

  test('11. Masked fields ignore invalid characters', async ({ page }) => {
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

    // Required fields to advance through Location step
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

    // NIT/C.C. USUARIO: assumes numeric-only mask
    const nitField = page.locator('bds-form-field', { hasText: 'NIT/C.C. USUARIO' }).locator('input');
    await page.locator('bds-form-field', { hasText: 'NIT/C.C. USUARIO' }).click();
    await nitField.fill('12-34A.56,7B');
    const nitValue = await nitField.inputValue();
    // ASSUMPTION: letters, dashes, dots, commas are stripped, digits survive.
    // Confirm actual mask behavior if this fails.
    expect(nitValue).toMatch(/^\d*$/);

    // Número de contacto operador A.O.M: assumes digits and dot mask
    const phoneField = page.locator('bds-form-field', { hasText: 'Número de contacto operador A.O.M' }).locator('input');
    await page.locator('bds-form-field', { hasText: 'Número de contacto operador A.O.M' }).click();
    await phoneField.fill('21a-11.122b33+');
    const phoneValue = await phoneField.inputValue();
    // ASSUMPTION: non-digit characters are stripped. Confirm actual mask behavior.
    expect(phoneValue).toMatch(/^\d+(\.\d+)?$/);
  });


    test('12. Fotos enforces max length via typing and paste', async ({ page, context }) => {
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
  
      const fotosField = page.getByRole('textbox', { name: 'Fotos' });
      await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
  
      const MAX_LENGTH = 200;
  
      // Path 1: fill() — truncated at MAX_LENGTH, extra chars are rejected
      await fotosField.fill('a'.repeat(MAX_LENGTH + 10));
      let result = await fotosField.inputValue();
      expect(result.length).toBe(MAX_LENGTH);
      expect(result).not.toContain('a'.repeat(MAX_LENGTH + 1)); // extra char absent
  
      // Path 2: real keyboard typing — browser enforces limit key-by-key
      await fotosField.fill('');
      await fotosField.pressSequentially('b'.repeat(MAX_LENGTH + 10), { delay: 1 });
      result = await fotosField.inputValue();
      expect(result.length).toBe(MAX_LENGTH);
  
      // Path 3: clipboard paste — limit holds even for pasted content
      await fotosField.fill('');
      await page.evaluate(async (text: string) => {
        await navigator.clipboard.writeText(text);
      }, 'c'.repeat(MAX_LENGTH + 10));
      await fotosField.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Control+V');
      result = await fotosField.inputValue();
      expect(result.length).toBe(MAX_LENGTH);
    });
  

});