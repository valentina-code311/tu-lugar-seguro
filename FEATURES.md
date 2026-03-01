# Features & Mejoras pendientes

## Base de datos

- [x] Aplicar las migraciones en Supabase
- [x] Crear usuario admin e insertar en `user_roles`
- [x] Migración para tabla `contact_messages` (nombre, email, asunto, mensaje, leído)
- [x] Migración para tabla `social_links` (red, url, activo, orden)
- [x] Migración para tabla `site_settings` (email, teléfono, ubicación, whatsapp_url, hero_*, about_*)
- [ ] Migración para tabla `products` (nombre, descripción, precio, stock, categoría, imagen, activo)
- [ ] Migración para tabla `infoproducts` (título, descripción, precio, contenido, imagen, activo)
- [ ] Migración para tabla `orders` (pedidos de tienda: usuario, productos, estado, total, dirección)
- [ ] Migración para tabla `testimonials` (texto, autor, rating, visible)
- [ ] Migración para tabla `faqs` (pregunta, respuesta, orden, visible)

---

## Panel admin

### Dashboard
- [ ] Conectar contadores reales (citas hoy, escritos publicados, mensajes sin leer)
- [ ] Gráfico de citas por semana/mes
- [ ] Accesos directos a acciones frecuentes (nueva cita, nuevo escrito)

### Escritos ✓ (implementado)
- [x] Rich text en párrafos (negrita, cursiva, subrayado, enlaces inline) con toolbar de formato
- [x] Texto justificado en la vista pública del lector
- [x] Bloque separador estilo Medium (· · ·) para dividir secciones
- [x] Bloque de video YouTube (embed con URL)
- [x] Bloque de tabla (filas y columnas editables, visualización estilizada)
- [x] Fix: constraint de tipo en escrito_blocks ampliada para nuevos bloques
- [x] Fix: guardado de escritos usa INSERT/UPDATE en lugar de upsert (evita conflicto de slug)
- [x] Fix: published_at gestionado por trigger SQL (se preserva al re-editar un publicado)
- [ ] Preview del escrito antes de publicar
- [ ] Ordenar escritos por drag-and-drop en el listado
- [ ] Duplicar un escrito existente como borrador

### Agenda ✓ (parcialmente implementado)
- [ ] Vista de citas en calendario mensual (admin)
- [x] Cambiar estado de una cita (pendiente → confirmada → completada → cancelada)
- [x] Ver detalle completo de cada cita
- [x] Agregar notas internas a una cita
- [ ] Gestionar disponibilidad semanal (horarios por día)
- [ ] Gestionar fechas bloqueadas (vacaciones, festivos)

### Productos
- [ ] Crear página `/admin/productos`
- [ ] CRUD de productos (crear, editar, eliminar)
- [ ] Subir imagen del producto a Supabase Storage
- [ ] Gestión de stock
- [ ] Activar/desactivar producto sin eliminarlo
- [ ] Gestión de categorías

### Infoproductos
- [ ] Crear página `/admin/infoproductos`
- [ ] CRUD de infoproductos
- [ ] Subir imagen de portada
- [ ] Editar lista de qué incluye

### Pedidos
- [ ] Crear página `/admin/pedidos`
- [ ] Listado de pedidos con estado (pendiente, procesando, enviado, entregado)
- [ ] Ver detalle del pedido con productos e info de envío
- [ ] Cambiar estado del pedido
- [ ] Filtrar por estado

### Configuración ✓ (implementado)
- [x] Página `/admin/configuracion` con tabs (URL `?tab=...`)
- [x] Editar datos de contacto (email, teléfono, ubicación, URL WhatsApp)
- [x] CRUD de redes sociales (nombre, ícono Lucide, URL, activar/desactivar)
- [x] Datos de contacto dinámicos en /contacto
- [x] Redes sociales dinámicas en el footer
- [x] Editar hero: badge, título y subtítulo de la portada
- [x] Editar "Sobre mí" del inicio: título (rich text), 2 párrafos (rich text) y etiquetas
- [x] Editar página /sobre-mi: título (rich text) y lista dinámica de párrafos (rich text)
- [x] Rich text en títulos y párrafos (negrita, cursiva, subrayado, enlaces)
- [x] Servicios y Valores integrados como tabs en /admin/configuracion
- [x] Rutas /admin/servicios y /admin/valores redirigen a configuracion?tab=...

