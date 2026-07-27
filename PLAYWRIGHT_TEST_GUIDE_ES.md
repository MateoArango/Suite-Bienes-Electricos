# Guía de pruebas Playwright

Esta guía documenta las 117 pruebas descubiertas en 31 archivos. Describe lo que cada prueba debe verificar; no representa el resultado de la última ejecución. Todas las pruebas están implementadas y activas, excepto las marcadas como `test.fixme`.

Para ejecutar una prueba por ID:

```powershell
npx playwright test --grep '@QA-AUTH-001'
```

Para revisar el inventario sin abrir el navegador:

```powershell
npx playwright test --list
```

### Inicio de sesión

Fuente: `tests/login/loginPortal.spec.ts`

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-AUTH-001 | Inicio de sesión válido | El usuario se autentica y llega al dashboard. |
| QA-AUTH-002 | Contraseña incorrecta | Se rechaza la combinación y aparece el error de autenticación. |
| QA-AUTH-003 | Usuario vacío | El botón de continuar permanece deshabilitado. |
| QA-AUTH-004 | Contraseña vacía | El botón de inicio de sesión permanece deshabilitado. |
| QA-AUTH-005 | Usuario inválido | El acceso se rechaza aunque se use la contraseña válida de pruebas. |

### Crear activo

Fuentes: `tests/createAsset/*.spec.ts`

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-CREATE-000 | Flujo completo de creación | Se recorren todas las etapas y el activo se registra correctamente. |
| QA-CREATE-001 | Crear solo con campos obligatorios | El activo se crea al completar la ubicación requerida y dejar vacíos los pasos opcionales. |
| QA-CREATE-002 | Crear sin seleccionar placa | La creación final se bloquea y aparece la validación de placa. |
| QA-CREATE-003 | Ubicación sin Departamento | No se puede avanzar mientras falte Departamento. |
| QA-CREATE-004 | Ubicación sin Municipio | No se puede avanzar mientras falte Municipio. |
| QA-CREATE-005 | Ubicación sin Fotos | No se puede avanzar mientras falte el enlace obligatorio de Fotos. |
| QA-CREATE-006 | Ubicación sin Enlace ARCGIS | No se puede avanzar mientras falte el enlace obligatorio de ARCGIS. |
| QA-CREATE-007 | Campos opcionales vacíos | Se puede avanzar cuando los campos requeridos están completos. |
| QA-CREATE-008 | Longitud máxima de Fotos | Acepta 200 caracteres y descarta el carácter adicional. |
| QA-CREATE-009 | Longitud máxima de ARCGIS | Acepta 100 caracteres y descarta el carácter adicional. |
| QA-CREATE-010A | Límites en Valoración financiera | Los campos evaluados no aceptan un sexto carácter. |
| QA-CREATE-010B | Límites en características de máquina | Los campos evaluados no aceptan un sexto carácter. |
| QA-CREATE-010C | Límite de Altura apoyo | El campo no acepta un sexto carácter. |
| QA-CREATE-010D | Límites de conductor y red | Los campos evaluados no aceptan un sexto carácter. |
| QA-CREATE-011 | Caracteres inválidos en campos con máscara | Los caracteres no permitidos son ignorados. |
| QA-CREATE-012 | Límite de Fotos al escribir y pegar | El mismo máximo se aplica al teclado y al portapapeles. |
| QA-CREATE-013 | Escritura manual en fechas | Los campos de fecha no permiten ingreso directo con teclado. |
| QA-CREATE-014 | Selección de fechas por calendario | Cada fecha se completa correctamente desde su calendario. |
| QA-CREATE-015 | Paso mostrado después de elegir placa | El stepper muestra Ubicación y su subpaso correcto. |
| QA-CREATE-016 | Contador de campos | El contador refleja campos llenos sin confundirse con la validez requerida. |
| QA-CREATE-017 | Volver sin perder la ubicación | Los valores de Ubicación permanecen al avanzar y regresar. |
| QA-CREATE-018 | Validación al regresar | Siguiente se habilita o bloquea según los campos obligatorios actuales. |
| QA-CREATE-023 | Cambiar Departamento | Municipio se limpia cuando cambia Departamento. |
| QA-CREATE-025 | Textos opcionales largos | Vacíos no bloquean el flujo y los valores extensos se limitan al máximo. |

