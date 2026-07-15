import { test, expect } from '../fixtures';
import path from 'path';
import fs from 'fs/promises';
import * as XLSX from 'xlsx';
import { BasePage } from '../pages/BasePage';
import { ImportAssetPage } from '../pages/ImportAssetPage';

const SHEET_NAME = 'Plantilla';
const DOWNLOAD_DIR = path.join(process.cwd(), 'tmp', 'downloads');
const TEMPLATE_FILE = path.join(DOWNLOAD_DIR, 'import-template.xlsx');
const INVALID_TEXT_FILE = path.join(DOWNLOAD_DIR, 'invalid-import.txt');
const OVER_SIZE_TEMPLATE_FILE = path.join(DOWNLOAD_DIR, '32Mil-plantilla.xlsx');
const INVALID_TEMPLATE_FILE = path.join(DOWNLOAD_DIR, '16Mil-plantilla.xlsx');
const EMPTY_TEMPLATE_FILE = path.join(process.cwd(), 'fixtures', 'importFixtures', 'empty.xlsx');
const INVALID_FORMAT_MESSAGE = 'Formato no permitido (.txt). Solo se aceptan archivos Excel (.xlsx, .xls).';
const MAX_SIZE_MESSAGE = 'El archivo seleccionado supera el tamaño máximo permitido de 10 MB. Por favor, cargue un archivo más pequeño.';
const FILE_ERRORS_MESSAGE = 'Se encontraron errores en el archivo';
const EMPTY_FILE_MESSAGE = 'El archivo no contiene datos';

const expectedHeaders = [
    'ARTICULO',
    'N\u00b0 PLACA',
    'FOTOS (enlace)',
    'PLANILLA (ARCGIS)',
    'DEPARTAMENTO',
    'MUNICIPIO',
    'LOCALIDAD',
    'VEREDA',
    'DOCUMENTO MEMORANDO SOLICITUD DE INGRESO',
    'CONTRATO IPSE',
    'CONTRATO CCG/FAZNI',
    'USUARIO DEL BIEN',
    'NIT/C.C. USUARIO',
    'PROYECTO',
    'S_E',
    'CIRCUITO',
    'URBANO-RURAL APLICA PARA REDES DE DISTRIBUCION',
    'ALTITUD_COORD (ENLACE CARPETA',
    'CONDUCTOR_TRENZADO',
    'NODO ANTERIOR',
    'NODO ACTUAL',
    'DESCRIPCION CONCATENADA',
    'LATITUD_COORD',
    'LONGITUD_COORD',
    'TIPO',
    'COD_LOCALIZACION_DANE',
    'NOMBRE_PLANILLA',
    'CONTRATO A.O.M',
    'OPERADOR A.O.M',
    'N\u00b0_POLIZAS_CONTRATOS_DE_OBRA',
    'FECHA_INICIAL_POLIZAS_CONTRATO_DE_OBRA',
    'OBSERVACION_ESTADO',
    'FECHA_FINAL_POLIZAS_CONTRATOS_DE_OBRA',
    'TIPO_DE_POLIZAS_CONTRATOS_DE_OBRA',
    'EDAD_TIPO_VIDA_UTIL',
    'EDAD_AGOTADA',
    'VIDA_REMANENTE',
    'UC_VALOR_T',
    'AVALUO_RV',
    'FUENTE',
    'FORMA DE ADQUISICION Y ORIGEN DE LOS RECURSOS',
    'PARTICIPACION DE PROPIEDAD DEL IPSE',
    'VALOR ASOCIADO A SU ADQUISICION',
    'VALOR ASOCIADO A SU MANTENIMIENTO',
    'MARCA',
    'CANTIDAD',
    'CLASE',
    'SERIE',
    'CAPACIDAD(KVA)/(KW)',
    'FUNCIONAMIENTO EQUIPO',
    'RETIRADO_MTTO',
    'ESTADO EQUIPO',
    'MUNICIPIO_LEV',
    'LOCALIDAD_LEV',
    'CODIGO_CREG',
    'Fecha levantamiento',
    'PCBs',
    'TIPO DE AISLAMIENTO',
    'TIPO DE INSTALACI\u00d3N',
    'EXISTE SISTEMA DE PUESTA A TIERRA',
    'CAPACIDAD (KVA)',
    'CAPACIDAD (KW)',
    'LONGITUD CALCULADA',
    'ALTURA (m) APOYO',
    'DISPOSICION DEL APOYO',
    'TIPO MATERIAL APOYO',
    'RESISTENCIA MECANICA APOYO',
    'FTO APOYO OPERATIVO / IMPRODUCTIVO',
    'ESTADO APOYO',
    'TIPO ESTRUCTURA: SUSPENSION/RETENCION',
    'FTO ESTRUCTURA OPERATIVO / IMPRODUCTIVO',
    'ESTADO ESTRUCTURA B / M',
    'No DE FASES',
    'CALIBRE CONDUCTOR',
    'TIPO MATERIAL CONDUCTOR',
    'CANTIDAD DE CIRCUITOS',
    'FTO CONDUCTOR OPERATIVO /',
    'ESTADO CONDUCTOR BUENO / MALO',
    'EDAD APARENTE (A\u00d1OS)',
    'CABLE GUARDA (M)',
    'PUESTA TIERRA',
    'TEMPLETES',
    'CANTIDAD CONDUCTOR (KM)',
    'CODIGO CREG APOYO',
    'FECHA_FINAL_POLIZAS_CONTRATOS_DE_AOM',
    'CODIGO CREG CABLE GUARDA',
    'CODIGO CREG PUESTA TIERRA',
    'CODIGO CREG FIBRA OPTICA',
    'ATRIBUTOS APOYO',
    'VALOR CREG APOYO',
    'ATRIBUTOS RED',
    'VALOR CREG CONDUCTOR',
    'N\u00b0_POLIZAS_CONTRATOS_DE_AOM',
    'FECHA_INICIAL_POLIZAS_CONTRATO_AOM',
    'TIPO_DE_POLIZAS_CONTRATOS_DE_AOM',
    'EMAIL_OPERADOR_AOM',
    'NO_CONTACTO_OPERADOR_AOM',
    'NOMBRE_CONTACTO_OPERADOR',
    'OPERADOR_RESPONSABLE',
    'FECHA_SUSCRIPCION_CONTRATO_AOM',
    'VIGENCIA_DEL_CONTRATO_AOM',
    'CODIGO CREG CONDUCTOR',
];

