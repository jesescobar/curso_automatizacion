# language: es
@grupo-05
Característica: Ahorros y depósitos
  Como cliente del banco
  quiero gestionar mis depósitos a plazo
  para conocer tasas, plazos y vencimientos

  # Los escenarios con @wip no se ejecutan: el motivo está en el comentario sobre cada uno.
  # Quitar @wip solo cuando exista el step y el dato sea verificable sin modificar datos compartidos.

  @happy-path @grupo-05 @web @smoke
  Escenario: El cliente consulta un depósito a plazo vigente
    Dado que el cliente tiene un depósito a plazo vigente
    Cuando consulta el detalle de ese depósito
    Entonces el sistema devuelve el capital, la tasa y la fecha de vencimiento

  # Bloqueo: obliga a enviar el formulario de constitución y el servidor ya aceptó montos menores al mínimo (depósitos de PYG 1); crearía datos compartidos.
  @negativo @wip
  Escenario: Depósito con importe menor al mínimo permitido
    Dado que el cliente tiene una cuenta de ahorro activa
    Cuando intenta constituir un depósito por debajo del importe mínimo
    Entonces el sistema rechaza la operación

  # Bloqueo: no existe un depósito que venza hoy y la UI no muestra intereses acreditados.
  @edge-case @wip
  Escenario: Depósito en su fecha de vencimiento
    Dado que el cliente tiene un depósito que vence hoy
    Cuando consulta el estado de ese depósito
    Entonces el sistema lo muestra como vencido y con los intereses acreditados

  @happy-path @grupo-05 @web @smoke
  Escenario: Consultar las tasas disponibles para depósitos a plazo
    Dado que existen opciones de depósitos a plazo disponibles
    Cuando el cliente consulta las tasas vigentes
    Entonces el sistema muestra los importes, plazos y tasas de interés disponibles

  # Bloqueo: la UI solo muestra «Interés proyectado», no intereses generados.
  @happy-path @wip
  Escenario: Consultas los intereses generados
    Dado que el cliente tenga al menos un depósito a plazo vigente
    Cuando el cliente consulte un respectivo plazo
    Entonces el sistema le mostrará los intereses generados
    
  # Bloqueo: constituir un depósito modifica datos y saldo compartidos.
  @edge-case @wip
  Escenario: Constituir un depósito con el importe mínimo permitido
    Dado que el cliente tiene saldo suficiente
    Cuando constituye un depósito por el importe mínimo permitido
    Entonces el sistema registra el depósito correctamente


  # Bloqueo: la UI no tiene acción de cancelar y la operación modificaría datos compartidos.
  @happy-path @wip
  Escenario: Cancelar un depósito a plazo antes de su vencimiento
    Dado que el cliente tiene un depósito a plazo vigente
    Cuando cancela el depósito antes de la fecha de vencimiento
    Entonces el sistema procesa la cancelación anticipada
    Y acredita el capital más los intereses prorrateados en la cuenta del cliente

  # Bloqueo: requiere enviar el formulario de constitución (modifica datos compartidos).
  @negativo @wip
  Escenario: Constituir un depósito sin saldo suficiente
    Dado que el cliente tiene una cuenta de ahorro activa
    Y el saldo disponible es menor al importe del depósito
    Cuando intenta constituir un depósito a plazo
    Entonces el sistema rechaza la operación
    Y el depósito no es generado

  @negativo @grupo-05 @web
  Escenario: Consulta de un depósito a plazo inexistente
    Dado que el cliente está autenticado
    Cuando consulta un depósito a plazo que no existe
    Entonces el sistema responde que el depósito no fue encontrado

  # Bloqueo: el select de plazo solo ofrece plazos válidos; la UI no permite elegir uno no ofrecido.
  @negativo @wip
  Escenario: Constituir un depósito con un plazo no permitido
    Dado que el cliente tiene una cuenta de ahorro activa con saldo suficiente
    Cuando intenta constituir un depósito a plazo por un plazo no ofrecido por el banco
    Entonces el sistema rechaza la operación
    Y el depósito no es generado

  # Bloqueo: deja la cuenta en cero e inmoviliza el dinero (modifica datos compartidos).
  @edge-case @wip
  Escenario: Constituir un depósito por el total del saldo disponible
    Dado que el cliente tiene una cuenta de ahorro activa
    Y el saldo disponible es igual al importe del depósito
    Cuando constituye el depósito a plazo
    Entonces el sistema registra el depósito correctamente
    Y el saldo disponible de la cuenta queda en cero
