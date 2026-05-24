# Muni-Go 🚌

Sistema de gestión y optimización de rutas de transporte municipal con enfoque en eficiencia, accesibilidad y experiencia del usuario.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Contribución](#contribución)

---

## 📝 Descripción del Proyecto

**Muni-Go** es una aplicación integral para la gestión de rutas de transporte municipal. El proyecto integra un backend robusto, una base de datos centralizada y una interfaz frontend intuitiva para optimizar la experiencia de viajeros y operadores de transporte.

### Características Principales:
- 🗺️ Gestión y optimización de rutas de transporte
- 👥 Control de acceso y perfiles de usuario
- 📊 Análisis de datos de transporte
- 🔐 Seguridad y autenticación
- 📱 Interfaz responsiva y amigable

---

## 📁 Estructura del Proyecto

```
Muni-Go/
├── 📂 backend/              # Servidor y lógica de negocio
├── 📂 frontend/             # Interfaz de usuario
├── 📂 database/             # Esquemas y configuración de BD
├── 📂 docs/                 # Documentación del proyecto
├── 📂 .vscode/              # Configuración del editor
└── 📄 README.md             # Este archivo
```

### Descripción Detallada por Carpeta

#### **🔧 `/backend`**
Contiene toda la lógica del servidor y la API REST del proyecto.

**Responsabilidades:**
- Implementación de endpoints REST
- Autenticación y autorización de usuarios
- Validación de datos
- Procesamiento de lógica de negocio
- Integración con la base de datos

**Tecnologías:**
- **Lenguaje:** Java (29.4% del proyecto)
- **Framework:** Spring Boot (recomendado)
- **Patrón:** MVC (Model-View-Controller)

**Estructura típica:**
```
backend/
├── src/
│   ├── controllers/         # Controladores REST
│   ├── services/            # Lógica de negocio
│   ├── models/              # Entidades del sistema
│   ├── repositories/        # Acceso a datos
│   ├── security/            # Autenticación y autorización
│   └── config/              # Configuraciones
├── pom.xml                  # Dependencias Maven
└── application.properties   # Configuración de la app
```

---

#### **🎨 `/frontend`**
Interfaz de usuario que los usuarios interactúan directamente.

**Responsabilidades:**
- Presentación de datos
- Interacción del usuario
- Consumo de APIs del backend
- Validación de formularios en cliente
- Visualización de mapas y rutas

**Tecnologías:**
- **Lenguajes:** JavaScript (59.7%), HTML (0.7%), CSS (10.2%)
- **Framework:** React.js con Vite (actual setup)
- **Librerías adicionales:** Leaflet/Google Maps para mapas

**Estructura típica:**
```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas principales
│   ├── services/            # Servicios HTTP
│   ├── styles/              # CSS y estilos
│   ├── utils/               # Funciones utilitarias
│   └── App.jsx              # Componente raíz
├── public/                  # Assets estáticos
├── package.json             # Dependencias npm
├── vite.config.js           # Configuración de Vite
└── .env                     # Variables de entorno
```

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
├── schema/
│   ├── usuarios.sql         # Tabla de usuarios
│   ├── rutas.sql            # Tabla de rutas
│   ├── paradas.sql          # Tabla de paradas
│   └── historial.sql        # Tabla de historial
├── seeders/                 # Datos iniciales
├── migrations/              # Scripts de migración
└── backup/                  # Copias de seguridad
```

**Tecnologías:**
- Base de datos relacional (PostgreSQL, MySQL)
- SQL para definición de esquemas

---

#### **📚 `/docs`**
Documentación completa del proyecto.

**Contenidos:**
- Especificación de requisitos
- Diagramas (UML, ER, arquitectura)
- Guías de instalación y configuración
- Manuales de usuario
- Documentación API
- Reportes y análisis
- **Informe APF (Análisis de Procesos y Funcionalidades)**

---

#### **⚙️ `/.vscode`**
Configuración del entorno de desarrollo en Visual Studio Code.

**Contenidos:**
- Extensiones recomendadas
- Configuración de debugging
- Formato de código
- Snippets personalizados

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Porcentaje |
|-----------|-----------|-----------|
| Frontend | JavaScript | 59.7% |
| Backend | Java | 29.4% |
| Estilos | CSS | 10.2% |
| Estructura | HTML | 0.7% |

### Stack Recomendado Completo:

**Backend:**
- Java 11+
- Spring Boot 3.x
- Maven o Gradle
- PostgreSQL/MySQL
- REST API
- JWT para autenticación

**Frontend:**
- React.js 18+
- Vite (bundler)
- Axios/Fetch API
- Leaflet o Google Maps
- CSS/Tailwind CSS o Bootstrap
- Node.js 16+ & npm 8+

**Base de Datos:**
- PostgreSQL (recomendado)
- MySQL (alternativa)
- JPA/Hibernate para ORM

**DevOps:**
- Docker
- Docker Compose
- Git & GitHub
- CI/CD (GitHub Actions)

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

# Ejecutar scripts de esquema
psql -U usuario -d muni_go -f schema/usuarios.sql
psql -U usuario -d muni_go -f schema/rutas.sql
psql -U usuario -d muni_go -f schema/paradas.sql
```

### 3️⃣ Configurar Backend

```bash
cd ../backend

# Configurar credenciales de BD en application.properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/muni_go
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

# Crear archivo .env
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Iniciar servidor de desarrollo
npm run dev
```

**Frontend disponible en:** `http://localhost:5173`

---

## 💻 Uso

### Acceso a la Aplicación

1. Abrir navegador en `http://localhost:5173`
2. Registrarse o iniciar sesión
3. Explorar rutas de transporte
4. Ver paradas y horarios
5. Realizar búsquedas y reservas

### APIs Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/rutas` | Obtener todas las rutas |
| GET | `/api/rutas/:id` | Obtener ruta por ID |
| GET | `/api/paradas` | Obtener todas las paradas |
| GET | `/api/horarios` | Obtener horarios disponibles |
| POST | `/api/usuarios/registro` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |
| POST | `/api/reservas` | Crear nueva reserva |
| GET | `/api/reservas/usuario` | Obtener reservas del usuario |

---

## 👥 Contribución

Para contribuir al proyecto:

1. Crear una rama: `git checkout -b feature/tu-feature`
2. Realizar cambios y commits con mensajes claros
3. Push a la rama: `git push origin feature/tu-feature`
4. Abrir un Pull Request describiendo los cambios

### Estándares de Código:
- **JavaScript:** Usar nomenclatura camelCase
- **Java:** Seguir convenciones JavaBean (camelCase)
- **SQL:** Usar UPPER_CASE para palabras clave
- Comentar código complejo
- Mantener funciones pequeñas y reutilizables
- Escribir tests unitarios para funcionalidades críticas

---

## 📞 Contacto y Soporte

Para preguntas o soporte:
- 🐙 GitHub: [@Estudiante-leonardo](https://github.com/Estudiante-leonardo)
- 📁 Repositorio: [Muni-Go](https://github.com/Estudiante-leonardo/Muni-Go)

---

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

**Última actualización:** Mayo 2026  
**Versión:** 1.0.0  
**Estado:** En desarrollo
