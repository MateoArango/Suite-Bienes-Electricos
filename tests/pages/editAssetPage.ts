import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditAssetPage extends BasePage {
    readonly editBtn: Locator;
    readonly saveBtn: Locator;
    readonly cancelBtn: Locator;
    readonly deleteBtn: Locator;
    readonly descriptionBtn: Locator;

    // Ubicacion y Registro
    readonly departamentoField: Locator;
    readonly municipioField: Locator;
    readonly latitudField: Locator;
    readonly longitudField: Locator;
    readonly veredaField: Locator;
    readonly localidadField: Locator;
    readonly tipoZonaField: Locator;
    readonly enlaceFotosField: Locator;
    readonly enlaceArcgisField: Locator;
    readonly carpetaAltitudField: Locator;
    readonly nombrePlantillaField: Locator;
    readonly ubicacionDescripcionField: Locator;

    // Proyecto y Gestion
    readonly proyectoField: Locator;
    readonly subestacionField: Locator;
    readonly circuitoField: Locator;
    readonly tipoEnergiaField: Locator;
    readonly tipoConductorField: Locator;
    readonly nodoAnteriorField: Locator;
    readonly nodoActualField: Locator;
    readonly usuarioBienField: Locator;
    readonly nitCcUsuarioField: Locator;
    readonly memorandoField: Locator;
    readonly contratoIpseField: Locator;
    readonly contratoCcgField: Locator;
    readonly idContratoAomField: Locator;
    readonly numeroContratoOperadorAomField: Locator;
    readonly vigenciaContratoAomField: Locator;
    readonly fechaSuscripcionContratoAomField: Locator;
    readonly numeroContactoOperadorAomField: Locator;
    readonly emailOperadorAomField: Locator;
    readonly nombreContactoOperadorField: Locator;
    readonly operadorResponsableField: Locator;
    readonly numeroPolizasObraField: Locator;
    readonly fechaInicialPolizasObraField: Locator;
    readonly fechaFinalPolizasObraField: Locator;
    readonly tipoPolizaObraField: Locator;
    readonly observacionEstadoField: Locator;

    // Equipo y Avaluo
    readonly valorUcField: Locator;
    readonly avaluoRvField: Locator;
    readonly fuenteField: Locator;
    readonly formaAdquisicionField: Locator;
    readonly edadAgotadaField: Locator;
    readonly edadTipoField: Locator;
    readonly participacionPropiedadIpseField: Locator;
    readonly vidaRemanenteField: Locator;
    readonly valorAsociadoAdquisicionField: Locator;
    readonly valorAsociadoMantenimientoField: Locator;
    readonly marcaField: Locator;
    readonly cantidadField: Locator;
    readonly claseField: Locator;
    readonly serieField: Locator;
    readonly capacidadKvaKwField: Locator;
    readonly capacidadKvaField: Locator;
    readonly capacidadKwField: Locator;
    readonly funcionamientoField: Locator;
    readonly retiradoMttoField: Locator;
    readonly estadoEquipoField: Locator;
    readonly edadAparenteField: Locator;
    readonly municipioLevField: Locator;
    readonly localidadLevField: Locator;
    readonly codigoCregGeneralField: Locator;
    readonly fechaLevantamientoField: Locator;
    readonly pcbsField: Locator;
    readonly tipoAislamientoField: Locator;
    readonly tipoInstalacionField: Locator;
    readonly sistemaPuestaTierraField: Locator;

    // Red y Estructuras
    readonly alturaApoyoField: Locator;
    readonly disposicionApoyoField: Locator;
    readonly materialApoyoField: Locator;
    readonly resistenciaApoyoField: Locator;
    readonly ftoApoyoField: Locator;
    readonly estadoApoyoField: Locator;
    readonly tipoEstructuraField: Locator;
    readonly ftoEstructuraField: Locator;
    readonly estadoEstructuraField: Locator;
    readonly nroFasesField: Locator;
    readonly calibreConductorField: Locator;
    readonly materialConductorField: Locator;
    readonly cantCircuitosField: Locator;
    readonly ftoConductorField: Locator;
    readonly estadoConductorField: Locator;
    readonly cableGuardaKmField: Locator;
    readonly puestaTierraField: Locator;
    readonly templetesField: Locator;
    readonly cantConductorKmField: Locator;
    readonly longitudCalcMField: Locator;
    readonly atributosRedField: Locator;
    readonly atributosApoyoField: Locator;
    readonly codigoCregConductorField: Locator;
    readonly codigoCregApoyoField: Locator;
    readonly codigoCregCableGuardaField: Locator;
    readonly codigoCregPuestaTierraField: Locator;
    readonly codigoCregFibraOpticaField: Locator;
    readonly tipoPolizasContratoAomField: Locator;
    readonly valorCregApoyoField: Locator;
    readonly valorCregConductorField: Locator;
    readonly fechaFinalPolizasAomField: Locator;
    readonly numeroPolizasAomField: Locator;
    readonly fechaInicialPolizasAomField: Locator;

    constructor(page: Page) {
        super(page);
        this.editBtn = page.getByTestId('activesDetailEdit');
        this.saveBtn = page.getByTestId('activesDetailSave');
        this.cancelBtn = page.getByTestId('activesDetailCancel');
        this.deleteBtn = page.getByTestId('activesDetailDelete');
        this.descriptionBtn = page.getByTestId('activesDetailDescription');

        // mat-select fields render as visible text, so assert with toContainText().
        this.departamentoField = page.getByTestId('departamento');
        this.municipioField = page.getByTestId('municipio');

        // Real inputs/textareas can be asserted with toHaveValue().
        this.latitudField = page.getByTestId('latitud');
        this.longitudField = page.getByTestId('longitud');
        this.veredaField = page.getByTestId('vereda');
        this.localidadField = page.getByTestId('activesDetailUbicacionForm').getByText('Localidad');
        this.tipoZonaField = page.getByLabel('Tipo de zona');
        this.enlaceFotosField = page.getByTestId('enlaceFotos');
        this.enlaceArcgisField = page.getByTestId('enlaceArcgis');
        this.carpetaAltitudField = page.getByTestId('carpetaAltitud');
        this.nombrePlantillaField = page.getByTestId('nombrePlantilla');
        this.ubicacionDescripcionField = page.getByTestId('activesDetailUbicacionDescripcion');

        this.proyectoField = page.getByTestId('activesDetailProyectoProyecto');
        this.subestacionField = page.getByTestId('activesDetailProyectoSubestacion');
        this.circuitoField = page.getByTestId('activesDetailProyectoCircuito');
        this.tipoEnergiaField = page.getByLabel(/Tipo energ/i);
        this.tipoConductorField = page.getByTestId('activesDetailProyectoContainer').getByText('Conductor');
        this.nodoAnteriorField = page.getByTestId('activesDetailProyectoNodoAnterior');
        this.nodoActualField = page.getByTestId('activesDetailProyectoNodoActual');
        this.usuarioBienField = page.getByTestId('activesDetailResponsableUsuarioBien');
        this.nitCcUsuarioField = page.getByTestId('activesDetailResponsableNitCcUsuario');
        this.memorandoField = page.getByTestId('activesDetailResponsableMemorando');
        this.contratoIpseField = page.getByTestId('activesDetailResponsableContratoIpse');
        this.contratoCcgField = page.getByTestId('activesDetailResponsableContratoCcg');
        this.idContratoAomField = page.getByTestId('activesDetailResponsableIdContratoAom');
        this.numeroContratoOperadorAomField = page.getByTestId('activesDetailResponsableNumeroContratoOperadorAom');
        this.vigenciaContratoAomField = page.getByTestId('activesDetailResponsableVigenciaContratoAom');
        this.fechaSuscripcionContratoAomField = page.getByTestId('activesDetailResponsableFechaSuscripcionContratoAom');
        this.numeroContactoOperadorAomField = page.getByTestId('activesDetailResponsableNumeroContactoOperadorAom');
        this.emailOperadorAomField = page.getByTestId('activesDetailResponsableEmailOperadorAom');
        this.nombreContactoOperadorField = page.getByTestId('activesDetailResponsableNombreContactoOperador');
        this.operadorResponsableField = page.getByTestId('activesDetailResponsableOperadorResponsable');
        this.numeroPolizasObraField = page.getByTestId('activesDetailResponsableNumeroPolizasObra');
        this.fechaInicialPolizasObraField = page.getByTestId('activesDetailResponsableFechaInicialPolizasObra');
        this.fechaFinalPolizasObraField = page.getByTestId('activesDetailResponsableFechaFinalPolizasObra');
        this.tipoPolizaObraField = page.getByTestId('activesDetailResponsableTipoPolizaObra');
        this.observacionEstadoField = page.getByTestId('activesDetailResponsableObservacionEstado');

        this.valorUcField = page.getByTestId('activesDetailValoracionValorUc');
        this.avaluoRvField = page.getByTestId('activesDetailValoracionAvaluoRv');
        this.fuenteField = page.getByTestId('activesDetailValoracionFuente');
        this.formaAdquisicionField = page.getByTestId('activesDetailValoracionFormaAdquisicion');
        this.edadAgotadaField = page.getByTestId('activesDetailValoracionEdadAgotada');
        this.edadTipoField = page.getByTestId('activesDetailValoracionEdadTipo');
        this.participacionPropiedadIpseField = page.getByTestId('activesDetailValoracionParticipacionPropiedadIpse');
        this.vidaRemanenteField = page.getByTestId('activesDetailValoracionVidaRemanente');
        this.valorAsociadoAdquisicionField = page.getByTestId('activesDetailValoracionValorAsociadoAdquisicion');
        this.valorAsociadoMantenimientoField = page.getByTestId('activesDetailValoracionValorAsociadoMantenimiento');
        this.marcaField = page.getByTestId('activesDetailCaracteristicasMarca');
        this.cantidadField = page.getByTestId('activesDetailCaracteristicasCantidad');
        this.claseField = page.getByTestId('activesDetailCaracteristicasClase');
        this.serieField = page.getByTestId('activesDetailCaracteristicasSerie');
        this.capacidadKvaKwField = page.getByTestId('activesDetailCaracteristicasCapacidadKvaKw');
        this.capacidadKvaField = page.getByTestId('activesDetailCaracteristicasCapacidadKva');
        this.capacidadKwField = page.getByTestId('activesDetailCaracteristicasCapacidadKw');
        this.funcionamientoField = page.getByTestId('activesDetailCaracteristicasFuncionamiento');
        this.retiradoMttoField = page.getByTestId('activesDetailCaracteristicasRetiradoMtto');
        this.estadoEquipoField = page.getByText('Estado del equipo');
        this.edadAparenteField = page.getByTestId('activesDetailCaracteristicasEdadAparente');
        this.municipioLevField = page.getByTestId('activesDetailCaracteristicasMunicipioLev');
        this.localidadLevField = page.getByTestId('activesDetailCaracteristicasLocalidadLev');
        this.codigoCregGeneralField = page.getByTestId('activesDetailCaracteristicasCodigoCregGeneral');
        this.fechaLevantamientoField = page.getByTestId('activesDetailCaracteristicasFechaLevantamiento');
        this.pcbsField = page.getByTestId('activesDetailCaracteristicasPcbs');
        this.tipoAislamientoField = page.getByTestId('activesDetailCaracteristicasTipoAislamiento');
        this.tipoInstalacionField = page.getByTestId('activesDetailCaracteristicasTipoInstalacion');
        this.sistemaPuestaTierraField = page.getByTestId('activesDetailCaracteristicasSistemaPuestaTierra');

        this.alturaApoyoField = page.getByTestId('activesDetailApoyoAlturaApoyo');
        this.disposicionApoyoField = page.getByTestId('activesDetailApoyoDisposicionApoyo');
        this.materialApoyoField = page.getByTestId('activesDetailApoyoMaterialApoyo');
        this.resistenciaApoyoField = page.getByTestId('activesDetailApoyoResistenciaApoyo');
        this.ftoApoyoField = page.getByTestId('activesDetailApoyoFtoApoyo');
        this.estadoApoyoField = page.getByText('Estado apoyo');
        this.tipoEstructuraField = page.getByTestId('activesDetailApoyoTipoEstructura');
        this.ftoEstructuraField = page.getByTestId('activesDetailApoyoFtoEstructura');
        this.estadoEstructuraField = page.getByText('Estado estructura');
        this.nroFasesField = page.getByTestId('activesDetailConductorNroFases');
        this.calibreConductorField = page.getByTestId('activesDetailConductorCalibreConductor');
        this.materialConductorField = page.getByTestId('activesDetailConductorMaterialConductor');
        this.cantCircuitosField = page.getByTestId('activesDetailConductorCantCircuitos');
        this.ftoConductorField = page.getByTestId('activesDetailConductorFtoConductor');
        this.estadoConductorField = page.getByText('Estado conductor');
        this.cableGuardaKmField = page.getByTestId('activesDetailConductorCableGuardaKm');
        this.puestaTierraField = page.getByTestId('activesDetailConductorPuestaTierra');
        this.templetesField = page.getByTestId('activesDetailConductorTempletes');
        this.cantConductorKmField = page.getByTestId('activesDetailConductorCantConductorKm');
        this.longitudCalcMField = page.getByTestId('activesDetailConductorLongitudCalcM');
        this.atributosRedField = page.getByTestId('activesDetailConductorAtributosRed');
        this.atributosApoyoField = page.getByTestId('activesDetailCodigoAtributosApoyo');
        this.codigoCregConductorField = page.getByTestId('activesDetailCodigoCodigoCregConductor');
        this.codigoCregApoyoField = page.getByTestId('activesDetailCodigoCodigoCregApoyo');
        this.codigoCregCableGuardaField = page.getByTestId('activesDetailCodigoCodigoCregCableGuarda');
        this.codigoCregPuestaTierraField = page.getByTestId('activesDetailCodigoCodigoCregPuestaTierra');
        this.codigoCregFibraOpticaField = page.getByTestId('activesDetailCodigoCodigoCregFibraOptica');
        this.tipoPolizasContratoAomField = page.getByTestId('activesDetailCodigoTipoPolizasContratoAOM');
        this.valorCregApoyoField = page.getByTestId('activesDetailCodigoValorCregApoyo');
        this.valorCregConductorField = page.getByTestId('activesDetailCodigoValorCregConductor');
        this.fechaFinalPolizasAomField = page.getByTestId('activesDetailCodigoFechaFinalPolizasAom');
        this.numeroPolizasAomField = page.getByTestId('activesDetailCodigoNumeroPolizasAom');
        this.fechaInicialPolizasAomField = page.getByTestId('activesDetailCodigoFechaInicialPolizasAom');
    }

    async goto(plate: string) {
        await this.page.goto(`/dashboard/bienelectrico/detalle/${plate}`);
        await this.editBtn.click();
        await this.page.getByRole('button', { name: /Ubicaci.n Datos geogr.ficos/ }).waitFor({ state: 'visible' });
    }
}
