import { test, expect } from '../fixtures';
import path from 'path';
import * as XLSX from 'xlsx';
import { BasePage } from '../pages/BasePage';
import { EditAssetPage } from '../pages/editAssetPage';
import { ImportAssetPage } from '../pages/ImportAssetPage';

/*
 * Full import validation:
 * uploads the Excel fixture, opens the imported plate detail, captures the
 * article-resume API response, and compares the 102 Excel fields against API data.
 */
const PLATE = '00000381';
const EXCEL_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'fullPath.xlsx');
const SHEET_NAME = 'Plantilla';

type ExcelRow = Record<string, unknown>;
type FieldMapping = {
    excelHeader: string;
    apiPath: string;
};

const fieldMappings: FieldMapping[] = [
    { excelHeader: 'ARTICULO', apiPath: 'codigoExterno' },
    { excelHeader: 'N° PLACA', apiPath: 'placa' },
    { excelHeader: 'FOTOS (enlace)', apiPath: 'ubicacionYRegistro.enlaceFotos' },
    { excelHeader: 'PLANILLA (ARCGIS)', apiPath: 'ubicacionYRegistro.enlaceArcgis' },
    { excelHeader: 'DEPARTAMENTO', apiPath: 'ubicacionYRegistro.departamento' },
    { excelHeader: 'MUNICIPIO', apiPath: 'ubicacionYRegistro.municipio' },
    { excelHeader: 'LOCALIDAD', apiPath: 'ubicacionYRegistro.localidad' },
    { excelHeader: 'VEREDA', apiPath: 'ubicacionYRegistro.vereda' },
    { excelHeader: 'DOCUMENTO MEMORANDO SOLICITUD DE INGRESO', apiPath: 'proyectoYGestion.memorando' },
    { excelHeader: 'CONTRATO IPSE', apiPath: 'proyectoYGestion.contratoIpse' },
    { excelHeader: 'CONTRATO CCG/FAZNI', apiPath: 'proyectoYGestion.contratoCcg' },
    { excelHeader: 'USUARIO DEL BIEN', apiPath: 'proyectoYGestion.usuarioBien' },
    { excelHeader: 'NIT/C.C. USUARIO', apiPath: 'proyectoYGestion.nitCcUsuario' },
    { excelHeader: 'PROYECTO', apiPath: 'proyectoYGestion.proyecto' },
    { excelHeader: 'S_E', apiPath: 'proyectoYGestion.subestacion' },
    { excelHeader: 'CIRCUITO', apiPath: 'proyectoYGestion.circuito' },
    { excelHeader: 'URBANO-RURAL APLICA PARA REDES DE DISTRIBUCION', apiPath: 'ubicacionYRegistro.tipoZona' },
    { excelHeader: 'ALTITUD_COORD (ENLACE CARPETA', apiPath: 'ubicacionYRegistro.carpetaAltitud' },
    { excelHeader: 'CONDUCTOR_TRENZADO', apiPath: 'proyectoYGestion.tipoConductor' },
    { excelHeader: 'NODO ANTERIOR', apiPath: 'proyectoYGestion.nodoAnterior' },
    { excelHeader: 'NODO ACTUAL', apiPath: 'proyectoYGestion.nodoActual' },
    { excelHeader: 'DESCRIPCION CONCATENADA', apiPath: 'ubicacionYRegistro.descripcion' },
    { excelHeader: 'LATITUD_COORD', apiPath: 'ubicacionYRegistro.latitud' },
    { excelHeader: 'LONGITUD_COORD', apiPath: 'ubicacionYRegistro.longitud' },
    { excelHeader: 'TIPO', apiPath: 'proyectoYGestion.tipoEnergia' },
    { excelHeader: 'COD_LOCALIZACION_DANE', apiPath: 'ubicacionYRegistro.codigoDane' },
    { excelHeader: 'NOMBRE_PLANILLA', apiPath: 'ubicacionYRegistro.nombrePlantilla' },
    { excelHeader: 'CONTRATO A.O.M', apiPath: 'proyectoYGestion.idContratoAom' },
    { excelHeader: 'OPERADOR A.O.M', apiPath: 'proyectoYGestion.numeroContratoOperadorAom' },
    { excelHeader: 'N°_POLIZAS_CONTRATOS_DE_OBRA', apiPath: 'proyectoYGestion.numeroPolizasObra' },
    { excelHeader: 'FECHA_INICIAL_POLIZAS_CONTRATO_DE_OBRA', apiPath: 'proyectoYGestion.fechaInicialPolizasObra' },
    { excelHeader: 'OBSERVACION_ESTADO', apiPath: 'proyectoYGestion.observacionEstado' },
    { excelHeader: 'FECHA_FINAL_POLIZAS_CONTRATOS_DE_OBRA', apiPath: 'proyectoYGestion.fechaFinalPolizasObra' },
    { excelHeader: 'TIPO_DE_POLIZAS_CONTRATOS_DE_OBRA', apiPath: 'proyectoYGestion.tipoPolizaObra' },
    { excelHeader: 'EDAD_TIPO_VIDA_UTIL', apiPath: 'equipoYAvaluo.edadTipo' },
    { excelHeader: 'EDAD_AGOTADA', apiPath: 'equipoYAvaluo.edadAgotada' },
    { excelHeader: 'VIDA_REMANENTE', apiPath: 'equipoYAvaluo.vidaRemanente' },
    { excelHeader: 'UC_VALOR_T', apiPath: 'equipoYAvaluo.valorUc' },
    { excelHeader: 'AVALUO_RV', apiPath: 'equipoYAvaluo.avaluoRv' },
    { excelHeader: 'FUENTE', apiPath: 'equipoYAvaluo.fuente' },
    { excelHeader: 'FORMA DE ADQUISICION Y ORIGEN DE LOS RECURSOS', apiPath: 'equipoYAvaluo.formaAdquisicion' },
    { excelHeader: 'PARTICIPACION DE PROPIEDAD DEL IPSE', apiPath: 'equipoYAvaluo.participacionPropiedadIpse' },
    { excelHeader: 'VALOR ASOCIADO A SU ADQUISICION', apiPath: 'equipoYAvaluo.valorAsociadoAdquisicion' },
    { excelHeader: 'VALOR ASOCIADO A SU MANTENIMIENTO', apiPath: 'equipoYAvaluo.valorAsociadoMantenimiento' },
    { excelHeader: 'MARCA', apiPath: 'equipoYAvaluo.marca' },
    { excelHeader: 'CANTIDAD', apiPath: 'equipoYAvaluo.cantidad' },
    { excelHeader: 'CLASE', apiPath: 'equipoYAvaluo.clase' },
    { excelHeader: 'SERIE', apiPath: 'equipoYAvaluo.serie' },
    { excelHeader: 'CAPACIDAD(KVA)/(KW)', apiPath: 'equipoYAvaluo.capacidadKvaKw' },
    { excelHeader: 'FUNCIONAMIENTO EQUIPO', apiPath: 'equipoYAvaluo.funcionamiento' },
    { excelHeader: 'RETIRADO_MTTO', apiPath: 'equipoYAvaluo.retiradoMtto' },
    { excelHeader: 'ESTADO EQUIPO', apiPath: 'equipoYAvaluo.estadoEquipo' },
    { excelHeader: 'MUNICIPIO_LEV', apiPath: 'equipoYAvaluo.municipioLev' },
    { excelHeader: 'LOCALIDAD_LEV', apiPath: 'equipoYAvaluo.localidadLev' },
    { excelHeader: 'CODIGO_CREG', apiPath: 'equipoYAvaluo.codigoCregGeneral' },
    { excelHeader: 'Fecha levantamiento', apiPath: 'equipoYAvaluo.fechaLevantamiento' },
    { excelHeader: 'PCBs', apiPath: 'equipoYAvaluo.pcbs' },
    { excelHeader: 'TIPO DE AISLAMIENTO', apiPath: 'equipoYAvaluo.tipoAislamiento' },
    { excelHeader: 'TIPO DE INSTALACIÓN', apiPath: 'equipoYAvaluo.tipoInstalacion' },
    { excelHeader: 'EXISTE SISTEMA DE PUESTA A TIERRA', apiPath: 'equipoYAvaluo.sistemaPuestaTierra' },
    { excelHeader: 'CAPACIDAD (KVA)', apiPath: 'equipoYAvaluo.capacidadKva' },
    { excelHeader: 'CAPACIDAD (KW)', apiPath: 'equipoYAvaluo.capacidadKw' },
    { excelHeader: 'LONGITUD CALCULADA', apiPath: 'redYEstructura.longitudCalcM' },
    { excelHeader: 'ALTURA (m) APOYO', apiPath: 'redYEstructura.alturaApoyo' },
    { excelHeader: 'DISPOSICION DEL APOYO', apiPath: 'redYEstructura.disposicionApoyo' },
    { excelHeader: 'TIPO MATERIAL APOYO', apiPath: 'redYEstructura.materialApoyo' },
    { excelHeader: 'RESISTENCIA MECANICA APOYO', apiPath: 'redYEstructura.resistenciaApoyo' },
    { excelHeader: 'FTO APOYO OPERATIVO / IMPRODUCTIVO', apiPath: 'redYEstructura.ftoApoyo' },
    { excelHeader: 'ESTADO APOYO', apiPath: 'redYEstructura.estadoApoyo' },
    { excelHeader: 'TIPO ESTRUCTURA: SUSPENSION/RETENCION', apiPath: 'redYEstructura.tipoEstructura' },
    { excelHeader: 'FTO ESTRUCTURA OPERATIVO / IMPRODUCTIVO', apiPath: 'redYEstructura.ftoEstructura' },
    { excelHeader: 'ESTADO ESTRUCTURA B / M', apiPath: 'redYEstructura.estadoEstructura' },
    { excelHeader: 'No DE FASES', apiPath: 'redYEstructura.nroFases' },
    { excelHeader: 'CALIBRE CONDUCTOR', apiPath: 'redYEstructura.calibreConductor' },
    { excelHeader: 'TIPO MATERIAL CONDUCTOR', apiPath: 'redYEstructura.materialConductor' },
    { excelHeader: 'CANTIDAD DE CIRCUITOS', apiPath: 'redYEstructura.cantCircuitos' },
    { excelHeader: 'FTO CONDUCTOR OPERATIVO /', apiPath: 'redYEstructura.ftoConductor' },
    { excelHeader: 'ESTADO CONDUCTOR BUENO / MALO', apiPath: 'redYEstructura.estadoConductor' },
    { excelHeader: 'EDAD APARENTE (AÑOS)', apiPath: 'equipoYAvaluo.edadAparente' },
    { excelHeader: 'CABLE GUARDA (M)', apiPath: 'redYEstructura.cableGuardaKm' },
    { excelHeader: 'PUESTA TIERRA', apiPath: 'redYEstructura.puestaTierra' },
    { excelHeader: 'TEMPLETES', apiPath: 'redYEstructura.templetes' },
    { excelHeader: 'CANTIDAD CONDUCTOR (KM)', apiPath: 'redYEstructura.cantConductorKm' },
    { excelHeader: 'CODIGO CREG APOYO', apiPath: 'redYEstructura.codigoCregApoyo' },
    { excelHeader: 'FECHA_FINAL_POLIZAS_CONTRATOS_DE_AOM', apiPath: 'redYEstructura.fechaFinalPolizasContratosDeAom' },
    { excelHeader: 'CODIGO CREG CABLE GUARDA', apiPath: 'redYEstructura.codigoCregCableGuarda' },
    { excelHeader: 'CODIGO CREG PUESTA TIERRA', apiPath: 'redYEstructura.codigoCregPuestaTierra' },
    { excelHeader: 'CODIGO CREG FIBRA OPTICA', apiPath: 'redYEstructura.codigoCregFibraOptica' },
    { excelHeader: 'ATRIBUTOS APOYO', apiPath: 'redYEstructura.atributosApoyo' },
    { excelHeader: 'VALOR CREG APOYO', apiPath: 'redYEstructura.valorCregApoyo' },
    { excelHeader: 'ATRIBUTOS RED', apiPath: 'redYEstructura.atributosRed' },
    { excelHeader: 'VALOR CREG CONDUCTOR', apiPath: 'redYEstructura.valorCregConductor' },
    { excelHeader: 'N°_POLIZAS_CONTRATOS_DE_AOM', apiPath: 'redYEstructura.numeroPolizasAom' },
    { excelHeader: 'FECHA_INICIAL_POLIZAS_CONTRATO_AOM', apiPath: 'redYEstructura.fechaInicialPolizasAom' },
    { excelHeader: 'TIPO_DE_POLIZAS_CONTRATOS_DE_AOM', apiPath: 'redYEstructura.tipoPolizasContratoAOM' },
    { excelHeader: 'EMAIL_OPERADOR_AOM', apiPath: 'proyectoYGestion.emailOperadorAom' },
    { excelHeader: 'NO_CONTACTO_OPERADOR_AOM', apiPath: 'proyectoYGestion.numeroContactoOperadorAom' },
    { excelHeader: 'NOMBRE_CONTACTO_OPERADOR', apiPath: 'proyectoYGestion.nombreContactoOperador' },
    { excelHeader: 'OPERADOR_RESPONSABLE', apiPath: 'proyectoYGestion.operadorResponsable' },
    { excelHeader: 'FECHA_SUSCRIPCION_CONTRATO_AOM', apiPath: 'proyectoYGestion.fechaSuscripcionContratoAom' },
    { excelHeader: 'VIGENCIA_DEL_CONTRATO_AOM', apiPath: 'proyectoYGestion.vigenciaContratoAom' },
    { excelHeader: 'CODIGO CREG CONDUCTOR', apiPath: 'redYEstructura.codigoCregConductor' },
];

