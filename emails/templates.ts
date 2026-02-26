export function credentialApprovedTemplate(name: string, username: string, tempPassword: string, platformUrl: string) {
  return {
    subject: 'Tu acceso a la plataforma legal está listo',
    html: `<p>Hola ${name}</p><p>Usuario: <b>${username}</b></p><p>Clave temporal: <b>${tempPassword}</b></p><p><a href="${platformUrl}">Ir a plataforma legal</a></p>`
  };
}

export function suspensionTemplate(name: string) {
  return {
    subject: 'Acceso suspendido por pago pendiente',
    html: `<p>Hola ${name}, tu acceso se suspendió por falta de pago. Actualiza tu método de pago para reactivar.</p>`
  };
}

export function paymentReminderTemplate(name: string, day: number) {
  return {
    subject: `Recordatorio de pago pendiente - día ${day}`,
    html: `<p>Hola ${name}, detectamos un pago pendiente. Este es el recordatorio ${day} de 4.</p>`
  };
}
