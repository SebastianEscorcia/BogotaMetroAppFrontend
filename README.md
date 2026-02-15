# 🚇 BogotaMetroApp — Frontend

Aplicación web estilo mobile para el futuro Metro de Bogotá, desarrollada como proyecto académico del programa Tecnólogo en Análisis y Desarrollo de Software (ADSO) del SENA.

## 📋 Descripción

BogotaMetroApp Frontend es una aplicación web progresiva con diseño mobile-first que simula la experiencia de usuario para el sistema de transporte del Metro de Bogotá. Este proyecto tiene como objetivo proporcionar una interfaz intuitiva y moderna para la gestión de usuarios, rutas y servicios relacionados con el metro.

El proyecto forma parte de un ecosistema completo que incluye un backend robusto desarrollado con tecnologías modernas, proporcionando una solución integral para la gestión del sistema de metro.

## 🚀 Tecnologías Utilizadas

![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.10.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-60.9%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-33.1%25-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-6%25-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.39.1-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

### Stack Principal

- **React 19.2.1** — Biblioteca de JavaScript para interfaces de usuario con JSX
- **Vite (rolldown-vite 7.2.5)** — Bundler y servidor de desarrollo ultrarrápido
- **React Router DOM 7.10.1** — Navegación declarativa para aplicaciones React
- **React Icons 5.5.0** — Librería de iconos para React
- **FontAwesome 7.1.0** — Iconos vectoriales y logotipos
- **ESLint 9.39.1** — Herramienta de análisis de código con plugins de React
- **CSS Puro** — Sin frameworks CSS, estilos personalizados

## 📁 Estructura del Proyecto

```
BogotaMetroAppFrontend/
├── public/                         # Archivos públicos estáticos
├── src/
│   ├── BogotaMetroApp.jsx         # Componente raíz con configuración de rutas
│   ├── main.jsx                   # Punto de entrada de la aplicación
│   │
│   ├── assets/                    # Recursos estáticos
│   │   ├── img/
│   │   │   └── imgs/              # Logos SVG/PNG, fondos, imágenes
│   │   └── styles/
│   │       └── layout.css         # Estilos globales y variables CSS
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── common/                # Componentes comunes
│   │   │   ├── Button.jsx         # Botón reutilizable estilizado
│   │   │   ├── HeaderTop.jsx      # Header superior de la aplicación
│   │   │   ├── Logo.jsx           # Componente de logo
│   │   │   └── index.js           # Exportaciones de componentes comunes
│   │   └── login/                 # Componentes específicos de login
│   │       └── LoginForms.jsx     # Formularios de inicio de sesión
│   │
│   ├── helpers/                   # Funciones auxiliares
│   │   ├── formValidators.js      # Validadores de formularios
│   │   └── index.js               # Exportaciones de helpers
│   │
│   ├── hooks/                     # Custom Hooks de React
│   │   ├── useLoginForm.js        # Hook para manejo de formulario de login
│   │   ├── useNavigateTo.js       # Hook personalizado de navegación
│   │   └── index.js               # Exportaciones de hooks
│   │
│   └── views/                     # Páginas/Vistas principales
│       ├── welcome/
│       │   └── Welcome.jsx        # Pantalla de bienvenida
│       ├── login/
│       │   └── Login.jsx          # Pantalla de inicio de sesión
│       ├── Register.jsx           # Pantalla de registro (en desarrollo)
│       ├── RecoverPassword.jsx    # Recuperación de contraseña (en desarrollo)
│       └── index.js               # Exportaciones de vistas
│
├── .gitignore                     # Archivos ignorados por Git
├── eslint.config.js               # Configuración de ESLint
├── index.html                     # HTML principal
├── package.json                   # Dependencias y scripts del proyecto
├── package-lock.json              # Lock de dependencias
├── vite.config.js                 # Configuración de Vite
└── README.md                      # Documentación del proyecto
```

## 🖼️ Vistas / Pantallas

| Ruta | Componente | Descripción | Estado |
|------|-----------|-------------|---------|
| `/` | `Welcome` | Pantalla de bienvenida inicial de la aplicación | ✅ Completo |
| `/login` | `Login` | Inicio de sesión de usuarios registrados | ✅ Completo |
| `/register` | `Register` | Registro de nuevos usuarios | 🚧 En desarrollo |
| `/recover-password` | `RecoverPassword` | Recuperación de contraseña olvidada | 🚧 En desarrollo |

## 🧩 Componentes

### Componentes Comunes (`src/components/common/`)

- **`Button.jsx`** — Componente de botón reutilizable con estilos personalizados y props configurables para diferentes variantes (primario, secundario, etc.)
  
- **`HeaderTop.jsx`** — Componente de encabezado superior que se muestra en las diferentes vistas de la aplicación, proporciona navegación consistente

- **`Logo.jsx`** — Componente de imagen para el logo del Metro de Bogotá, optimizado y reutilizable en diferentes contextos

### Componentes de Login (`src/components/login/`)

- **`LoginForms.jsx`** — Formulario completo de inicio de sesión con validación de campos, manejo de errores y estilos personalizados

## 🪝 Custom Hooks

### `useLoginForm(onSubmit)`

Hook personalizado para manejar la lógica del formulario de inicio de sesión.

**Funcionalidad:**
- Gestiona el estado de los campos de correo y contraseña
- Valida el formato del correo electrónico
- Valida la seguridad de la contraseña (mayúsculas, minúsculas, números, caracteres especiales)
- Maneja errores de validación
- Ejecuta la función `onSubmit` cuando los datos son válidos

**Retorna:**
```javascript
{
  correo,              // Estado del campo correo
  clave,               // Estado del campo contraseña
  error,               // Mensaje de error si existe
  handleCorreoChange,  // Manejador de cambio de correo
  handleClaveChange,   // Manejador de cambio de contraseña
  handleSubmit         // Manejador de envío del formulario
}
```

### `useNavigateTo()`

Hook personalizado que simplifica la navegación entre rutas de la aplicación.

**Funcionalidad:**
- Encapsula la lógica de `useNavigate` de React Router
- Proporciona una función `goTo` para navegar programáticamente

**Retorna:**
```javascript
{
  goTo  // Función para navegar a una ruta específica
}
```

## 🛠️ Helpers

### `formValidators.js`

Módulo que contiene funciones de validación para formularios.

#### `validateEmail(email)`

Valida el formato de un correo electrónico usando expresiones regulares.

**Parámetros:**
- `email` (string) — Correo electrónico a validar

**Retorna:** `boolean` — `true` si el formato es válido, `false` en caso contrario

**Regex:** `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

#### `validatePassword(password)`

Valida la seguridad de una contraseña según criterios específicos.

**Parámetros:**
- `password` (string) — Contraseña a validar

**Retorna:** `boolean` — `true` si cumple todos los requisitos, `false` en caso contrario

**Requisitos:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial (@$!%*?&)

**Regex:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** — Versión 18 o superior ([Descargar Node.js](https://nodejs.org/))
- **npm** — Gestor de paquetes de Node.js (incluido con Node.js)

Para verificar las versiones instaladas:

```bash
node --version
npm --version
```

## 🔧 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/SebastianEscorcia/BogotaMetroAppFrontend.git
cd BogotaMetroAppFrontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

> **Nota:** Ajusta la URL según la configuración de tu backend.

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `npm run dev` | Inicia el servidor de desarrollo con recarga en caliente |
| **Compilación** | `npm run build` | Compila la aplicación para producción en la carpeta `dist/` |
| **Lint** | `npm run lint` | Analiza el código con ESLint para detectar errores y problemas de estilo |
| **Preview** | `npm run preview` | Previsualiza la aplicación compilada localmente |

### Ejemplos de uso:

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Verificar código
npm run lint

# Previsualizar build
npm run preview
```

## 🎨 Paleta de Colores

La aplicación utiliza un esquema de colores personalizado definido en variables CSS:

| Color | Variable CSS | Hex | Visualización |
|-------|--------------|-----|---------------|
| **Rojo** | `--rojo` | `#fd0000` | ![#fd0000](https://via.placeholder.com/50x20/fd0000/fd0000.png) |
| **Amarillo** | `--amarillo` | `#ffd700` | ![#ffd700](https://via.placeholder.com/50x20/ffd700/ffd700.png) |
| **Gris** | `--gris` | `#aba99c` | ![#aba99c](https://via.placeholder.com/50x20/aba99c/aba99c.png) |
| **Gris Claro** | `--grisclaro` | `#e3e3e3` | ![#e3e3e3](https://via.placeholder.com/50x20/e3e3e3/e3e3e3.png) |
| **Vino Tinto** | `--vinotinto` | `#722f37` | ![#722f37](https://via.placeholder.com/50x20/722f37/722f37.png) |
| **Negro** | `--negro` | `#000000` | ![#000000](https://via.placeholder.com/50x20/000000/000000.png) |

### Uso en CSS:

```css
.elemento {
  background-color: var(--rojo);
  color: var(--grisclaro);
}
```

## 🔗 Repositorio Backend

Este frontend se conecta con el backend del proyecto BogotaMetroApp:

**Backend Repository:** [github.com/SebastianEscorcia/BogotaMetroAppBack](https://github.com/SebastianEscorcia/BogotaMetroAppBack)

El backend proporciona las APIs REST necesarias para la autenticación de usuarios, gestión de rutas y otros servicios esenciales para el funcionamiento completo de la aplicación.

## 👥 Autores

Este proyecto fue desarrollado por estudiantes del programa ADSO del SENA:

- **Jennifer Saumeth Gómez**
- **Diana Carolina López Lezama**
- **[Sebastian David Escorcia Montes](https://github.com/SebastianEscorcia)**

## 📄 Licencia

Este proyecto es parte de un trabajo académico del SENA. La licencia aún no ha sido definida.

---

<div align="center">

**🚇 BogotaMetroApp Frontend**

Desarrollado con ❤️ por estudiantes ADSO — SENA

</div>