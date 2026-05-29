/**
 * api.js — URL base de la API
 *
 * Usa window.location.origin para que siempre apunte al mismo
 * servidor que sirve el frontend, sin importar si es:
 *  - localhost (desarrollo)
 *  - IP local (red local)
 *  - URL del túnel de Cloudflare (acceso externo)
 *
 * No requiere variables de entorno ni rebuild al cambiar de URL.
 */
export const API_URL = window.location.origin
