# Pull Request: Mejoras en el Sistema de Chat y Notificaciones

## 📋 Descripción General

Este PR incluye mejoras significativas en el sistema de chat de la aplicación Bogotá Metro, agregando un sistema de notificaciones global, reubicando componentes compartidos, y mejorando la experiencia del usuario en el módulo de soporte.

## 🎯 Cambios Principales

### 1. Sistema de Notificaciones Global (Nuevo)
- ✨ **Nuevo contexto de notificaciones** (`NotificationContext.jsx`)
  - Manejo centralizado de notificaciones del sistema
  - Sonido de notificación mediante Web Audio API
  - Control de notificaciones leídas/no leídas
  - Duración configurable de notificaciones (por defecto 5 segundos)

- ✨ **Componente de centro de notificaciones** (`SystemNotificationCenter.jsx`)
  - Renderizado mediante portales de React
  - Soporte para diferentes tipos de notificaciones (info, warning, error, success)
  - Botón de cierre manual
  - Estilos CSS dedicados con animaciones

- 🎨 **Estilos de notificaciones** (`notification.css`)
  - Diseño moderno con animaciones de entrada/salida
  - Variantes de color según el tipo de notificación
  - Posicionamiento fijo en la esquina superior derecha

### 2. Reubicación del Componente ConfirmDialog
- 🔄 **Movido de** `src/components/admin/ConfirmDialog.jsx` **a** `src/components/common/ConfirmDialog.jsx`
- ✨ **Mejoras en el componente:**
  - Ahora es reutilizable en múltiples módulos (admin, soporte, pasajero)
  - Props configurables para diferentes escenarios
  - Soporte para iconos personalizados
  - Textos y variantes de botones configurables
  - Estados de carga integrados
- 📦 **Actualizadas las exportaciones** en `src/components/common/index.js`

### 3. Mejoras en el Módulo de Soporte

#### ChatWindow Component
- 🔒 **Integración de ConfirmDialog** para confirmar el cierre del chat
- ✨ Estados de confirmación y cierre controlados
- 🐛 Mejoras en el manejo de errores y reconexión
- 📱 Mejor experiencia de usuario al cerrar sesiones

#### DashboardSoporte
- 🎨 Mejoras en el diseño y estilos
- 🔄 Integración con el sistema de notificaciones
- 📊 Mejor visualización de sesiones activas y pendientes

#### useSoporteChat Hook
- ✨ Lógica mejorada para aceptar y rechazar sesiones
- 🔔 Integración con el sistema de notificaciones
- 🐛 Manejo robusto de errores

### 4. Mejoras en el Módulo Pasajero

#### PasajeroChatWindow
- ✨ Integración con el sistema de notificaciones
- 🎨 Mejoras en estilos CSS
- 🔄 Mejor manejo de estados de conexión

### 5. Refactorización y Organización

#### Renombrado de Archivos
- `errorMessages.js` → `errorConstants.js`
- `errorMessage.js` → `getErrorMessage.js`
- 📦 Actualizadas todas las importaciones correspondientes

#### Nuevos Helpers
- ✨ `obtenerMensaje.js` - Helper para obtener mensajes del sistema
- 🔄 Mejoras en helpers existentes

#### Hooks Mejorados
- `useChatRoom.js` - Lógica mejorada de sala de chat
- `useRecoverPassword.js` - Uso de constantes actualizadas
- `useResetPassword.js` - Uso de constantes actualizadas

### 6. Mejoras en la Aplicación Principal

#### BogotaMetroApp.jsx
- 🔄 Integración del `NotificationProvider`
- ✨ Envoltorio de toda la aplicación con el contexto de notificaciones
- 🎨 Inclusión del `SystemNotificationCenter`

#### Otros Componentes
- `HomeHeader.jsx` - Actualizaciones menores
- `Soporte.jsx` - Integración con notificaciones
- `DashBoardAdmin.jsx` - Limpiezas de código

### 7. Servicios y WebSocket

#### webSocket.service.js
- 🔄 Mejoras en la gestión de conexiones WebSocket
- 🐛 Manejo más robusto de eventos

## 📊 Estadísticas de Cambios