### Editar activo

Fuentes: `tests/editAsset/*.spec.ts`

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-EDIT-000 | Flujo completo de edición | Se modifican las secciones del formulario y se guardan los cambios. |
| QA-EDIT-001 | Datos de API mostrados en el formulario | Los controles precargados coinciden con los valores normalizados de la API. |
| QA-EDIT-002 | Editar un campo obligatorio | El PATCH termina correctamente y el valor persiste al reabrir. |
| QA-EDIT-003 | Editar campos en varios paneles | Todos los valores requeridos guardados persisten al reabrir. |
| QA-EDIT-004 | Limpiar un campo obligatorio | Guardar se bloquea y aparece la validación en línea. |
| QA-EDIT-005 | Limpiar un campo opcional | El valor vacío se guarda y persiste. |
| QA-EDIT-006 | Contrato completo del PATCH | El payload contiene los cambios y conserva campos importantes no modificados. |
| QA-EDIT-007 | Cancelar una edición | Se descartan los cambios y no se envía ningún PATCH. |
| QA-EDIT-008 | Recarga completa después de guardar | El valor guardado permanece después de recargar y reabrir. |
| QA-EDIT-009 | Abrir edición por URL directa | La URL de un activo válido muestra el formulario editable. |
| QA-EDIT-011 | Reemplazar todo el texto | Seleccionar todo y escribir sustituye el valor completo. |
| QA-EDIT-012 | Agregar texto al final | El texto nuevo se añade sin reemplazar el contenido anterior. |
| QA-EDIT-013 | Insertar texto en el centro | Los caracteres se insertan en la posición del cursor. |
| QA-EDIT-014 | Eliminar el primer carácter | Delete quita el primer carácter y conserva el resto. |
| QA-EDIT-015 | Eliminar el último carácter | Backspace quita el último carácter y conserva el resto. |
| QA-EDIT-016 | Reemplazar con Ctrl+A | El atajo de seleccionar todo permite sustituir el valor. |
| QA-EDIT-017 | Copiar Vereda a Localidad | El valor copiado por portapapeles llega exactamente a Localidad. |
| QA-EDIT-018 | Cortar Vereda y pegar en Localidad | Vereda se corta y su valor exacto se pega en Localidad. |
| QA-EDIT-019 | Máximo de Vereda al escribir | El campo deja de aceptar caracteres al alcanzar su límite. |
| QA-EDIT-020 | Pegar texto sobre el máximo | El contenido pegado se recorta al límite permitido. |
| QA-EDIT-021 | Letras en campos numéricos | Los campos numéricos rechazan caracteres alfabéticos. |
| QA-EDIT-023 | Texto Unicode | El texto Unicode persiste después de guardar y recargar; luego se restaura el dato original. |
| QA-EDIT-024 | Deshacer y rehacer | Los atajos revierten y vuelven a aplicar la edición. |
| QA-EDIT-025 | Máscara monetaria de Valor UC | El valor se formatea mientras se escribe y conserva su significado numérico. |
| QA-EDIT-026 | Dependencia Departamento–Municipio | Cambiar Departamento limpia Municipio y Código DANE. |
| QA-EDIT-028 | Edición entre paneles accordion | Un cambio sin guardar permanece al cerrar y abrir paneles. |
| QA-EDIT-029 | Recargar durante una edición | Los cambios no guardados se descartan y vuelve el valor persistido. |
| QA-EDIT-030 | Navegar hacia otra placa | Los cambios no guardados se descartan sin mostrar diálogo. |
| QA-EDIT-030B | Varios paneles de Red y estructuras | Los paneles permanecen abiertos y sus campos se pueden editar. |
| QA-EDIT-032 | Atrás y adelante después de guardar | El historial carga el valor guardado y no un formulario obsoleto. |
| QA-EDIT-035 | Reintentar después de un fallo de guardado | El valor editado se conserva tras el fallo y persiste en el reintento exitoso. |
| QA-EDIT-036 | Activo editable | El botón Editar aparece visible y habilitado. |
| QA-EDIT-037 | Activo no editable | El botón Editar aparece, pero permanece deshabilitado. |
| QA-EDIT-038 | Activo de solo lectura | Los detalles se muestran y la edición queda bloqueada. |

