# Muni-Go 🚌

Sistema de gestión de trámites municipales multi-distrito. Un portal virtual para consultar requisitos, costos y tiempos de trámites respaldado por inteligencia artificial.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Enlaces de Despliegue](#enlaces-de-despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura Hexagonal](#arquitectura-hexagonal)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Contribución](#contribución)

---

## 📝 Descripción del Proyecto

**Muni-Go** es una plataforma centralizada (Ventanilla Única) que consolida la información de trámites de múltiples municipalidades en un solo lugar. El proyecto integra un backend robusto con arquitectura hexagonal en Spring Boot y Java, una base de datos PostgreSQL y una interfaz frontend dinámica en React.

### Características Principales:
- 🏛️ **Multimunicipalidad:** Permite cambiar de municipalidad en tiempo real y ver solo los trámites y categorías de la entidad seleccionada.
- 📑 **Catálogo Dinámico:** Categorías y trámites generados dinámicamente según la base de datos de cada distrito.
- 🤖 **Asistente IA:** Resúmenes generados por inteligencia artificial para facilitar la comprensión de los requisitos.
- 📱 **Interfaz Responsiva:** Diseño armónico e intuitivo adaptado a dispositivos móviles.
- ♿ **Accesibilidad:** Panel de accesibilidad global con modo daltónico (deuteranopia y monocromático), control de tamaño de texto, alto contraste, modo oscuro manual y reducción de animaciones. Text-to-Speech integrado para lectura en voz alta de trámites.

---

## 🌐 Enlaces de Despliegue

- **Frontend (Aplicación Web):** [https://muni-go-a6xj.onrender.com/](https://muni-go-a6xj.onrender.com/)
- **Backend (API REST):** [https://munigo-backend.onrender.com](https://munigo-backend.onrender.com)
- **Base de Datos:** PostgreSQL en [Supabase](https://supabase.com/)

---

## 📁 Estructura del Proyecto

```
Muni-Go/
├── 📂 backend/              # Servidor y lógica de negocio (Arquitectura Hexagonal)
├── 📂 frontend/             # Interfaz de usuario
├── 📂 database/             # Esquemas y configuración de BD
├── 📂 docs/                 # Documentación del proyecto
└── 📄 README.md             # Este archivo
```

### Descripción Detallada por Carpeta

#### **🔧 `/backend`**
Contiene toda la lógica del servidor y la API REST del proyecto, implementada bajo el patrón de **Arquitectura Hexagonal**.

**Responsabilidades:**
- Implementación de endpoints REST
- Validación de datos
- Procesamiento de lógica de negocio
- Integración con la base de datos

**Tecnologías:**
- **Lenguaje:** Java
- **Framework:** Spring Boot (recomendado)
- **Patrón:** Arquitectura Hexagonal

**Estructura Hexagonal:**
```
backend/
├── src/main/java/com/tramites/backend/
│   ├── domain/                    
│   │   ├── model/                 # Entidades del negocio (Tramite, Municipalidad, Requisito, etc.)
│   │   └── ports/                 # Interfaces de entrada/salida (in/out)
│   │
│   ├── application/               
│   │   └── usecases/              # Casos de uso (GetTramitesUseCaseImpl, etc.)
│   │
│   ├── infrastructure/            
│   │   ├── adapters/
│   │   │   ├── in/web/            # REST controllers
│   │   │   │   ├── dto/           # DTOs de entrada/salida
│   │   │   │   ├── health/        # HealthController
│   │   │   │   ├── TramiteController.java
│   │   │   │   └── MunicipalidadController.java
│   │   │   └── out/db/jpa/        # Adaptadores JPA (TramitePostgresAdapter, etc.)
│   │   └── config/                # Configuraciones (WebConfig, BeanConfiguration, GlobalExceptionHandler)
│   │
│   └── BackendApplication.java       
│
├── pom.xml                        
└── src/main/resources/application.properties         
```

**Principios Hexagonales:**
- **Independencia de frameworks:** La lógica de negocio no depende de Spring, bases de datos o tecnologías externas
- **Testabilidad:** Fácil de probar sin dependencias externas
- **Mantenibilidad:** Separación clara de responsabilidades
- **Flexibilidad:** Cambiar implementaciones sin afectar el negocio

---

#### **🎨 `/frontend`**
Interfaz de usuario que los usuarios interactúan directamente.

**Responsabilidades:**
- Presentación de datos
- Interacción del usuario
- Consumo de APIs del backend

**Tecnologías:**
- **Lenguajes:** JavaScript, HTML, CSS
- **Framework:** React.jsx
- **Estilos:** Tailwind CSS v4

**Estructura del frontend:**
```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/               # Sidebar, Layout, Navbar
│   │   └── accessibility/        # Panel de accesibilidad
│   ├── context/
│   │   ├── MunicipalidadContext.jsx
│   │   └── AccesibilidadContext.jsx  # Estado de accesibilidad global
│   ├── hooks/
│   │   └── useTTS.js             # Text-to-Speech hook
│   ├── lib/
│   │   └── constants.js          # Constantes centralizadas (API_BASE_URL, endpoints)
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   └── App.jsx
├── public/
├── package.json
├── vite.config.js
```

### Funcionalidades de Accesibilidad

Muni-Go incluye un **panel de accesibilidad global** (FAB en esquina inferior izquierda) con las siguientes opciones:

| Funcionalidad | Descripción |
|---|---|
| 🌈 **Modo daltónico** | Filtros CSS para Deuteranopia (verde) y Monocromático (escala de grises). Los badges de categorías incluyen iconos + color para no depender solo del color. |
| 🔤 **Tamaño de texto** | 3 niveles: Normal (100%), Grande (120%), Extra Grande (140%) que escalan toda la interfaz. |
| 🌗 **Modo oscuro** | Toggle manual con 3 estados: Sistema (sigue al SO), Claro y Oscuro. Accesible desde el navbar en desktop y el panel en todos los dispositivos. |
| ♿ **Alto contraste** | Sobrescribe colores con máximo contraste (fondo negro/texto blanco o viceversa) eliminando sombras y decoraciones. |
| 🌀 **Reducir animaciones** | Desactiva todas las transiciones, animaciones y movimientos de la interfaz. Compatible con `prefers-reduced-motion`. |
| 📢 **Text-to-Speech** | Botón "Escuchar" en cada tarjeta de trámite y en la vista de detalle. Lee en voz alta (Web Speech API) el nombre, descripción, requisitos y pasos. |

**Otras mejoras de accesibilidad:**
- `lang="es"` en el HTML raíz
- Skip-to-content link al primer tab del teclado
- Títulos de página dinámicos con `react-helmet-async`
- Todos los botones de icono tienen `aria-label`
- Navegación por teclado con Arrow keys en radiogroup de categorías (WAI-ARIA)
- Atributos `aria-expanded` y `aria-controls` en acordeón de FAQ
- `aria-atomic="true"` en contenedor de chat para lectores de pantalla
- Focus trapping en sidebar y modal de FAQ

---

## 🚀 Mejoras de Rendimiento (Backend)

Se implementaron las siguientes optimizaciones para reducir los tiempos de respuesta del backend:

| Optimización | Descripción | Impacto |
|---|---|---|
| **@BatchSize en colecciones LAZY** | Reemplaza carga EAGER por LAZY con `@BatchSize(20)`. Las colecciones (requisitos, formatos, pasos) se cargan en lotes de 20 en vez de 1x1, eliminando el problema N+1. | Alto |
| **@Cacheable en consultas frecuentes** | Las listas de trámites y municipalidades se cachean en memoria. Las respuestas repetidas no tocan la BD. | Medio |
| **Cierre de View temprano** | `spring.jpa.open-in-view=false` evita que Hibernate haga lazy loading durante la serialización JSON. | Alto |
| **Pool HikariCP optimizado** | Conexiones mínimas (2), máximas (10), timeout (5s) y max lifetime (60s) configurados. | Medio |
| **show-sql deshabilitado** | Elimina overhead de logging de cada query en producción. | Bajo |
| **BigDecimal para valores monetarios** | `costo` cambiado de `Double` a `BigDecimal` para evitar pérdida de precisión en operaciones financieras. | Medio |
| **GlobalExceptionHandler** | Manejo centralizado de errores HTTP con mensajes descriptivos en español y logging estructurado. | Medio |
| **Health endpoint liviano** | `GET /api/health` sin conexión a BD para monitoreo rápido del servicio. | Bajo |
| **CORS configurable** | Orígenes permitidos externalizados a variable de entorno `CORS_ALLOWED_ORIGINS`. | Bajo |

### Mantener el Backend Activo en Render (Plan Gratis)

Render duerme el servicio tras 15 minutos sin actividad. Para mantenerlo activo:

```bash
# Usar UptimeRobot (gratis, 5 monitores)
# Configurar un monitor HTTP a:
#   https://tu-app.onrender.com/api/health
#   Intervalo: cada 10 minutos
```

Alternativas gratuitas: [cron-job.org](https://cron-job.org) (sin límite de monitores), [UptimeRobot](https://uptimerobot.com) (hasta 5 monitores).

---

#### **💾 `/database`**
Esquemas, scripts de inicialización y configuración de la base de datos.

**Responsabilidades:**
- Definición del esquema relacional
- Creación de tablas e índices
- Datos iniciales (seeders)
- Scripts de migración
- Backups y restore

**Estructura típica:**
```
database/
├── scripts/
│   ├── init.sql         
```

**Tecnologías:**
- Base de datos relacional (PostgreSQL)
- SQL para definición de esquemas

---

#### **📚 `/docs`**
Documentación completa del proyecto.

**Contenidos:**
- Especificación de requisitos
- Diagramas (wareframe, arquitectura hexagonal)
- Guías de instalación y configuración
- Reportes y análisis
- **Informe APF (Análisis de Procesos y Funcionalidades)**

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
|-----------|-----------|
| Frontend | JavaScript, React.jsx, Vite |
| Backend | Java, Spring Boot |
| Estilos | CSS, Tailwind CSS v4 |
| Estructura | HTML |
| Base de Datos | PostgreSQL |
| ORM | JPA / Hibernate |

### Stack Completo:

**Backend:**
- Java 21
- Spring Boot 4.0.6
- Maven
- PostgreSQL
- REST API
- Arquitectura Hexagonal
- Hibernate 7.2 + HikariCP (pool)
- Spring Cache (SimpleCacheManager)

**Frontend:**
- React 19+
- React Router Dom v7
- Vite (bundler)
- Axios
- Tailwind CSS v4
- Lucide React (iconos)
- react-helmet-async (títulos dinámicos)
- Web Speech API (Text-to-Speech)
- Node.js 18+ & npm 9+

**Base de Datos:**
- PostgreSQL (recomendado)
- MySQL (alternativa)
- JPA/Hibernate para ORM



---

## 🏗️ Arquitectura Hexagonal

Muni-Go implementa la **Arquitectura Hexagonal (Puertos y Adaptadores)** en el backend para garantizar:

### Ventajas:
✅ **Independencia de frameworks:** El dominio no depende de tecnologías externas  
✅ **Testabilidad:** Tests sin necesidad de bases de datos o servidores  
✅ **Mantenibilidad:** Cambios en la persistencia sin afectar la lógica de negocio  
✅ **Escalabilidad:** Fácil agregar nuevos adaptadores (REST, GraphQL, etc.)  
✅ **Flexibilidad:** Intercambiar implementaciones sin modificar el negocio  

### Capas:

1. **Domain (Núcleo):** Contiene la lógica de negocio pura
   - Entidades, repositorios (interfaces), servicios de dominio

2. **Application:** Orquesta casos de uso y coordina el dominio
   - DTOs, mappers, puertos, casos de uso

3. **Infrastructure:** Implementaciones de adaptadores
   - Persistencia (JPA), REST controllers, seguridad, configuraciones externas

---

## 📋 Requisitos Previos

Antes de instalar Muni-Go, asegúrate de tener:

- **Git** instalado
- **Java JDK 11+** (para backend)
- **Node.js 16+** y **npm 8+** (para frontend)
- **PostgreSQL 12+** o **MySQL 8+** (base de datos)
- **Maven 3.6+** (gestor de dependencias Java)
- **Terminal/PowerShell o Git Bash** (Windows)

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Estudiante-leonardo/Muni-Go.git
cd Muni-Go
```

### 2️⃣ Configurar Base de Datos

```bash
cd database

# Crear base de datos
# En PostgreSQL:
createdb muni_go

```

### 3️⃣ Configurar Backend

```bash
cd ../backend

# Configurar credenciales de BD en application.properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/muni_db
# spring.datasource.username=tu_usuario
# spring.datasource.password=tu_contraseña
# spring.jpa.hibernate.ddl-auto=update

# Instalar dependencias y compilar
mvn clean install

# Ejecutar servidor
mvn spring-boot:run
# O también: java -jar target/muni-go-1.0.0.jar
```

**Backend disponible en:** `http://localhost:8080`

### 4️⃣ Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional, si se usa)
echo "VITE_API_URL=http://localhost:8081/api" > .env

# Iniciar servidor de desarrollo independiente
npm run dev
```

**Frontend disponible en:** `http://localhost:5173`

### 5️⃣ Ejecución Rápida (Ambos a la vez)

En la raíz del proyecto (Muni-Go), hemos configurado `concurrently` para facilitar el desarrollo. 

```bash
# Estando en la carpeta raíz (Muni-Go)
# 1. Instalar dependencias globales, de backend y frontend de una vez (configurado en package.json)
npm run install:all

# 2. Levantar servidor Spring Boot y Vite en simultáneo
npm run dev
```
Con este comando tendrás ambos entornos corriendo al mismo tiempo en la misma terminal.

**Frontend disponible en:** `http://localhost:5173`

---

## 💻 Uso

### Variables de Entorno para Producción

Al desplegar en Render, configurar las siguientes variables en el dashboard:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_URL` | URL de conexión PostgreSQL | `jdbc:postgresql://host:5432/muni_db` |
| `DB_USERNAME` | Usuario de BD | `postgres` |
| `DB_PASSWORD` | Contraseña de BD | *(sin default en producción)* |
| `PORT` | Puerto del servidor | `8081` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS permitidos | `https://muni-go-frontend.onrender.com` |

### Acceso a la Aplicación

1. Abrir navegador en `http://localhost:5173`
2. Seleccionar la municipalidad deseada desde el menú superior.
3. Explorar el catálogo de trámites dinámico.
4. Consultar detalles de trámites, requisitos, y resúmenes con IA.

### APIs Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tramites?municipalidadId={id}` | Obtener trámites por municipalidad |
| GET | `/api/municipalidades` | Obtener todas las municipalidades |
| GET | `/api/health` | Health check del servicio |

---

## 👥 Contribución

Para contribuir al proyecto:

1. Crear una rama: `git checkout -b feature/tu-feature`
2. Realizar cambios y commits con mensajes claros
3. Push a la rama: `git push origin feature/tu-feature`
4. Abrir un Pull Request describiendo los cambios



---

## 📞 Contacto y Soporte

Para preguntas o soporte:
- 🐙 GitHub: [@Estudiante-leonardo](https://github.com/Estudiante-leonardo)
- 📁 Repositorio: [Muni-Go](https://github.com/Estudiante-leonardo/Muni-Go)

---

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

**Última actualización:** Junio 2026  
**Versión:** 1.1.0  
**Estado:** En desarrollo
