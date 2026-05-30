import CryptoJS from "crypto-js"

// Una clave fija de la app para cifrar/descifrar
const SECRET_KEY = "MundiChat_FIFA_2026_Secret_Token"

/**
 * Encripta un texto usando AES
 */
export function encriptar(texto) {
    if (!texto) return ""
    try {
        const cifrado = CryptoJS.AES.encrypt(texto, SECRET_KEY).toString()
        return `[CIFRADO]:${cifrado}`
    } catch (e) {
        console.error("Error al encriptar:", e)
        return texto
    }
}

/**
 * Desencripta un texto cifrado con AES.
 * Si no está cifrado o falla, retorna el texto original.
 */
export function desencriptar(texto) {
    if (!texto) return ""
    if (!texto.startsWith("[CIFRADO]:")) return texto // No está cifrado

    try {
        const hash = texto.substring(10) // Quitar el prefijo
        const bytes = CryptoJS.AES.decrypt(hash, SECRET_KEY)
        const descifrado = bytes.toString(CryptoJS.enc.Utf8)
        return descifrado || texto // Si falla Utf8 retorna el original
    } catch (e) {
        console.error("Error al desencriptar:", e)
        return texto
    }
}