### Generar reporte

Fuentes: `tests/exportAsset/*.spec.ts`

> Precaución: `QA-EXPORT-019` ejecuta una exportación real sin filtros. Es sensible al volumen de datos y a la memoria del servidor; no debe repetirse de forma casual.

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-EXPORT-000 | Flujo base con filtros | Se genera el reporte usando fechas, Departamento y Municipio. |
| QA-EXPORT-001 | Abrir Generar reporte | Se muestran la ruta, el drawer, los controles y las acciones accesibles correctas. |
| QA-EXPORT-002 | Cancelar y reabrir | No se exporta; al reabrir, los filtros temporales están limpios. |
| QA-EXPORT-003 | Cargar catálogos | Las peticiones autorizadas responden y los valores se muestran en los selectores. |
| QA-EXPORT-004 | Municipios de un Departamento | Municipio se habilita y muestra solamente opciones aplicables al Departamento. |
| QA-EXPORT-005 | Varios Departamentos | Se consultan `departmentIds` repetidos y se eliminan opciones visuales obsoletas. |
| QA-EXPORT-006 | Semántica de Todos y Ninguno | No existen selecciones contradictorias ni códigos de Municipio duplicados. |
| QA-EXPORT-007 | Limpiar filtros | Todos los filtros se limpian, Municipio vuelve a deshabilitarse y no se exporta. |
| QA-EXPORT-008 | Fechas válidas desde calendario | Las fechas normalizadas llegan al request y se cumple el contrato de descarga XLSX. |
| QA-EXPORT-009 | Fechas futuras | Las fechas futuras permanecen deshabilitadas y no se envía una exportación. |
| QA-EXPORT-010 | Inicio posterior al fin | Las fechas de inicio posteriores al límite final no se pueden seleccionar. |
| QA-EXPORT-011 | Inicio y fin iguales | El mismo día se acepta y se serializa igual en ambos campos. |
| QA-EXPORT-012 | Fecha inicial opcional vacía | Se envía `fechaInicial: ""` y se conserva la fecha final elegida. |
| QA-EXPORT-013 | Fecha final opcional vacía | Se envía `fechaFinal: ""` y se conserva la fecha inicial elegida. |
| QA-EXPORT-014 | Ambas fechas vacías | Las dos fechas se serializan como cadenas vacías. |
| QA-EXPORT-015 | Placa con ceros iniciales | La placa conocida conserva exactamente sus ceros iniciales en el payload. |
| QA-EXPORT-016 | Placa con espacios ASCII | Los espacios se conservan exactamente y se verifica la respuesta sin datos. |
| QA-EXPORT-017 | Letras y máximo numérico | **Bloqueada (`test.fixme`)** hasta que el negocio documente el límite de placa. |
| QA-EXPORT-018 | Exportación filtrada y XLSX | Se valida el payload exacto de siete claves y los datos de la placa en el XLSX. |
| QA-EXPORT-019 | Exportación sin filtros | Se valida el payload vacío canónico y un XLSX real; es lenta y sensible al heap. |
| QA-EXPORT-020 | Fallos y recuperación de catálogos | Se manejan 401, 403, 500, timeout y JSON inválido; luego los controles se recuperan. |
| QA-EXPORT-021 | Evitar exportaciones duplicadas | Solo se envía un request mientras la respuesta lenta está pendiente. |
| QA-EXPORT-022 | Cierre de sesión entre pestañas | **Bloqueada (`test.fixme`)** por falta de un locator estable de logout y el defecto de sesión observado. |

### Importar activo

Fuentes: `tests/importAsset/*.spec.ts`

