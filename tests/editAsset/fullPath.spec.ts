import { test, expect } from '../fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

test('Editar Activo - P0 Full Path', async ({ page }) => {
    const basePage = new BasePage(page);
    const saveBtn = page.getByTestId('activesDetailSave');
    const deleteBtn = page.getByTestId('activesDetailDelete');
    const descriptionBtn = page.getByTestId('activesDetailDescription');
    const editAsset = new EditAssetPage(page);
    const cancelBtn = page.getByTestId('activesDetailCancel');

    await basePage.login('qa', '123456');

    //UBICATION AND REGISTER
    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/dashboard/bienelectrico/detalle/00000198'); //196 - 198 - 077
    //ubication
    await page.getByTestId('activesDetailEdit').click();
    await expect(page.getByRole('button', { name: 'Ubicación Datos geográficos' })).toBeVisible();
    await page.getByTestId('activesDetailUbicacionForm').getByText('Departamento').click();
    await page.getByRole('option', { name: '-VAUPÉS' }).click();
    await page.getByTestId('activesDetailUbicacionForm').getByText('Municipio').click();
    await page.getByRole('option', { name: '-PACOA' }).click();
    await page.getByTestId('longitud').click();
    await page.getByTestId('longitud').fill('-33.2');
    await page.getByTestId('vereda').click();
    await page.getByTestId('vereda').fill('Vereda');
    await page.getByTestId('activesDetailUbicacionForm').getByText('Localidad').fill('localidad');
    await page.getByTestId('latitud').fill('33');

    await page.getByLabel('Tipo de zona').click();

    await page.getByRole('option', { name: 'Urbano' }).click();

    //Register
    await page.getByRole('button', { name: 'Registro Enlaces y' }).click();
    await page.getByTestId('enlaceFotos').fill('https://www.google.com');
    await page.getByTestId('enlaceArcgis').fill('https://www.google.com');
    await page.getByTestId('carpetaAltitud').fill('https://www.google.com');
    await page.getByTestId('nombrePlantilla').fill('nombreplan');
    await page.getByTestId('activesDetailUbicacionDescripcion').fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel metus non leo interdum laoreet. Sed ut erat hendrerit, commodo nunc eu, malesuada metus. Mauris ut tellus nec augue bibendum mollis a vel urna.');
    //PROJECT AND MANAGEMENT
    //Project and infrastructure
    await page.getByRole('tab', { name: 'Proyecto y gestión' }).click();
    await expect(page.getByRole('button', { name: 'Proyecto e infraestructura' })).toBeVisible();
    await page.getByTestId('activesDetailProyectoProyecto').fill('proyecto');
    await page.getByTestId('activesDetailProyectoSubestacion').fill('3232323');
    await page.getByTestId('activesDetailProyectoCircuito').fill('43434ac');
    await page.getByLabel('Tipo energía').click({ force: true });
    await page.getByRole('option', { name: 'Diesel' }).click();
    await page.getByTestId('activesDetailProyectoContainer').getByText('Conductor').click();
    await page.getByRole('option', { name: 'Trenzado' }).click();
    await page.getByTestId('activesDetailProyectoNodoAnterior').fill('2as32312');
    await page.getByTestId('activesDetailProyectoNodoActual').fill('10052213232');


    //responsible and contracts

    await page.getByRole('button', { name: 'Responsable y contratos' }).click();
    await page.getByTestId('activesDetailResponsableUsuarioBien').fill('INSTITUTO DE LANIFICACION');
    await page.getByTestId('activesDetailResponsableNitCcUsuario').fill('89999904');
    await page.getByTestId('activesDetailResponsableMemorando').fill('Memorando');
    await page.getByTestId('activesDetailResponsableContratoIpse').fill('71541997');
    await page.getByTestId('activesDetailResponsableContratoCcg').fill('10291221');
    await page.getByTestId('activesDetailResponsableIdContratoAom').fill('11111111');
    await page.getByTestId('activesDetailResponsableNumeroContratoOperadorAom').fill('2222222');
    await page.getByTestId('activesDetailResponsableVigenciaContratoAom').fill('2022-01-01');





    await page.getByTestId('activesDetailResponsableFechaSuscripcionContratoAom')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();

    await editAsset.selectAvailableCalendarDate();


    await page.getByTestId('activesDetailResponsableNumeroContactoOperadorAom').fill('123456789');
    await page.getByTestId('activesDetailResponsableEmailOperadorAom').fill('correo@correo.com');
    await page.getByTestId('activesDetailResponsableNombreContactoOperador').fill('Operador');
    await page.getByTestId('activesDetailResponsableOperadorResponsable').fill('Operador');
    await page.getByTestId('activesDetailResponsableNumeroPolizasObra').fill('123456789');


    await page.getByTestId('activesDetailResponsableFechaInicialPolizasObra')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();


    await editAsset.selectAvailableCalendarDate();

    await page.getByTestId('activesDetailResponsableFechaFinalPolizasObra')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();

    await editAsset.selectAvailableCalendarDate();

    await page.getByTestId('activesDetailResponsableTipoPolizaObra').fill('123456789');
    await page.getByTestId('activesDetailResponsableObservacionEstado').fill('123456789');

    //EQUIPMENT AND APPRAISAL

    await page.getByRole('tab', { name: 'Equipo y avalúo' }).click();

    //Financial valuation
    await page.getByTestId('activesDetailValoracionValorUc').fill('2232');
    await page.getByTestId('activesDetailValoracionAvaluoRv').fill('2232');
    await page.getByTestId('activesDetailValoracionFuente').fill('123456789');

    await page.getByTestId('activesDetailValoracionFormaAdquisicion').click({ force: true });
    await page.getByRole('option', { name: 'Recursos Mixtos' }).click();

    await page.getByTestId('activesDetailValoracionEdadAgotada').fill('123456789');
    await page.getByTestId('activesDetailValoracionEdadTipo').fill('123456789');
    await page.getByTestId('activesDetailValoracionParticipacionPropiedadIpse').fill('123456789');
    await page.getByTestId('activesDetailValoracionVidaRemanente').fill('123456789');
    await page.getByTestId('activesDetailValoracionValorAsociadoAdquisicion').fill('123456789');
    await page.getByTestId('activesDetailValoracionValorAsociadoMantenimiento').fill('123456789');
    //Equipment features
    await page.getByRole('button', { name: 'Características del equipo' }).click();

    await page.getByTestId('activesDetailCaracteristicasMarca').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasCantidad').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasClase').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasSerie').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasCapacidadKvaKw').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasCapacidadKva').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasCapacidadKw').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasFuncionamiento').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasRetiradoMtto').fill('123456789');
    await page.getByText('Estado del equipo').click();
    await page.getByRole('option', { name: 'Malo' }).click();
    await page.getByTestId('activesDetailCaracteristicasEdadAparente').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasMunicipioLev').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasLocalidadLev').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasCodigoCregGeneral').fill('123456789');


    await page.getByTestId('activesDetailCaracteristicasFechaLevantamiento')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();

    await editAsset.selectAvailableCalendarDate();
    await page.getByTestId('activesDetailCaracteristicasPcbs').click();
    await page.getByRole('option', { name: 'No libre de PCB' }).click();
    await page.getByTestId('activesDetailCaracteristicasTipoAislamiento').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasTipoInstalacion').fill('123456789');
    await page.getByTestId('activesDetailCaracteristicasSistemaPuestaTierra').fill('123456789');

    //NETWORK AND STRUCTURES
    await page.getByRole('tab', { name: 'Red y estructuras' }).click();


    //Support and Structure

    await page.getByTestId('activesDetailApoyoAlturaApoyo').fill('123456789');
    await page.getByTestId('activesDetailApoyoDisposicionApoyo').fill('123456789');
    await page.getByTestId('activesDetailApoyoMaterialApoyo').fill('123456789');
    await page.getByTestId('activesDetailApoyoResistenciaApoyo').fill('123456789');
    await page.getByTestId('activesDetailApoyoFtoApoyo').fill('123456789');
    await page.getByText('Estado apoyo').click();
    await page.getByRole('option', { name: 'Regular' }).click();
    await page.getByTestId('activesDetailApoyoTipoEstructura').fill('123456789');
    await page.getByTestId('activesDetailApoyoFtoEstructura').fill('123456789');
    await page.getByText('Estado estructura').click();
    await page.getByRole('option', { name: 'Malo' }).click();
    //Driver and network
    await page.getByRole('button', { name: 'Conductor y red' }).click();

    await page.getByTestId('activesDetailConductorNroFases').fill('123456789');
    await page.getByTestId('activesDetailConductorCalibreConductor').fill('123456789');
    await page.getByTestId('activesDetailConductorMaterialConductor').fill('123456789');
    await page.getByTestId('activesDetailConductorCantCircuitos').fill('123456789');
    await page.getByTestId('activesDetailConductorFtoConductor').fill('123456789');
    await page.getByText('Estado conductor').click();
    await page.getByRole('option', { name: 'Regular' }).click();
    await page.getByTestId('activesDetailConductorCableGuardaKm').fill('12ada6789');
    await page.getByTestId('activesDetailConductorPuestaTierra').fill('123456789');
    await page.getByTestId('activesDetailConductorTempletes').fill('123456789');
    await page.getByTestId('activesDetailConductorCantConductorKm').fill('123456789');
    await page.getByTestId('activesDetailConductorLongitudCalcM').fill('123456789');
    await page.getByTestId('activesDetailConductorAtributosRed').fill('123456789');
    //Creg code and others
    await page.getByRole('button', { name: 'Código Creg y otros' }).click();

    await page.getByTestId('activesDetailCodigoAtributosApoyo').fill('123456789');
    await page.getByTestId('activesDetailCodigoCodigoCregConductor').fill('123456789');
    await page.getByTestId('activesDetailCodigoCodigoCregApoyo').fill('123456789');
    await page.getByTestId('activesDetailCodigoCodigoCregCableGuarda').fill('123456789');
    await page.getByTestId('activesDetailCodigoCodigoCregPuestaTierra').fill('123456789');
    await page.getByTestId('activesDetailCodigoCodigoCregFibraOptica').fill('123456789');
    await page.getByTestId('activesDetailCodigoTipoPolizasContratoAOM').fill('123456789');
    await page.getByTestId('activesDetailCodigoValorCregApoyo').fill('123456789');
    await page.getByTestId('activesDetailCodigoValorCregConductor').fill('123456789');


    await page.getByTestId('activesDetailCodigoFechaFinalPolizasAom')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();

    await editAsset.selectAvailableCalendarDate();

    await page.getByTestId('activesDetailCodigoNumeroPolizasAom').fill('123456789');


    await page.getByTestId('activesDetailCodigoFechaInicialPolizasAom')
        .locator('xpath=ancestor::bds-datepicker')
        .getByRole('button', { name: 'Open calendar' })
        .click();
    await editAsset.selectAvailableCalendarDate();

    //btns
    
    await saveBtn.click();
    await expect(page.getByText('Cambios guardados correctamente')).toBeVisible();



});