### Testimonios
- [ ] Crear página `/admin/testimonios`
- [ ] CRUD de testimonios
- [ ] Mostrar/ocultar testimonio en el sitio

### FAQs
- [ ] Crear página `/admin/faqs`
- [ ] CRUD de preguntas frecuentes
- [ ] Reordenar por drag-and-drop

### Pacientes / Historias Clínicas ✓ (implementado)
- [x] Migración tabla `patients` con RLS solo admins
- [x] Migración tabla `clinical_sessions` (secciones A–L en JSONB)
- [x] Migración tabla `session_uploads` + bucket `session-notes`
- [x] Backend FastAPI en `app/backend/` con 4 endpoints IA
- [x] Agente OCR: extrae texto de imágenes de notas con Claude Vision
- [x] Agente IA: rellena historia clínica (secciones A–L) desde texto OCR
- [x] Agente resumen: genera resumen de preparación para próxima sesión
- [x] Endpoint email: envía historia clínica formateada al paciente por SMTP
- [x] Hook `usePatients` (CRUD pacientes)
- [x] Hook `useClinicalSessions` (CRUD sesiones + uploads)
- [x] Página `/admin/pacientes` — lista + crear pacientes
- [x] Página `/admin/pacientes/:id` — detalle + sesiones + modal resumen IA
- [x] Página `/admin/sesiones/:id` — editor completo historia clínica con IA
- [x] Nav "Pacientes" en AdminLayout
- [x] Servicio `c311-backend` en docker-compose

### Contacto / Mensajes
- [ ] Conectar el formulario para guardar mensajes en Supabase
- [ ] Crear página `/admin/mensajes`: listado, ver mensaje, marcar como leído
- [ ] Enviar email de notificación a la admin cuando llega un mensaje

### Clientes
- [ ] Crear página `/admin/clientes`
- [ ] Listado de usuarios registrados
- [ ] Ver historial de citas por cliente

---

## Páginas públicas

### Agenda
- [x] Conectar servicios desde Supabase (en vez de mockData)
- [ ] Calendario que respeta la disponibilidad semanal real desde BD
- [ ] Deshabilitar fechas bloqueadas en el calendario
- [x] Horarios en bloques de 30 min (9:00-11:30 y 14:00-16:30)
- [x] Deshabilitar horarios ocupados por citas existentes (consulta via RPC segura)
- [x] Enviar formulario de reserva a Supabase (appointments) — botón confirmar funcional
- [ ] Email de confirmación automático al cliente tras reservar

### Tienda
- [ ] Conectar productos desde Supabase (en vez de mockData)
- [ ] Página de detalle de producto (`/tienda/:slug`)
- [ ] Carrito de compras (contexto o estado global)
- [ ] Checkout con datos de envío
- [ ] Integración pasarela de pago (Wompi o MercadoPago)
- [ ] Email de confirmación de pedido al cliente

### Infoproductos
- [ ] Conectar infoproductos desde Supabase (en vez de mockData)
- [ ] Página de detalle de infoproducto (`/infoproductos/:slug`)
- [ ] Integración pasarela de pago para compra digital
- [ ] Entrega automática por email del archivo/acceso tras el pago

### Valores (Sobre mí) ✓ (implementado)
- [x] Migración tabla `valores` con seed de datos iniciales
- [x] Sección "Mis Valores" en /sobre-mi conectada a Supabase
- [x] CRUD en tab de Configuración (selector ícono Lucide, título, descripción, activar/desactivar)

### Servicios ✓ (implementado)
- [x] CRUD de servicios (crear, editar, eliminar)
- [x] Selección de ícono desde librería Lucide (picker visual)
- [x] Activar/desactivar servicio sin eliminarlo
- [x] Conectar servicios desde Supabase (en vez de mockData)
- [x] Botón "Agendar" en cada servicio lleva a /agenda pre-seleccionando el servicio (?servicio=uuid)

