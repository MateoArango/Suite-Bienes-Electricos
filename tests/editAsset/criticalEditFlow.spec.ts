import { Locator } from '@playwright/test';
import { test, expect } from './fixtures';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';

/* This test checks that most comparable API values are reflected in the edit UI.
It is intentionally tolerant because legacy asset data can be null, incomplete,
typed inconsistently, or formatted differently once rendered in form controls.
The goal is data-binding regression coverage, not a strict database-quality audit. 

Edit plates used in this test are known to be editable and have a variety of field values:
- 00000196 
- 00000198 
- 00000077 
- 0000132198 
- 0000241198 
- 0000247649
*/

const PLATE = '0000247649'; 
const uiValue = (value: unknown) => value == null ? '' : String(value);
const isDateValue = (value: unknown) => typeof value === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value);
const normalizedDate = (value: string) => value.split('/').map((part, index) => index < 2 ? String(Number(part)) : part).join('/');
const hasComparableValue = (value: unknown) => value !== null && value !== undefined && value !== '';

const normalizedNumericValue = (value: string, expected: number) => {
  const numericText = value.replace(/[^\d,.-]/g, '');

  if (numericText.includes(',')) {
    return Number(numericText.replace(/\./g, '').replace(',', '.'));
  }

  return Number(Number.isInteger(expected) ? numericText.replace(/\./g, '') : numericText);
};

async function expectInputValue(locator: Locator, value: unknown) {
  if (!hasComparableValue(value)) {
    return;
  }

  if (typeof value === 'number') {
    const actualValue = await locator.inputValue();
    expect(normalizedNumericValue(actualValue, value)).toBeCloseTo(value);
    return;
  }

  if (isDateValue(value)) {
    const actualValue = await locator.inputValue();
    expect(normalizedDate(actualValue)).toBe(normalizedDate(value));
    return;
  }

  await expect(locator).toHaveValue(uiValue(value));
}

async function expectVisibleText(locator: Locator, value: unknown) {
  if (!hasComparableValue(value)) {
    return;
  }

  await expect(locator).toContainText(String(value));
}

