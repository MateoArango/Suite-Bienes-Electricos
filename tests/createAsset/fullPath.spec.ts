import { test, expect } from './fixtures';

test.describe('Activos - Creación y Registro', () => {

  test('Full Path - Create Active', async ({ page }) => {
    // Shared Locators
    const stepper = page.getByTestId('activesCreateStepper');
    const nextBtn = page.getByRole('button', { name: 'Siguiente' });
    const calendarBtn = page.getByRole('button', { name: 'Open calendar' });
    const dateBtn = page.locator('button[aria-current="date"]');

    await test.step('Login - Register and Ubication', async () => {
      await page.goto('/');
      await page.getByTestId('loginUserFieldContainer').getByText('Usuario').click();
      await page.getByRole('textbox', { name: 'Usuario' }).fill('qa');
      await page.getByRole('textbox', { name: 'Usuario' }).press('Enter');
      await page.getByTestId('loginSubmitButton').click();
      await page.getByTestId('loginPasswordFieldContainer').getByText('Contraseña').click();
      await page.getByRole('textbox', { name: 'Contraseña' }).fill('123456');
      await page.getByTestId('loginSubmitButton').click();
      //start
      await page.getByRole('button', { name: 'Crear activo' }).click();
      await expect(page.getByRole('heading', { name: 'Crear activo' })).toBeVisible();
      await expect(page.getByText('Selección placa')).toBeVisible();
      //assertion 'Cargando más placas...'
      await expect(page.getByText('Cargando más placas...')).toBeVisible();
      await page.waitForTimeout(20000);
      // Selects the first option matching the pattern, regardless of the dynamic ID
      const plateOption = page.getByTestId(/activesCreatePlacaOption\d+/).first();

      const plateText = await plateOption.innerText();
      console.log('Plate:', plateText);

      await plateOption.click();

      await nextBtn.click();
      await page.getByTestId('activesCreateDepartamento').waitFor({ state: 'visible' });

      await expect(page.locator('span').filter({ hasText: /^Ubicación y registro$/ })).toBeVisible();

      await expect(stepper).toContainText('Sub paso 1 de 1');


      await page.getByTestId('activesCreateDepartamento').getByText('Departamento').click();
      await page.locator('mat-option', { hasText: '-ATLÁNTICO' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: '-ATLÁNTICO' }).click();
      await page.getByTestId('activesCreateMunicipio').getByText('Municipio').click();
      await page.locator('mat-option', { hasText: '-GALAPA' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: '-GALAPA' }).click();
      await page.getByTestId('activesCreateUbicacionContainer').getByText('Localidad').click();
      await page.getByRole('textbox', { name: 'Localidad' }).fill('loremIpsumdolorSitAmet3123123');
      await page.getByTestId('activesCreateUbicacionVereda').getByText('Vereda').click();
      await page.getByRole('textbox', { name: 'Vereda' }).fill('loremIpsumdolorSitAmet3123123');
      await page.getByTestId('activesCreateUbicacionTipoZona').getByText('Tipo de zona').click();
      await page.locator('mat-option', { hasText: 'Urbano' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Urbano' }).click();
      await page.getByTestId('activesCreateUbicacionLatitud').getByText('Latitud').click();
      await page.getByRole('textbox', { name: 'Latitud' }).fill('12222222222222222222223,33.A-A');
      await page.getByTestId('activesCreateUbicacionLongitud').getByText('Longitud').click();
      await page.getByRole('textbox', { name: 'Longitud' }).fill('12222222222222222222223,33.A-A');
      await page.getByTestId('activesCreateUbicacionEnlaceFotos').getByText('Fotos').click();
      await page.getByRole('textbox', { name: 'Fotos' }).fill('https://www.google.com11111111111111111111111111112222222222222222222222222222222222222222233333333333333333333333333333333333333333asd11111111111111111111111111111111111222222222222222222222222222222222222222teot');
      await page.getByTestId('activesCreateUbicacionEnlaceArcgis').getByText('Enlace ARCGIS').click();
      await page.getByRole('textbox', { name: 'Enlace ARCGIS' }).fill('https://www.google.com11111111111111111111111111112222222222222222222222222222222222222222233333333333333333333333333333333333333333asd11111111111111111111111111111111111222222222222222222222222222222222222222teo');
      await page.getByTestId('activesCreateUbicacionCarpetaAltitud').getByText('Carpeta altitud').click();
      await page.getByRole('textbox', { name: 'Carpeta altitud' }).fill('https://www.google.com11111111111111111111111111112222222222222222222222222222222222222222233333333333333333333333333333333333333333asd11111111111111111111111111111111111222222222222222222222222222222222222222teo');
      await page.getByTestId('activesCreateUbicacionNombrePlantilla').getByText('Nombre planilla').click();
      await page.getByRole('textbox', { name: 'Nombre planilla' }).fill('nombreplan');

      await page.getByTestId('activesCreateUbicacionContainer').getByText('Descripción').click();
      await page.getByRole('textbox', { name: 'Descripción' }).fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel metus non leo interdum laoreet. Sed ut erat hendrerit, commodo nunc eu, malesuada metus. Mauris ut tellus nec augue bibendum mollis a vel urna.');

      // Final verification
      await expect(nextBtn).toBeEnabled();

      //All camps filled
      await expect(stepper).toContainText('Campos13 de 13');
      await nextBtn.click();
      await page.getByTestId('activesCreateProyectoProyecto').waitFor({ state: 'visible' });


    });

    await test.step('Proyecto e infraestructura Sub Step 1-2', async () => {
      //Proyecto e infraestructura Sub Step 1-2
      await expect(stepper).toContainText('Proyecto e infraestructura');
      await expect(stepper).toContainText('Sub paso 1 de 2');

      await page.getByTestId('activesCreateProyectoProyecto').getByText('Proyecto').click();

      await page.getByRole('textbox', { name: 'Proyecto' }).fill('https:22www.goo');
      await page.getByTestId('activesCreateProyectoSubestacion').getByText('Subestación').click();
      await page.getByRole('textbox', { name: 'Subestación' }).fill('ssaaaaa2ad');

      await page.getByTestId('activesCreateProyectoCircuito').getByText('Circuito').click();
      await page.getByRole('textbox', { name: 'Circuito' }).fill('https://www.google.com11111111111111111111111111112222222222222222222222222222222222222222233333333333333333333333333333333333333333asd11111111111111111111111111111111111222222222222222222222222222222222222222teot');
      await page.getByTestId('activesCreateProyectoTipoEnergia').getByText('Tipo energía').click();
      await page.locator('mat-option', { hasText: 'Diesel' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Diesel' }).click();

      await page.getByTestId('activesCreateProyectoTipoConductor').getByText('Conductor').click();
      await page.locator('mat-option', { hasText: 'Desnudo' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Desnudo' }).click();
      await page.getByTestId('activesCreateProyectoNodoAnterior').getByText('Nodo anterior').click();
      await page.getByRole('textbox', { name: 'Nodo anterior' }).fill('aaa22333aaaaa');
      await page.getByTestId('activesCreateProyectoNodoActual').getByText('Nodo actual').click();
      await page.getByRole('textbox', { name: 'Nodo actual' }).fill('aaa22333aaaaa');
      await expect(stepper).toContainText('Campos7 de 7');
      await nextBtn.click();
      await page.getByTestId('activesCreateResponsableUsuarioBien').waitFor({ state: 'visible' });

    });

    await test.step('Responsible and contracts Sub Step 2-2', async () => {
      //Responsible and contracts Sub Step 2-2


      await expect(stepper).toContainText('Responsable y contratos');
      await expect(stepper).toContainText('Sub paso 2 de 2');



      await page.getByTestId('activesCreateResponsableUsuarioBien').getByText('Usuario del bien').click();
      await page.getByRole('textbox', { name: 'Usuario del bien' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableMemorando').getByText('Memorando').click();
      await page.getByRole('textbox', { name: 'Memorando' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableContratoIpse').getByText('Contrato IPSE').click();
      await page.getByRole('textbox', { name: 'Contrato IPSE' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableContratoCcg').getByText('Contrato CCG').click();
      await page.getByRole('textbox', { name: 'Contrato CCG' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableIdContratoAom').getByText('ID contrato A.O.M').click();
      await page.getByRole('textbox', { name: 'ID contrato A.O.M' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableNumeroContratoOperadorAom').getByText('Número contrato operador A.O.M').click();
      await page.getByRole('textbox', { name: 'Número contrato operador A.O.M' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateResponsableVigenciaContratoAom').getByText('Vigencia del contrato A.O.M').click();
      await page.getByRole('textbox', { name: 'Vigencia del contrato A.O.M' }).fill('lorem ipsum dolor sit amet');


      await page.getByTestId('activesCreateProyectoFechaSuscripcionContratoAom').getByRole('button', { name: 'Open calendar' }).click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();

      await page.locator('bds-form-field', { hasText: 'Número de contacto operador A.O.M' }).click();
      await page.locator('bds-form-field', { hasText: 'Número de contacto operador A.O.M' }).locator('input').fill('2111112233');

      await page.getByTestId('activesCreateResponsableEmailOperadorAom').getByText('Email operador A.O.M').click();
      await page.getByRole('textbox', { name: 'Email operador A.O.M' }).fill('lorem ipsum dolor sit amet');

      await page.locator('bds-form-field', { hasText: 'Nombre de contacto del operador' }).click();
      await page.locator('bds-form-field', { hasText: 'Nombre de contacto del operador' }).locator('input').fill('Loremssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss22222222222');

      await page.locator('bds-form-field', { hasText: 'NIT/C.C. USUARIO' }).click();
      await page.locator('bds-form-field', { hasText: 'NIT/C.C. USUARIO' }).locator('input').fill('232122232323322');

      await page.locator('bds-form-field', { hasText: 'Operador/Responsable' }).click();
      await page.locator('bds-form-field', { hasText: 'Operador/Responsable' }).locator('input').fill('loreeeeeeeeeeeeeem1111111111111111111111111111122222222222222222222222222223333333333333333333333333');

      await page.getByTestId('activesCreateResponsableNumeroPolizasObra').getByText('N.º de pólizas de contratos').click();
      await page.getByRole('textbox', { name: 'N.º de pólizas de contratos' }).fill('lorem ipsum dolor sit amet');

      await page.getByTestId('activesCreateProyectoFechaInicialPolizasObra').getByRole('button', { name: 'Open calendar' }).click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();

      await page.getByTestId('activesCreateProyectoFechaFinalPolizasObra').getByRole('button', { name: 'Open calendar' }).click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();

      await page.getByTestId('activesCreateResponsableTipoPolizaObra').getByText('Tipo de pólizas de contratos de obra').click();
      await page.getByRole('textbox', { name: 'Tipo de pólizas de contratos de obra' }).fill('lorem ipsum dolor sit amet');
      await page.getByTestId('activesCreateResponsableObservacionEstado').getByText('Observación estado').click();
      await page.getByRole('textbox', { name: 'Observación estado' }).fill('lorem ipsum dolor sit amet');

      await expect(stepper).toContainText('Campos18 de 18');
      await nextBtn.click();
      await page.getByTestId('activesCreateValoracionForm').waitFor({ state: 'visible' });

    });

    await test.step('Financial valuation Step 1-2', async () => {
      // Financial valuation Step 1-2

      await expect(stepper).toContainText('Valoración financiera');
      await expect(stepper).toContainText('Sub paso 1 de 2');


      await page.getByTestId('activesCreateValoracionForm').click();
      await page.getByRole('textbox', { name: 'Valor UC' }).click();
      await page.getByRole('textbox', { name: 'Valor UC' }).fill('1111111111111111');
      await page.getByRole('textbox', { name: 'Avalúo RV' }).click();
      await page.getByRole('textbox', { name: 'Avalúo RV' }).fill('111111111111111');
      await page.getByTestId('activesCreateResponsableFuente').click();
      await page.getByTestId('activesCreateResponsableFuente').locator('input').fill('ddddddddddddddddddddddddddddddddddddddd2222222222222222333333333333333333333333333333333333333333333');
      await page.getByTestId('activesCreateValoracionFormaAdquisicion').click();
      await page.locator('mat-option', { hasText: 'Recursos Mixtos' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Recursos Mixtos' }).click();
      await page.locator('bds-form-field', { hasText: 'Titularidad y participación propiedad del IPSE' }).locator('input').fill('100');
      await page.locator('bds-form-field', { hasText: 'Valor asociado a su adquisición' }).locator('input').fill('111111111111111');
      await page.locator('bds-form-field', { hasText: 'Valor asociado a su mantenimiento' }).locator('input').fill('111111111111111');
      await page.locator('bds-form-field', { hasText: 'Edad agotada' }).locator('input').fill('22222');
      await page.locator('bds-form-field', { hasText: 'Edad tipo de vida útil' }).locator('input').fill('22222');
      await page.locator('bds-form-field', { hasText: 'Vida remanente' }).locator('input').fill('22222');


      await expect(stepper).toContainText('Campos10 de 10');
      await nextBtn.click();
      await page.getByTestId('activesCreateResponsableMarca').waitFor({ state: 'visible' });


    });

    await test.step('Machine features Step 2-2', async () => {
      // Machine features Step 2-2

      await page.getByTestId('activesCreateResponsableMarca').getByText('Marca').fill('aaaaaaaaaaaaaaaaaaaaaaa3333331')
      await page.getByRole('textbox', { name: 'Cantidad' }).fill('23332');
      await page.getByTestId('activesCreateResponsableClase').getByText('Clase').fill('121312123');
      await page.getByTestId('activesCreateResponsableSerie').getByText('Serie').fill('2333223332233322aaaaaaaaa23332');
      await page.getByTestId('activesCreateResponsableCapacidadKvaKw').getByText('Capacidad kVA/kW').fill('23311');
      await page.getByRole('textbox', { name: 'Capacidad kVA', exact: true }).fill('12332');
      await page.getByRole('textbox', { name: 'Capacidad kW' }).fill('22312');
      await page.getByTestId('activesCreateResponsableFuncionamiento').getByText('Funcionamiento').fill('aa232');
      await page.getByTestId('activesCreateResponsableRetiradoMtto').getByText('Retirado por mtto').fill('as23-');
      await page.getByTestId('activesCreateCaracteristicasEstadoEquipo').getByText('Estado del equipo').click();
      await page.locator('mat-option', { hasText: 'Malo' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Malo' }).click();
      await page.getByRole('textbox', { name: 'Edad aparente' }).fill('11111');
      await page.getByRole('textbox', { name: 'Municipio de levantamiento' }).fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      await page.getByRole('textbox', { name: 'Localidad de levantamiento' }).fill('222222222222222322323232aaaaaa');
      await page.getByTestId('activesCreateResponsableCodigoCregGeneral').getByText('Código CREG').fill('1aaaa3333333221');
      await calendarBtn.click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();
      await page.getByTestId('activesCreateCaracteristicasPcbs').getByText('PCBS').click();
      await page.locator('mat-option', { hasText: 'No libre de PCB' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'No libre de PCB' }).click();
      await page.getByTestId('activesCreateResponsableTipoAislamiento').getByText('Tipo aislamiento').fill('aaaaaaaaaaaaa23eeeeeeeeraaaa34');
      await page.getByTestId('activesCreateResponsableTipoInstalacion').getByText('Tipo instalación').fill('aaaaaa3-');
      await page.getByTestId('activesCreateResponsableSistemaPuestaTierra').getByText('Existe sistema de puesta a tierra').fill('aaaa3');


      await expect(stepper).toContainText('Campos19 de 19');
      await nextBtn.click();
      await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).waitFor({ state: 'visible' });

    });

    await test.step('Support and Structure sub Step 1-3', async () => {
      //Support and Structure sub Step 1-3



      await page.getByRole('textbox', { name: 'Altura apoyo (m)' }).fill('22345');
      await page.getByTestId('activesCreateResponsableDisposicionApoyo').locator('input').fill('asdasdsad2');
      await page.getByTestId('activesCreateResponsableMaterialApoyo').locator('input').fill('asddddddddddd2233333');
      await page.getByTestId('activesCreateResponsableResistenciaApoyo').locator('input').fill('ddddsa22222333333443');
      await page.getByTestId('activesCreateResponsableFtoApoyo').locator('input').fill('ddddd');
      await page.getByTestId('activesCreateApoyoEstadoApoyo').click();
      await page.locator('mat-option', { hasText: 'Malo' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Malo' }).click();
      await page.getByTestId('activesCreateResponsableTipoEstructura').locator('input').fill('dddd23323');
      await page.getByTestId('activesCreateResponsableFtoEstructura').locator('input').fill('3232');
      await page.getByTestId('activesCreateApoyoEstadoEstructura').click();
      await page.locator('mat-option', { hasText: 'Malo' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Malo' }).click();
      await page.getByTestId('activesCreateResponsablePuestaTierra').getByText('Puesta a tierra').fill('as2f3');



      await expect(stepper).toContainText('Campos10 de 10');
      await nextBtn.click();
      await page.getByRole('textbox', { name: 'Nro. fases' }).waitFor({ state: 'visible' });

    });

    await test.step('Driver and network Sub Step 2-3', async () => {
      //Driver and network Sub Step 2-3

      await page.getByRole('textbox', { name: 'Nro. fases' }).fill('12323');
      await page.getByRole('textbox', { name: 'Calibre conductor' }).fill('12323');
      await page.getByTestId('activesCreateResponsableMaterialConductor').getByText('Material conductor').fill('asdd2ddddddddddddd3d');
      await page.getByRole('textbox', { name: 'Cant. circuitos' }).fill('22213');


      await page.getByTestId('activesCreateResponsableFtoConductor').getByText('Foto conductor').fill('11a32');
      await page.getByTestId('activesCreateConductorEstadoConductor').click();
      await page.locator('mat-option', { hasText: 'Malo' }).waitFor({ state: 'visible' });
      await page.getByRole('option', { name: 'Malo' }).click();


      await page.getByTestId('activesCreateResponsableCableGuardaKm').getByText('Cable guarda').fill('asd2223333aaaaaaaaaa');
      await page.getByRole('textbox', { name: 'Templetes' }).fill('12131');
      await page.getByRole('textbox', { name: 'Cant. conductor (km)' }).fill('12321');
      await page.getByRole('textbox', { name: 'Longitud calc (m)' }).fill('13212');

      await page.getByTestId('activesCreateResponsableAtributosRed').getByText('Atributos de la red').fill('});sdddddddddddd2222222222222222223333333333aaad3sdddddddddddd2222222222222222223333333333aaad3sdddddddddddd2222222222222222223333333333aaad3sdddddddddddd2222222222222222223333333333aaad3});sddddddddd');



      await expect(stepper).toContainText('Campos11 de 11');
      await nextBtn.click();
      await page.getByTestId('activesCreateResponsableAtributosApoyo').waitFor({ state: 'visible' });


    });

    await test.step('CREG code and others Sub Step 3 - 3', async () => {
      //CREG code and others Sub Step 3 - 3



      await page.getByTestId('activesCreateResponsableAtributosApoyo').locator('input').fill('asddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasdasddddddddd2222222222222222223333333333aasd3ssasddddddddd2222222222222');
      await page.getByTestId('activesCreateResponsableCodigoCregApoyo').locator('input').fill('sd2222222222222211sd2222221111');
      await page.getByTestId('activesCreateResponsableCodigoCregConductor').locator('input').fill('dddddddadddddddadddddddadddddd');
      await page.getByTestId('activesCreateResponsableCodigoCregCableGuarda').locator('input').fill('ssssssssssssssssss2222222sssss');
      await page.getByTestId('activesCreateResponsableCodigoCregPuestaTierra').locator('input').fill('aaa2223aaadeeaaa2223aaadeeaaa2');
      await page.getByTestId('activesCreateResponsableCodigoCregFibraOptica').locator('input').fill('a233333333333333333333sda23333');
      await page.getByTestId('activesCreateResponsableTipoPolizasContratoAOM').locator('input').fill('a233333333333333333333sda23333a2333333333333333333');
      await page.getByRole('textbox', { name: 'Valor CREG apoyo' }).fill('1222222222222222');
      await page.getByRole('textbox', { name: 'Valor CREG conductor' }).fill('1222222222222222');
      await page.getByTestId('activesCreateCodigoFechaFinalPolizasAom').getByRole('button', { name: 'Open calendar' }).click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();
      await page.getByTestId('activesCreateResponsableNumeroPolizasAom').locator('input').fill('a233333333333333333333sda23333');
      await page.getByTestId('activesCreateCodigoFechaInicialPolizasAom').getByRole('button', { name: 'Open calendar' }).click();
      await dateBtn.waitFor({ state: 'visible' });
      await dateBtn.click();
      await expect(stepper).toContainText('Campos12 de 12');
      await page.getByRole('button', { name: 'Finalizar' }).click();
      await expect(page.getByText('El activo se registró')).toBeVisible();

    });
  });
});
