/**
 * Validaciones centralizadas — estilo WhatsApp/Instagram/Facebook
 * Aplica tanto en registro como en ajustes de perfil.
 */

// ─── NOMBRE DE USUARIO ───────────────────────────────────────────────────────
// Solo letras latinas (a-z A-Z), números, puntos y guiones bajos.
// Sin espacios, emojis, acentos ni caracteres de otros idiomas.
// Longitud: 3-30 caracteres.
const REGEX_USERNAME = /^[a-zA-Z0-9._]{3,30}$/

export function validarNombreUsuario(valor) {
    const v = valor.trim()
    if (!v) return "El nombre de usuario es obligatorio."
    if (v.length < 3) return "Mínimo 3 caracteres."
    if (v.length > 30) return "Máximo 30 caracteres."
    if (/\s/.test(v)) return "El nombre de usuario no puede contener espacios."
    if (!REGEX_USERNAME.test(v)) return "Solo letras (a-z), números, puntos (.) y guiones bajos (_). Sin emojis ni caracteres especiales."
    return null // sin error
}

// ─── NOMBRE COMPLETO ─────────────────────────────────────────────────────────
// Solo letras latinas con o sin acento (á é í ó ú ü ñ), espacios simples entre palabras.
// Sin números, emojis ni caracteres de otros alfabetos.
// Longitud: 2-60 caracteres.
const REGEX_NOMBRE_COMPLETO = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+(?:\s[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+)*$/

export function validarNombreCompleto(valor) {
    const v = valor.trim()
    if (!v) return null // Opcional en ajustes — si lo dejas vacío está bien
    if (v.length < 2) return "Mínimo 2 caracteres."
    if (v.length > 60) return "Máximo 60 caracteres."
    if (/\s{2,}/.test(v)) return "No se permiten espacios dobles."
    if (!REGEX_NOMBRE_COMPLETO.test(v)) return "Solo letras del abecedario español y espacios entre nombres. Sin números, emojis ni símbolos."
    return null
}

// ─── CORREO ELECTRÓNICO ──────────────────────────────────────────────────────
// Formato estándar: usuario@dominio.ext
// Sin caracteres raros; solo ASCII básico.
const REGEX_CORREO = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export function validarCorreo(valor) {
    const v = valor.trim()
    if (!v) return "El correo electrónico es obligatorio."
    if (!REGEX_CORREO.test(v)) return "Ingresa un correo electrónico válido (ej: nombre@dominio.com)."
    if (v.length > 100) return "El correo es demasiado largo."
    return null
}

// ─── FECHA DE NACIMIENTO ─────────────────────────────────────────────────────
// No puede ser en el futuro.
// Edad mínima: 8 años (compatible con plataformas educativas/jóvenes).
// Edad máxima: 110 años (razonable como límite superior).
export function validarFechaNacimiento(valor) {
    if (!valor) return null // Opcional

    const fecha = new Date(valor)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (isNaN(fecha.getTime())) return "Fecha inválida."
    if (fecha > hoy) return "La fecha de nacimiento no puede ser en el futuro."

    const edad = hoy.getFullYear() - fecha.getFullYear()
    const cumpleEsteAno = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
    const edadReal = hoy >= cumpleEsteAno ? edad : edad - 1

    if (edadReal < 8) return "Debes tener al menos 8 años para registrarte."
    if (edadReal > 110) return "La fecha de nacimiento no es válida."

    return null
}

// ─── CONTRASEÑA ──────────────────────────────────────────────────────────────
export function validarContrasena(valor) {
    if (!valor) return "La contraseña es obligatoria."
    if (valor.length < 8) return "La contraseña debe tener al menos 8 caracteres."
    if (valor.length > 128) return "La contraseña no puede superar los 128 caracteres."
    return null
}

// ─── HELPER: ejecuta múltiples validaciones y devuelve el primer error ───────
export function validarCampos(campos) {
    for (const [fn, valor] of campos) {
        const error = fn(valor)
        if (error) return error
    }
    return null
}