```
28 archivos modificados
1,136 líneas añadidas
594 líneas eliminadas
```

### Archivos Modificados (M)
- src/BogotaMetroApp.jsx
- src/components/admin/index.js
- src/components/common/index.js
- src/components/home/HomeHeader.jsx
- src/components/pasajero/PasajeroChatWindow.jsx
- src/components/pasajero/pasajero-chat.css
- src/components/soporte/ChatWindow.jsx
- src/components/soporte/SesionActivaCard.jsx
- src/components/soporte/SesionPendienteCard.jsx
- src/constants/index.js
- src/helpers/index.js
- src/hooks/admin/soporte/useSoporteChat.js
- src/hooks/chat/useChatRoom.js
- src/hooks/recovery-password/useRecoverPassword.js
- src/hooks/recovery-password/useResetPassword.js
- src/services/web-socket/webSocket.service.js
- src/views/admin/DashBoardAdmin.jsx
- src/views/homeScreen/homescreen.css
- src/views/soporte-dashboard/DashboardSoporte.jsx
- src/views/soporte-dashboard/dashboardSoporte.css
- src/views/support/Soporte.jsx

### Archivos Añadidos (A)
- src/assets/styles/notification.css
- src/components/common/SystemNotificationCenter.jsx
- src/context/NotificationContext.jsx
- src/helpers/obtenerMensaje.js

### Archivos Renombrados (R)
- src/components/admin/ConfirmDialog.jsx → src/components/common/ConfirmDialog.jsx (64% similar)
- src/constants/errorMessages.js → src/constants/errorConstants.js (79% similar)
- src/helpers/errorMessage.js → src/helpers/getErrorMessage.js (100% similar)

## 🎨 Características Destacadas

### Sistema de Notificaciones
- 🔔 Notificaciones visuales con animaciones suaves
- 🔊 Sonido de notificación no intrusivo (frecuencia 880Hz)
- ⏱️ Auto-desaparición después de 5 segundos (configurable)
- 🎨 Tipos: info, warning, error, success
- 📱 Responsive y accesible

### ConfirmDialog Mejorado
- 🔄 Componente reutilizable en toda la aplicación
- 🎨 Diseño consistente con la UI
- ⚙️ Altamente configurable
- 🔒 Previene acciones accidentales
- ⏳ Estados de carga integrados

### Experiencia de Usuario Mejorada
- ✅ Confirmación antes de cerrar chats
- 🔔 Notificaciones de eventos importantes
- 🎨 UI más pulida y consistente
- 🐛 Menos errores y mejor manejo de excepciones

## 🧪 Testing

Se recomienda probar:
1. ✅ Abrir y cerrar sesiones de chat en el módulo de soporte
2. ✅ Verificar que aparece el diálogo de confirmación al cerrar chats
3. ✅ Probar el sistema de notificaciones (aceptar/rechazar sesiones)
4. ✅ Verificar el sonido de las notificaciones
5. ✅ Probar en módulo de pasajero y admin
6. ✅ Verificar que las notificaciones se auto-cierran
7. ✅ Probar la reconexión de WebSocket

## 🔐 Seguridad

- ✅ No se introducen nuevas vulnerabilidades
- ✅ Validaciones de entrada mantenidas
- ✅ Manejo seguro de contextos y estados
- ✅ Control de acceso preservado

## 📝 Notas Adicionales

- El sistema de notificaciones usa Web Audio API para sonidos (no requiere archivos de audio)
- ConfirmDialog ahora está disponible globalmente desde `src/components/common`
- Todos los módulos (admin, soporte, pasajero) pueden usar los nuevos componentes
- Las constantes de error ahora están mejor organizadas

## 🚀 Próximos Pasos

- Considerar agregar persistencia de notificaciones
- Añadir más tipos de notificaciones según sea necesario
- Implementar pruebas unitarias para los nuevos componentes
- Documentar el uso de ConfirmDialog y NotificationContext

---

**Tipo de cambio:** ✨ Feature / 🔄 Refactor / 🎨 Style  
**Módulos afectados:** Soporte, Pasajero, Admin, Common  
**Breaking changes:** ❌ No  
**Requiere migración:** ❌ No
