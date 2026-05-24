# Muni-Go 🚌

Sistema de gestión y optimización de rutas de transporte municipal con enfoque en eficiencia, accesibilidad y experiencia del usuario.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura Hexagonal](#arquitectura-hexagonal)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Contribución](#contribución)

---

## 📝 Descripción del Proyecto

**Muni-Go** es una aplicación integral para la gestión de rutas de transporte municipal. El proyecto integra un backend robusto con arquitectura hexagonal, una base de datos centralizada y una interfaz frontend intuitiva.

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
├── 📂 backend/              # Servidor y lógica de negocio (Arquitectura Hexagonal)
├── 📂 frontend/             # Interfaz de usuario
├── 📂 database/             # Esquemas y configuración de BD
├── 📂 docs/                 # Documentación del proyecto
├── 📂 .vscode/              # Configuración del editor
└── 📄 README.md             # Este archivo
```

### Descripción Detallada por Carpeta

#### **🔧 `/backend`**
Contiene toda la lógica del servidor y la API REST del proyecto, implementada bajo el patrón de **Arquitectura Hexagonal**.

**Responsabilidades:**
- Implementación de endpoints REST
- Autenticación y autorización de usuarios
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
├── src/
│   ├── domain/                    # Núcleo del negocio
│   │   ├── entities/              # Entidades del dominio
│   │   ├── repositories/          # Interfaces de repositorios (puertos)
│   │   ├── services/              # Servicios de dominio
│   │   └── exceptions/            # Excepciones de negocio
│   │
│   ├── application/               # Lógica de aplicación
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── mappers/               # Mapeos entre capas
│   │   ├── usecases/              # Casos de uso
│   │   └── ports/                 # Puertos de entrada y salida
│   │
│   ├── infrastructure/            # Adaptadores (implementaciones)
│   │   ├── persistence/           # Adaptadores de persistencia (JPA, Hibernate)
│   │   ├── controllers/           # Controladores REST (adaptadores HTTP)
│   │   ├── config/                # Configuración de la aplicación
│   │   ├── security/              # Autenticación y autorización
│   │   ├── external/              # Integraciones externas (mapas, servicios)
│   │   └── messaging/             # Adaptadores de mensajería
│   │
│   └── main/
│       └── Application.java       # Punto de entrada
│
├── pom.xml                        # Dependencias Maven
└── application.properties         # Configuración de la app
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
- Validación de formularios en cliente
- Visualización de mapas y rutas

**Tecnologías:**
- **Lenguajes:** JavaScript, HTML, CSS
- **Framework:** React.js con Vite
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
- Diagramas (UML, ER, arquitectura hexagonal)
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

| Componente | Tecnología |
|-----------|-----------|
| Frontend | JavaScript, React.js, Vite |
| Backend | Java, Spring Boot |
| Estilos | CSS, Tailwind CSS |
| Estructura | HTML |
| Base de Datos | PostgreSQL / MySQL |
| ORM | JPA / Hibernate |
| Autenticación | JWT |
| Mapas | Leaflet / Google Maps |

### Stack Completo:

**Backend:**
- Java 11+
- Spring Boot 3.x
- Maven
- PostgreSQL/MySQL
- REST API
- JWT para autenticación
- Arquitectura Hexagonal

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
- Respetar la Arquitectura Hexagonal en el backend

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