function readTemplateHeaders(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[SHEET_NAME];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: false });

    return rows[0].map((header) => String(header));
}

test('Import template has expected headers', async ({ page }) => {
    const basePage = new BasePage(page);
    const importAssetPage = new ImportAssetPage(page);

    await basePage.login('qa', '123456');
    await importAssetPage.importButton.click();

    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

    const downloadPromise = page.waitForEvent('download');
    await importAssetPage.downloadTemplateButton.click();
    const download = await downloadPromise;
    await download.saveAs(TEMPLATE_FILE);

    const headers = readTemplateHeaders(TEMPLATE_FILE);

    expect(headers).toHaveLength(102);
    expect(headers).toEqual(expectedHeaders);
});

test('Import rejects non Excel files', async ({ page }) => {
    const basePage = new BasePage(page);
    const importAssetPage = new ImportAssetPage(page);

    await basePage.login('qa', '123456');
    await importAssetPage.importButton.click();

    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });
    await fs.writeFile(INVALID_TEXT_FILE, 'not an excel file');

    await page.setInputFiles('input[type="file"]', INVALID_TEXT_FILE);

    await expect(page.getByText(INVALID_FORMAT_MESSAGE)).toBeVisible();
});

test('Import rejects files over 10 MB and then validates smaller files', async ({ page }) => {
    const basePage = new BasePage(page);
    const importAssetPage = new ImportAssetPage(page);

    await basePage.login('qa', '123456');
    await importAssetPage.importButton.click();

    await page.setInputFiles('input[type="file"]', OVER_SIZE_TEMPLATE_FILE);
    await expect(page.getByText(MAX_SIZE_MESSAGE)).toBeVisible();

    await page.setInputFiles('input[type="file"]', INVALID_TEMPLATE_FILE);
    await expect(page.getByText(FILE_ERRORS_MESSAGE)).toBeVisible();
});

test('Import rejects empty Excel files', async ({ page }) => {
    const basePage = new BasePage(page);
    const importAssetPage = new ImportAssetPage(page);

    await basePage.login('qa', '123456');
    await importAssetPage.importButton.click();

    await page.setInputFiles('input[type="file"]', EMPTY_TEMPLATE_FILE);

    await expect(page.getByText(EMPTY_FILE_MESSAGE)).toBeVisible();
    // button 'importar activo' is disabled
    await expect(importAssetPage.submitButton).toBeDisabled();
    
});