| ID | Escenario | Resultado esperado |
|---|---|---|
| QA-IMP-001 | Flujo completo de importación | Se importa el libro y sus 102 campos mapeados coinciden con la API del activo. |
| QA-IMP-002 | Encabezados de la plantilla | La plantilla descargada contiene los encabezados esperados en el orden exacto. |
| QA-IMP-003 | Archivo que no es Excel | El archivo se rechaza y aparece el mensaje de formato permitido. |
| QA-IMP-004 | Archivo mayor de 10 MB | El archivo grande se rechaza y luego uno menor todavía puede validarse. |
| QA-IMP-005 | Excel vacío | El archivo sin datos se rechaza con el mensaje correspondiente. |
| QA-IMP-006 | Importación por lote | El libro de lote verificado se carga correctamente. |
| QA-IMP-007 | Reintento después de error 500 | El archivo validado se conserva y la carga se reintenta sin volver a validar. |
| QA-IMP-008 | Reintento después de timeout | El archivo validado se conserva y la carga se reintenta sin volver a validar. |
| QA-IMP-009 | Reintento después de desconexión | El archivo validado se conserva y la carga se reintenta sin volver a validar. |
| QA-IMP-010 | Filas vacías intercaladas | Las filas pobladas se importan aunque existan filas físicas vacías. |
| QA-IMP-011 | Número físico de fila con error | El error indica la fila real de la hoja, incluso después de filas vacías. |
| QA-IMP-012 | Placa que no corresponde al artículo | El libro se rechaza con el error de relación placa–artículo. |
| QA-IMP-013 | Placa en Baja o Devolución | La importación de la placa se rechaza por su estado. |
| QA-IMP-014 | Placa repetida en el mismo libro | La placa duplicada se detecta y se reporta. |
| QA-IMP-015 | Código DANE incorrecto | Se rechaza cuando Código DANE no corresponde al Municipio. |
| QA-IMP-016 | Municipio de otro Departamento | Se rechaza cuando Municipio no pertenece a Departamento. |
| QA-IMP-017 | Texto superior al máximo | Se reporta y exporta el error de longitud de Tipo de instalación. |
| QA-IMP-018 | Número fuera del límite | Se reporta y exporta el error de longitud de Edad agotada. |
| QA-IMP-019 | Valor numérico sobre el límite | Se reporta y exporta el error de Valor asociado a mantenimiento. |
| QA-IMP-020 | Formato decimal inválido | Se reporta y exporta el error de formato numérico. |
| QA-IMP-021 | Formato de fecha inválido | Se exige el formato `dd/MM/yyyy` y el error se exporta. |
| QA-IMP-022 | Varios errores de límite | Todos los errores del mismo libro se muestran y se exportan. |
| QA-IMP-025 | Reemplazar un activo existente | Se reemplazan datos llenos y vacíos, se verifican por API y se restaura el estado original. |
| QA-IMP-026 | ARTICULO obligatorio | El libro se rechaza cuando ARTICULO está vacío. |
| QA-IMP-027 | N° PLACA obligatorio | El libro se rechaza cuando N° PLACA está vacío. |
| QA-IMP-028 | FOTOS obligatorio | El libro se rechaza cuando FOTOS (enlace) está vacío. |
| QA-IMP-029 | PLANILLA obligatorio | El libro se rechaza cuando PLANILLA (ARCGIS) está vacío. |
| QA-IMP-030 | DEPARTAMENTO obligatorio | El libro se rechaza cuando DEPARTAMENTO está vacío. |
| QA-IMP-031 | MUNICIPIO obligatorio | El libro se rechaza cuando MUNICIPIO está vacío. |
| QA-IMP-032 | Código DANE obligatorio | El libro se rechaza cuando COD_LOCALIZACION_DANE está vacío. |
| QA-IMP-033 | Columnas de ubicación reordenadas | Las columnas se mapean por encabezado y los valores importados coinciden con la API. |

## Regla de mantenimiento

Cuando se agregue, renombre o elimine una prueba, actualice este archivo y `PLAYWRIGHT_TEST_GUIDE_EN.md` en el mismo cambio. Mantenga el ID idéntico a `testMetadata` y describa el resultado observable en lugar de los pasos de implementación.