### Contacto
- [ ] Conectar el formulario para guardar mensajes en Supabase
- [ ] Enviar email de notificación a la admin cuando llega un mensaje

### Talleres ✓ (implementado)
- [x] Crear la página `/talleres` con sección de próximos y anteriores
- [x] Migración de tablas `talleres` y `taller_inscripciones`
- [x] CRUD en admin con editor completo
- [x] Formulario de inscripción público (cierra 5 h antes del evento)
- [x] Campo "experiencia vivida" editable post-evento
- [x] Imagen de referencia con upload a Supabase Storage
- [x] Vista de inscripciones en el editor admin
- [ ] Enviar email de confirmación automático al cliente tras inscribirse
- [ ] Poder adjuntar un carrusel de imágenes al taller

### Portal del cliente (autenticado)
- [ ] Crear sección `/mi-portal` visible solo para usuarios logueados
- [ ] Ver mis citas (historial + próximas)
- [ ] Ver mis compras y acceder a infoproductos comprados
- [ ] Editar perfil (nombre, foto)
- [ ] Recuperación de contraseña por email

---

## Datos estáticos a migrar desde mockData

- [x] Reemplazar `services` en el sitio público por datos desde Supabase
- [ ] Reemplazar `products` / `productCategories` por datos desde Supabase
- [ ] Reemplazar `infoproducts` por datos desde Supabase
- [ ] Reemplazar `testimonials` por datos desde Supabase (con control admin)
- [ ] Reemplazar `faqs` por datos desde Supabase (con control admin)
- [x] Reemplazar `socialLinks` en navbar/footer por datos desde Supabase
- [x] Reemplazar datos de contacto (email, teléfono) por configuración editable en admin

---

## SEO y rendimiento

- [ ] Meta tags dinámicos por página (`<title>`, `description`)
- [ ] Open Graph tags para escritos (título, imagen de portada, excerpt)
- [ ] Sitemap automático con escritos publicados
- [ ] Lazy loading en imágenes
- [ ] Code splitting por ruta para reducir el bundle inicial

---

## UX / Mejoras de interfaz

- [ ] Skeleton loaders en listados mientras carga la data
- [ ] Página 404 con link a inicio
- [ ] Toggle de dark mode visible en el navbar
- [ ] Toast de confirmación al reservar cita
- [ ] Imagen placeholder cuando un escrito/producto no tiene portada
- [ ] Paginación o infinite scroll en listados largos

---

## Refactorización Técnica

### Frontend — Arquitectura FSD ✓ (implementado)
- [x] Reestructurar src/ en shared/ y features/ (Feature-Sliced Design)
- [x] shared/: assets, components/ui, components/layout, contexts, hooks compartidos, integrations, lib
- [x] features/: escritos, talleres, agenda, pacientes, contacto, configuracion, home, sobre-mi, servicios, auth, admin
- [x] Actualizar components.json para apuntar a shared/components/ui/
- [x] Verificar build y dev server sin errores tras el movimiento

### Admin — Responsividad y Consistencia Visual (mobile-first) ✓ (implementado)
- [x] Sidebar: hamburger + drawer en mobile (Sheet de shadcn)
- [x] AdminEscritos: reemplazar `<table>` con card layout responsive
- [x] Dialogs: `grid-cols-1 sm:grid-cols-2` en formularios de admin
- [x] AdminSesionEditor: metadata en `grid-cols-2 md:grid-cols-4`
- [x] AdminPacienteDetalle + AdminSesionEditor: agregar breadcrumbs
- [x] Estandarizar h1 admin a `text-2xl font-display font-bold`
- [x] AdminTalleres: thumbnail responsive
- [x] Touch targets: botones icon mínimo 44×44px en mobile

### Base de Datos — Limpieza de Migraciones ✓ (implementado)
- [x] Fusionar 20260220000000_fix_escritos.sql → 20260217120000_escritos.sql
- [x] Fusionar 20260228000000_site_settings_content.sql → 20260223000000_site_settings.sql
- [x] Eliminar función duplicada set_updated_at() de 20260225000000_patients.sql
- [x] Generar supabase/execute.sql como staging area para SQL pendiente de ejecutar manualmente
