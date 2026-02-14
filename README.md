# Tu Lugar Seguro - Maryen Chamorro Psicologia

Sitio web profesional para la consulta de psicologia de **Maryen Chamorro**, psiciologa humanista y feminista especializada en jovenes y personas LGBTIQ+, ubicada en Cali, Colombia.

## Descripcion

Tu Lugar Seguro es una aplicacion web que sirve como plataforma digital para la practica de psicologia de Maryen Chamorro. Ofrece informacion sobre servicios terapeuticos, un sistema de agendamiento de citas en linea, un blog con articulos sobre salud mental, y recursos eticos y de privacidad.

### Funcionalidades principales

- **Agendamiento de citas**: Sistema interactivo con seleccion de servicio, calendario con disponibilidad en tiempo real, y formulario de datos del paciente. Integrado con Supabase y con opcion de contacto por WhatsApp.
- **Catalogo de servicios**: Terapia individual, terapia de pareja/familia, y talleres bimensuales, con precios y descripcion detallada.
- **Blog**: Articulos sobre salud mental organizados por categorias (limites, relaciones, LGBTIQ+, autoestima), con busqueda y filtrado.
- **Informacion profesional**: Paginas sobre la psicologa, metodologia de 4 pasos, codigo de etica, y politica de privacidad.
- **Contacto directo**: Boton flotante de WhatsApp y enlaces a redes sociales (Instagram, LinkedIn, YouTube).

## Stack tecnologico

| Categoria | Tecnologias |
|-----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS + shadcn/ui (Radix UI) |
| Backend | Supabase (PostgreSQL) |
| Formularios | React Hook Form + Zod |
| Estado del servidor | TanStack React Query |
| Rutas | React Router |
| Iconos | Lucide React |
| Testing | Vitest + Testing Library |
| Linting | ESLint + TypeScript ESLint |

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- npm

## Instalacion

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd tu-lugar-seguro

# Instalar dependencias
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_PROJECT_ID="tu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="tu_anon_key"
VITE_SUPABASE_URL="https://tu_proyecto.supabase.co"
```

## Scripts disponibles

| Comando | Descripcion |
|---------|------------|
| `npm run dev` | Inicia el servidor de desarrollo (puerto 8080) |
| `npm run build` | Genera el build de produccion |
| `npm run build:dev` | Genera el build en modo desarrollo |
| `npm run preview` | Previsualiza el build de produccion localmente |
| `npm run lint` | Ejecuta ESLint sobre el codigo fuente |
| `npm test` | Ejecuta las pruebas con Vitest |
| `npm run test:watch` | Ejecuta las pruebas en modo watch |

## Estructura del proyecto

```
src/
  components/       # Componentes reutilizables (Header, Footer, Layout, WhatsAppButton)
    ui/             # Componentes de shadcn/ui
  pages/            # Paginas de la aplicacion
    Index.tsx         # Inicio
    SobreMi.tsx       # Sobre la psicologa
    Servicios.tsx     # Servicios y precios
    Agenda.tsx        # Agendamiento de citas
    Talleres.tsx      # Talleres
    Blog.tsx          # Listado del blog
    BlogPost.tsx      # Articulo individual
    Etica.tsx         # Codigo de etica
    Privacidad.tsx    # Politica de privacidad
    Contacto.tsx      # Contacto
  hooks/            # Custom hooks (disponibilidad, toast, mobile)
  integrations/     # Configuracion de Supabase (cliente y tipos)
  data/             # Datos estaticos (posts del blog)
  lib/              # Utilidades y constantes
  assets/           # Imagenes y recursos estaticos
supabase/
  migrations/       # Migraciones de la base de datos
```

## Base de datos

El proyecto utiliza Supabase con las siguientes tablas:

- **services**: Servicios terapeuticos disponibles con precios y duracion
- **weekly_availability**: Horarios semanales de atencion
- **blocked_dates**: Fechas bloqueadas (vacaciones, festivos)
- **appointments**: Citas agendadas por pacientes

## Despliegue

El proyecto puede desplegarse a traves de [Lovable](https://lovable.dev) usando la opcion Share > Publish, o mediante cualquier servicio compatible con aplicaciones Vite/React (Vercel, Netlify, etc.).
