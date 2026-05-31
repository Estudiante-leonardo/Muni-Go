# Muni-Go 🚌

Sistema de gestión de trámites municipales multi-distrito. Un portal virtual para consultar requisitos, costos y tiempos de trámites respaldado por inteligencia artificial.

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

**Muni-Go** es una plataforma centralizada (Ventanilla Única) que consolida la información de trámites de múltiples municipalidades en un solo lugar. El proyecto integra un backend robusto con arquitectura hexagonal en Spring Boot y Java, una base de datos PostgreSQL y una interfaz frontend dinámica en React.

### Características Principales:
- 🏛️ **Multimunicipalidad:** Permite cambiar de municipalidad en tiempo real y ver solo los trámites y categorías de la entidad seleccionada.
- 📑 **Catálogo Dinámico:** Categorías y trámites generados dinámicamente según la base de datos de cada distrito.
- 🤖 **Asistente IA:** Resúmenes generados por inteligencia artificial para facilitar la comprensión de los requisitos.
- 📱 **Interfaz Responsiva:** Diseño armónico e intuitivo adaptado a dispositivos móviles.

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
│   ├── domain/                    
│   │   ├── model/              
│   │   ├── ports/          
│   │
│   ├── application/               
│   │
│   ├── infrastructure/            
│   │   ├── adapters/                
│   │   ├── config/              
│   │
│   └── main/
│       └── Application.java       
│
├── pom.xml                        
└── application.properties         
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

**Estructura típica:**
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   └── App.jsx
├── public/
├── package.json
├── vite.config.js
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
├── cripts/
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
| Frontend | JavaScript, React.jsx, Vite |
| Backend | Java, Spring Boot |
| Estilos | CSS, Tailwind CSS |
| Estructura | HTML |
| Base de Datos | PostgreSQL |
| ORM | JPA / Hibernate |

### Stack Completo:

**Backend:**
- Java 17
- Spring Boot 3.x
- Maven
- PostgreSQL
- REST API
- JWT para autenticación
- Arquitectura Hexagonal

**Frontend:**
- React.js 18+
- React Router Dom v6
- Vite (bundler)
- Axios/Fetch API
- Leaflet o Google Maps
- CSS/Tailwind CSS o Bootstrap
- Node.js 16+ & npm 8+

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

### Acceso a la Aplicación

1. Abrir navegador en `http://localhost:5173`
2. Seleccionar la municipalidad deseada desde el menú superior.
3. Explorar el catálogo de trámites dinámico.
4. Consultar detalles de trámites, requisitos, y resúmenes con IA.

### APIs Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tramites` | Obtener todas los tramites |

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

**Última actualización:** Mayo 2026  
**Versión:** 1.0.0  
**Estado:** En desarrollo