function readExcelRowByPlate(filePath: string, plate: string): ExcelRow {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[SHEET_NAME];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: false });
    const headers = rows[0].map((header) => String(header));
    const plateIndex = headers.findIndex((header) => normalizeHeader(header) === normalizeHeader('N° PLACA'));
    const dataRow = rows.slice(1).find((row) => normalizeValue(row[plateIndex]) === plate);

    if (!dataRow) {
        throw new Error(`Plate ${plate} was not found in ${filePath}`);
    }

    return headers.reduce<ExcelRow>((row, header, index) => {
        row[header] = dataRow[index];
        return row;
    }, {});
}

function getByPath(source: unknown, apiPath: string): unknown {
    return apiPath.split('.').reduce<unknown>((value, key) => {
        if (value && typeof value === 'object' && key in value) {
            return (value as Record<string, unknown>)[key];
        }

        return undefined;
    }, source);
}

function normalizeValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    const textValue = String(value).trim();
    const dateMatch = textValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);

    if (dateMatch) {
        const [, firstPart, secondPart, year] = dateMatch;
        const fullYear = year.length === 2 ? `20${year}` : year;
        const firstNumber = Number(firstPart);
        const secondNumber = Number(secondPart);
        const day = firstNumber > 12 ? firstPart : secondNumber > 12 ? secondPart : firstPart;
        const month = firstNumber > 12 ? secondPart : secondNumber > 12 ? firstPart : secondPart;

        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
    }

    if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(textValue) && !/^0\d+$/.test(textValue)) {
        return String(Number(textValue));
    }

    return textValue;
}