test('QA-EDIT-001: prepopulated fields match API source', async ({ page, apiContext, authToken }) => {
  const basePage = new BasePage(page);
  const editAsset = new EditAssetPage(page);

  // 1. Get source-of-truth data directly from the API
  const response = await apiContext.get(
    `/electrical-assets/article-resume/${PLATE}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  expect(response.ok(), `API call failed for plate ${PLATE}`).toBeTruthy();
  const asset = await response.json();
  console.log('Article resume API response:', JSON.stringify(asset, null, 2));
  const ubicacion = asset.ubicacionYRegistro;
  const proyecto = asset.proyectoYGestion;
  const equipo = asset.equipoYAvaluo;
  const red = asset.redYEstructura;

  // 2. Open the edit form in the UI
  await basePage.login('qa', '123456');
  await expect(page).toHaveURL(/dashboard/);
  await editAsset.goto(PLATE);

  // 3. Cross-check each accordion field against the API response
  // Catalog/select fields are skipped here because API values can be legacy values
  // that do not map to editable dropdown options.
  await expectVisibleText(editAsset.departamentoField, ubicacion.nombreDepartamento ?? ubicacion.departamento);
  await expectVisibleText(editAsset.municipioField, ubicacion.nombreMunicipio ?? ubicacion.municipio);
  await expectInputValue(editAsset.latitudField, ubicacion.latitud);
  await expectInputValue(editAsset.longitudField, ubicacion.longitud);
  await expectInputValue(editAsset.veredaField, ubicacion.vereda);
  await expectInputValue(editAsset.localidadField, ubicacion.localidad);

  await page.getByRole('button', { name: /Registro Enlaces y/ }).click();
  await expectInputValue(editAsset.enlaceFotosField, ubicacion.enlaceFotos);
  await expectInputValue(editAsset.enlaceArcgisField, ubicacion.enlaceArcgis);
  await expectInputValue(editAsset.carpetaAltitudField, ubicacion.carpetaAltitud);
  await expectInputValue(editAsset.nombrePlantillaField, ubicacion.nombrePlantilla);
  await expectInputValue(editAsset.ubicacionDescripcionField, ubicacion.descripcion);

  await page.getByRole('tab', { name: /Proyecto y gesti.n/ }).click();
  await expectInputValue(editAsset.proyectoField, proyecto.proyecto);
  await expectInputValue(editAsset.subestacionField, proyecto.subestacion);
  await expectInputValue(editAsset.circuitoField, proyecto.circuito);
  await expectInputValue(editAsset.nodoAnteriorField, proyecto.nodoAnterior);
  await expectInputValue(editAsset.nodoActualField, proyecto.nodoActual);

  await page.getByRole('button', { name: /Responsable y contratos/ }).click();
  await expectInputValue(editAsset.usuarioBienField, proyecto.usuarioBien);
  await expectInputValue(editAsset.nitCcUsuarioField, proyecto.nitCcUsuario);
  await expectInputValue(editAsset.memorandoField, proyecto.memorando);
  await expectInputValue(editAsset.contratoIpseField, proyecto.contratoIpse);
  await expectInputValue(editAsset.contratoCcgField, proyecto.contratoCcg);
  await expectInputValue(editAsset.idContratoAomField, proyecto.idContratoAom);
  await expectInputValue(editAsset.numeroContratoOperadorAomField, proyecto.numeroContratoOperadorAom);
  await expectInputValue(editAsset.vigenciaContratoAomField, proyecto.vigenciaContratoAom);
  await expectInputValue(editAsset.fechaSuscripcionContratoAomField, proyecto.fechaSuscripcionContratoAom);
  await expectInputValue(editAsset.numeroContactoOperadorAomField, proyecto.numeroContactoOperadorAom);
  await expectInputValue(editAsset.emailOperadorAomField, proyecto.emailOperadorAom);
  await expectInputValue(editAsset.nombreContactoOperadorField, proyecto.nombreContactoOperador);
  await expectInputValue(editAsset.operadorResponsableField, proyecto.operadorResponsable);
  await expectInputValue(editAsset.numeroPolizasObraField, proyecto.numeroPolizasObra);
  await expectInputValue(editAsset.fechaInicialPolizasObraField, proyecto.fechaInicialPolizasObra);
  await expectInputValue(editAsset.fechaFinalPolizasObraField, proyecto.fechaFinalPolizasObra);
  await expectInputValue(editAsset.tipoPolizaObraField, proyecto.tipoPolizaObra);
  await expectInputValue(editAsset.observacionEstadoField, proyecto.observacionEstado);

  await page.getByRole('tab', { name: /Equipo y aval.o/ }).click();
  await expectInputValue(editAsset.valorUcField, equipo.valorUc);
  await expectInputValue(editAsset.avaluoRvField, equipo.avaluoRv);
  await expectInputValue(editAsset.fuenteField, equipo.fuente);
  await expectInputValue(editAsset.edadAgotadaField, equipo.edadAgotada);
  await expectInputValue(editAsset.edadTipoField, equipo.edadTipo);
  await expectInputValue(editAsset.participacionPropiedadIpseField, equipo.participacionPropiedadIpse);
  await expectInputValue(editAsset.vidaRemanenteField, equipo.vidaRemanente);
  await expectInputValue(editAsset.valorAsociadoAdquisicionField, equipo.valorAsociadoAdquisicion);
  await expectInputValue(editAsset.valorAsociadoMantenimientoField, equipo.valorAsociadoMantenimiento);

  await page.getByRole('button', { name: /Caracter.sticas del equipo/ }).click();
  await expectInputValue(editAsset.marcaField, equipo.marca);
  await expectInputValue(editAsset.cantidadField, equipo.cantidad);
  await expectInputValue(editAsset.claseField, equipo.clase);
  await expectInputValue(editAsset.serieField, equipo.serie);
  await expectInputValue(editAsset.capacidadKvaKwField, equipo.capacidadKvaKw);
  await expectInputValue(editAsset.capacidadKvaField, equipo.capacidadKva);
  await expectInputValue(editAsset.capacidadKwField, equipo.capacidadKw);
  await expectInputValue(editAsset.funcionamientoField, equipo.funcionamiento);
  await expectInputValue(editAsset.retiradoMttoField, equipo.retiradoMtto);
  await expectInputValue(editAsset.edadAparenteField, equipo.edadAparente);
  await expectInputValue(editAsset.municipioLevField, equipo.municipioLev);
  await expectInputValue(editAsset.localidadLevField, equipo.localidadLev);
  await expectInputValue(editAsset.codigoCregGeneralField, equipo.codigoCregGeneral);
  await expectInputValue(editAsset.fechaLevantamientoField, equipo.fechaLevantamiento);
  await expectInputValue(editAsset.tipoAislamientoField, equipo.tipoAislamiento);
  await expectInputValue(editAsset.tipoInstalacionField, equipo.tipoInstalacion);
  await expectInputValue(editAsset.sistemaPuestaTierraField, equipo.sistemaPuestaTierra);

  await page.getByRole('tab', { name: /Red y estructuras/ }).click();
  await expectInputValue(editAsset.alturaApoyoField, red.alturaApoyo);
  await expectInputValue(editAsset.disposicionApoyoField, red.disposicionApoyo);
  await expectInputValue(editAsset.materialApoyoField, red.materialApoyo);
  await expectInputValue(editAsset.resistenciaApoyoField, red.resistenciaApoyo);
  await expectInputValue(editAsset.ftoApoyoField, red.ftoApoyo);
  await expectInputValue(editAsset.tipoEstructuraField, red.tipoEstructura);
  await expectInputValue(editAsset.ftoEstructuraField, red.ftoEstructura);

  await page.getByRole('button', { name: /Conductor y red/ }).click();
  await expectInputValue(editAsset.nroFasesField, red.nroFases);
  await expectInputValue(editAsset.calibreConductorField, red.calibreConductor);
  await expectInputValue(editAsset.materialConductorField, red.materialConductor);
  await expectInputValue(editAsset.cantCircuitosField, red.cantCircuitos);
  await expectInputValue(editAsset.ftoConductorField, red.ftoConductor);
  await expectInputValue(editAsset.cableGuardaKmField, red.cableGuardaKm);
  await expectInputValue(editAsset.puestaTierraField, red.puestaTierra);
  await expectInputValue(editAsset.templetesField, red.templetes);
  await expectInputValue(editAsset.cantConductorKmField, red.cantConductorKm);
  await expectInputValue(editAsset.longitudCalcMField, red.longitudCalcM);
  await expectInputValue(editAsset.atributosRedField, red.atributosRed);

  await page.getByRole('button', { name: 'Código Creg y otros' }).click();
  await expectInputValue(editAsset.atributosApoyoField, red.atributosApoyo);
  await expectInputValue(editAsset.codigoCregConductorField, red.codigoCregConductor);
  await expectInputValue(editAsset.codigoCregApoyoField, red.codigoCregApoyo);
  await expectInputValue(editAsset.codigoCregCableGuardaField, red.codigoCregCableGuarda);
  await expectInputValue(editAsset.codigoCregPuestaTierraField, red.codigoCregPuestaTierra);
  await expectInputValue(editAsset.codigoCregFibraOpticaField, red.codigoCregFibraOptica);
  await expectInputValue(editAsset.tipoPolizasContratoAomField, red.tipoPolizasContratoAOM);
  await expectInputValue(editAsset.valorCregApoyoField, red.valorCregApoyo);
  await expectInputValue(editAsset.valorCregConductorField, red.valorCregConductor);
  await expectInputValue(editAsset.fechaFinalPolizasAomField, red.fechaFinalPolizasContratosDeAom);
  await expectInputValue(editAsset.numeroPolizasAomField, red.numeroPolizasAom);
  await expectInputValue(editAsset.fechaInicialPolizasAomField, red.fechaInicialPolizasAom);
});
