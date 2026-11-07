# Decisiones

> BORRADOR: reescribe cada sección con tus propias palabras y lo que de verdad pasó.

## (a) Qué entendí del problema y qué tablas/modelos planeé

El problema pide una aplicación web para reservar salas de una biblioteca. El usuario inicia sesión, ve las salas, crea una reserva indicando sala, fecha, hora de inicio y hora de fin, y el sistema no debe permitir dos reservas que se crucen en la misma sala. Además, la sesión debe expirar a los 30 minutos sin actividad y, cuando eso pasa, el frontend debe volver al login.

Planeé tres modelos con Sequelize. Usuario (nombre, email, password), Sala (nombre, capacidad) y Reserva (fecha, horaInicio, horaFin). Una Sala tiene muchas Reservas y un Usuario tiene muchas Reservas, así que Reserva guarda las llaves foráneas SalaId y UsuarioId. Guardé las horas como texto “HH:MM” porque así puedo compararlas directamente con < y >.

## (b) Qué partes se delegaron a la IA y por qué

En este proyecto, la Inteligencia Artificial se utilizó exclusivamente como una herramienta de consulta, revisión de código y apoyo puntual, manteniendo el control total del diseño y la programación del sistema[cite: 1].

1. **Consultas de sintaxis en Sequelize:** Le pedí ayuda solo para recordar la forma exacta de escribir las relaciones (`belongsTo` y `hasMany`) entre mis tablas[cite: 1], ya que a veces se me olvidan los nombres de los métodos del ORM.


2. **Revisión de la lógica de horarios:** Escribí la función para validar que las reservas no se traslapen en la misma sala[cite: 1], pero le pedí a la IA que la revisara para asegurarme de que no se me estuviera pasando ningún caso bordes (por ejemplo, cuando una reserva termina justo a la hora que empieza la otra).


3. **Verificación de la cookie:** Le mostré mi código de Express para confirmar que los parámetros de la cookie (`httpOnly` y el `maxAge` de 30 minutos) estuvieran bien configurados según lo pedido[cite: 1].


4. **Manejo del error 401 en React:** Le pregunté cómo atrapar el status 401 de forma limpia en el cliente para hacer el `navigate('/login')` cuando la sesión expirara[cite: 1].


## (c) Algo que la IA hizo mal (o que tuve que corregir) y cómo me di cuenta

la IA eliminó la validación del formato de fecha y hora que tenía la primera versión. Lo noté al probar la API directamente con curl: después de reservar la Sala A el 2026-12-01 de 10:00 a 11:00, mandé otra reserva con la fecha 2026-12-1 y el mismo horario, y el servidor la aceptó con 201. Había quedado una doble reserva, y eso rompe la regla de negocio principal.

La causa es que fecha se guarda como texto y la consulta de solapamiento compara por igualdad exacta, así que dos formas de escribir la misma fecha no se detectaban como iguales. Lo corregí agregando en server.js una validación con expresión regular que exige el formato YYYY-MM-DD para la fecha y HH:MM para las horas, y respondo 400 si no se cumple. Volví a probar el mismo curl y ahora responde 400.
