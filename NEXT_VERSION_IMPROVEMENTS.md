# Errores y mejoras para la próxima versión

Este documento reúne los errores y oportunidades de mejora encontrados durante las pruebas actuales de Bienes Eléctricos. El formato es intencionalmente simple para que producto, desarrollo y QA puedan entenderlo y actualizarlo fácilmente.

Estados usados:

- **Confirmado:** el comportamiento fue observado en la aplicación o reproducido por las pruebas.
- **Pendiente de validar:** la necesidad está identificada, pero falta completar la prueba o confirmar la regla de negocio.
- **Definición pendiente:** el sistema necesita una decisión funcional antes de implementar la validación.

## 1. La exportación sin filtros puede agotar la memoria del servidor

- **Estado:** Confirmado
- **Prioridad:** Alta
- **Problema:** una exportación grande, cercana a 10.000 placas, puede producir `java.lang.OutOfMemoryError: Java heap space`. Después de esto, el ambiente puede quedar lento, inestable o presentar problemas de inicio de sesión.
- **Mejora esperada:** limitar el tamaño de la exportación, exigir filtros, procesar el archivo por partes o generar el reporte de forma asíncrona. Si no puede completarse, se debe mostrar un mensaje claro al usuario.
- **Prueba relacionada:** `QA-EXPORT-019`

## 2. Falta una respuesta clara cuando la API de exportación falla

- **Estado:** Pendiente de validar
- **Prioridad:** Alta
- **Problema:** falta un manejo completo y visible para respuestas 4xx, 5xx, timeout, desconexión o un archivo inválido devuelto por la API de exportación.
- **Mejora esperada:** no mostrar éxito ni guardar un archivo corrupto. Se debe informar el error, conservar los filtros y permitir que el usuario intente nuevamente.
- **Prueba relacionada:** escenario 4.6 del plan de Generar reporte; todavía no tiene una prueba automatizada completa.

## 3. Los errores de los catálogos del reporte fallan silenciosamente

- **Estado:** Confirmado
- **Prioridad:** Alta
- **Problema:** cuando Departamento, Municipio, Estado o Grupo reciben 401, 403, 500, timeout o JSON inválido, no aparece un mensaje visible ni una acción de reintento. Actualmente el usuario debe cerrar y volver a abrir el formulario.
- **Mejora esperada:** mostrar un mensaje sencillo según el caso y ofrecer una opción de reintento. Los valores anteriores no deben quedar disponibles como si todavía fueran válidos.
- **Prueba relacionada:** `QA-EXPORT-020`

## 4. Puede aparecer éxito aunque una fecha no se envíe correctamente

- **Estado:** Confirmado
- **Prioridad:** Alta
- **Problema:** se observó que una fecha escrita como `21/7/2026` podía enviarse como `fechaFinal: ""` y aun así aparecer `Reporte generado correctamente`.
- **Mejora esperada:** validar la fecha antes del envío y mostrar éxito únicamente cuando el payload, la respuesta y el archivo XLSX sean válidos.
- **Pruebas relacionadas:** `QA-EXPORT-008` a `QA-EXPORT-014`

## 5. Un Municipio eliminado visualmente puede permanecer en el payload

- **Estado:** Confirmado
- **Prioridad:** Media
- **Problema:** después de quitar ARAUCA, ARAUQUITA desaparece de la pantalla, pero su código `065` puede permanecer en el formulario y enviarse junto con el Municipio válido `002`.
- **Mejora esperada:** al cambiar los Departamentos, eliminar también del estado interno todos los Municipios que ya no sean válidos.
- **Prueba relacionada:** `QA-EXPORT-005`

## 6. El selector de Municipios puede parpadear y perder selecciones

- **Estado:** Confirmado
- **Prioridad:** Media
- **Problema:** al seleccionar Municipios consecutivamente, las opciones pueden parpadear durante la actualización del componente y la segunda selección puede perderse
- **Mejora esperada:** mantener cada opción por su código y evitar que una actualización tardía reemplace la selección actual. La pausa de 200 ms usada en la prueba es solo una solución temporal.
- **Prueba relacionada:** `QA-EXPORT-007`

## 7. La sesión puede seguir activa en otra pestaña después de cerrar sesión

- **Estado:** Confirmado, con automatización bloqueada
- **Prioridad:** Alta
- **Problema:** después de cerrar sesión en una pestaña, otra pestaña abierta continuó recibiendo HTTP 200 de catálogos protegidos y del endpoint de Excel.
- **Mejora esperada:** revocar la sesión o token para todas las pestañas. Las peticiones posteriores deben responder 401 o 403, impedir la descarga y llevar al usuario al inicio de sesión.
- **Nota de testabilidad:** también hace falta un selector estable o nombre accesible para la acción de cerrar sesión.
- **Prueba relacionada:** `QA-EXPORT-022` (`test.fixme`)

## 8. La placa conserva espacios al inicio y al final

- **Estado:** Confirmado
- **Prioridad:** Media
- **Problema:** el valor `" 00000109 "` se envía con los espacios y produce una respuesta sin datos, aunque la placa sin espacios existe.
- **Mejora esperada:** quitar los espacios antes del envío o mostrar una validación clara para que el usuario pueda corregir el valor.
- **Prueba relacionada:** `QA-EXPORT-016`

## 9. No está definida la longitud máxima de la placa

- **Estado:** Definición pendiente
- **Prioridad:** Media
- **Problema:** no existe una regla documentada sobre la longitud máxima ni una confirmación completa de que la placa deba aceptar solamente números.
- **Mejora esperada:** definir la regla de negocio y aplicarla tanto en la interfaz como en la API con un mensaje de validación entendible.
- **Prueba relacionada:** `QA-EXPORT-017` (`test.fixme`)

## 10. Los cambios de un activo pueden perderse sin advertencia

- **Estado:** Confirmado
- **Prioridad:** Media
- **Problema:** si el usuario edita un campo y navega hacia otra placa, los cambios no guardados se descartan sin mostrar confirmación.
- **Mejora esperada:** advertir que existen cambios sin guardar y permitir elegir entre permanecer, descartar o guardar.
- **Prueba relacionada:** `QA-EDIT-030`

## Regla de mantenimiento

Cuando se encuentre un nuevo error, debe agregarse con un número, estado, prioridad, explicación sencilla, mejora esperada y prueba relacionada. Cuando se corrija, no se debe borrar: se debe marcar como **Corregido** e indicar la versión en la que fue solucionado.
