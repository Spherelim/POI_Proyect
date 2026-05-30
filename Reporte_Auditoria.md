# Reporte de Auditoría: Estado de Rúbrica POI Chat

Este documento resume de forma visual el avance del proyecto frente a los requisitos obligatorios (SI) y opcionales (NO) de la rúbrica.

---

## 📊 Resumen General de Avance

| Requisitos | Implementados | Incompletos | Faltantes | Avance Porcentual |
| :--- | :---: | :---: | :---: | :---: |
| **Obligatorios (SI)** | 10 | 0 | 1 | **91%** |
| **Opcionales (NO)** | 2 | 1 | 1 | **58%** |

---

## 📋 Lista de Control (Checklist) Detallada

### 🔴 Requisitos Obligatorios (SI)

| Requisito | Estado | Archivos Relacionados | Observaciones / Notas |
| :--- | :---: | :--- | :--- |
| **1. Base de Datos Propia** | ✅ 100% | `server/db.js`, `server/BackUps/BackUp.sql` | Base de datos MySQL (`poi_chat`) con relaciones bien establecidas. |
| **2. Encriptación de Mensajes** | ⚠️ 90% | `src/utils/crypto.js`, `src/components/chat/ChatInput.jsx` | Cifrado AES con switch funcional. *Nota: Los mensajes offline se cargan inicialmente sin desencriptar.* |
| **3. Videollamadas en Tiempo Real** | ✅ 100% | `src/pages/Chat.jsx`, `server/server.js` | Lógica WebRTC y señalización mediante WebSockets implementada. |
| **4. Envío de Archivos y Fotos** | ✅ 100% | `server/server.js` | Subida a Cloudinary con respaldo local en `uploads/mensajes/` usando Multer. |
| **5. Gamificación (Tareas y Puntos)** | ✅ 100% | `src/components/Tareas.jsx`, `/tareas/progreso` | El usuario gana puntos por realizar acciones en la aplicación. |
| **6. Personalización de Perfil** | ✅ 100% | `src/components/Settings.jsx` | Permite subir avatar, banner de fondo y actualizar descripción. |
| **7. Buscador y Solicitudes** | ✅ 100% | `src/components/Solicitudes.jsx` | Flujo completo para buscar y enviar solicitudes de amistad. |
| **8. Acciones sobre Amigos** | ✅ 100% | `src/components/chat/UserPerfil.jsx` | Funciones de silenciar, bloquear y eliminar amigos integradas. |
| **9. Historial Persistente** | ✅ 100% | `/mensajes/:idUsuario/:idAmigo` | Los mensajes se guardan en la base de datos y se recuperan al abrir el chat. |
| **10. Notificaciones en Tiempo Real** | ✅ 100% | `src/pages/Chat.jsx` | Alertas visuales inmediatas cuando se recibe un mensaje nuevo. |
| **11. Temática Mundial FIFA 2026 y Apoyo a Visitantes** | ❌ 0% | N/A | **Pendiente.** No hay estadios, mapas de la ciudad, calendario de partidos, ni módulos de información útil para el turista. |

---

### 🔵 Requisitos Opcionales / No Obligatorios (NO)

| Requisito | Estado | Archivos Relacionados | Observaciones / Notas |
| :--- | :---: | :--- | :--- |
| **1. Estado de Conexión Manual** | ❌ 0% | `src/components/chat/PerfilCard.jsx` | **Pendiente.** Solo cambia automáticamente. Falta selector manual (Ocupado, Invisible, etc.). |
| **2. Tienda de Canje por Puntos** | ⚠️ 30% | `src/components/chat/Insignias.jsx` | La base de datos tiene la tabla `item`, pero el componente de insignias es estático. Falta la interfaz para canjear puntos. |
| **3. Grupos con Selección (min 3)** | ✅ 100% | `src/components/chat/Sidebar.jsx` | Restricción funcional: requiere al menos 2 amigos seleccionados para crear un grupo. |
| **4. Límite de Integrantes (max 3)** | ✅ 100% | `README.md` | El equipo está formado por exactamente 3 integrantes. |

---

## 🛠️ Detalle de las Funcionalidades Faltantes

> ### 🏆 Temática Copa Mundial FIFA 2026 y Apoyo a Visitantes (Obligatorio)
> Para que el proyecto cumpla con el propósito principal del curso, necesita integrar el sistema de apoyo al visitante. Propuestas para implementarlo:
> * **Sección del Mundial:** Una vista dedicada para visitantes donde se muestren los estadios de la Copa Mundial 2026 (por ejemplo, Estadio Azteca, Estadio BBVA, Estadio Akron), información del transporte local y puntos turísticos de la ciudad.
> * **Lógica de Chat y Grupos Temáticos:** Crear canales o salas de chat públicas predefinidas para cada estadio o para la asistencia al turista.

> ### 🟢 Estado de Conexión Manual (Opcional)
> * Agregar un selector en la tarjeta del perfil (`PerfilCard.jsx`) que permita cambiar entre `En línea`, `Ocupado`, `Ausente` e `Invisible`.
> * Transmitir este estado a través de sockets a los amigos para cambiar su indicador de color instantáneamente.

> ### 🛒 Tienda de Insignias y Marcos (Opcional)
> * Conectar las tareas de gamificación con una tienda real donde se puedan comprar insignias (Stickers, Marcos para el avatar) usando los puntos acumulados en la tabla `usuario`.