function normalizeComparisonValue(excelHeader: string, value: unknown): string {
    if (['DEPARTAMENTO', 'MUNICIPIO'].includes(excelHeader)) {
        return value === null || value === undefined || value === '' ? '' : String(Number(value));
    }

    if ([
        'CAPACIDAD (KVA)',
        'CAPACIDAD (KW)',
        'LONGITUD CALCULADA',
        'ALTURA (m) APOYO',
        'CALIBRE CONDUCTOR',
    ].includes(excelHeader)) {
        return value === null || value === undefined || value === '' ? '' : String(Math.trunc(Number(value)));
    }

    return normalizeValue(value);
}

function normalizeHeader(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
}

function getExcelValue(excelRow: ExcelRow, excelHeader: string): unknown {
    const matchingHeader = Object.keys(excelRow).find((header) => normalizeHeader(header) === normalizeHeader(excelHeader));

    return matchingHeader ? excelRow[matchingHeader] : undefined;
}

function compareExcelRowToApi(excelRow: ExcelRow, asset: unknown) {
    return fieldMappings
        .map(({ excelHeader, apiPath }) => {
            const excelValue = normalizeComparisonValue(excelHeader, getExcelValue(excelRow, excelHeader));
            const apiValue = normalizeComparisonValue(excelHeader, getByPath(asset, apiPath));

            return {
                excelHeader,
                apiPath,
                excelValue,
                apiValue,
                matches: excelValue === apiValue,
            };
        })
        .filter((comparison) => !comparison.matches);
}

test('Full Path - Import Active', async ({ page }) => {
    const basePage = new BasePage(page);
    const editAssetPage = new EditAssetPage(page);
    const importAssetPage = new ImportAssetPage(page);

    await basePage.login('qa', '123456');

    await importAssetPage.importButton.click();
    await importAssetPage.downloadTemplateButton.click();

    await page.setInputFiles('input[type="file"]', EXCEL_FILE);

    await importAssetPage.submitButton.click();
    await expect(importAssetPage.successMessage).toBeVisible();

    expect(fieldMappings).toHaveLength(102);

    const excelRow = readExcelRowByPlate(EXCEL_FILE, PLATE);
    const responsePromise = page.waitForResponse((response) =>
        response.url().includes(`/electrical-assets/article-resume/${PLATE}`) &&
        response.request().method() === 'GET'
    );

    await editAssetPage.goto(PLATE);

    const response = await responsePromise;
    expect(response.ok(), `API call failed for plate ${PLATE}`).toBeTruthy();
    const asset = await response.json();
    const mismatches = compareExcelRowToApi(excelRow, asset);
    // Expect the mismatches list to be empty.
    expect(mismatches, JSON.stringify(mismatches, null, 2)).toEqual([]);
});
