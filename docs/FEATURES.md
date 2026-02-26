# Features & Mejoras pendientes

## Base de datos

- [x] Aplicar las 3 migraciones en Supabase (`supabase db push` o manual en SQL Editor)
- [x] Crear usuario admin e insertar en `user_roles`
- [ ] Migración para tabla `products` (nombre, descripción, precio, stock, categoría, imagen, activo)
- [ ] Migración para tabla `infoproducts` (título, descripción, precio, contenido, imagen, activo)
- [ ] Migración para tabla `orders` (pedidos de tienda: usuario, productos, estado, total, dirección)
- [ ] Migración para tabla `testimonials` (texto, autor, rating, visible)
- [ ] Migración para tabla `faqs` (pregunta, respuesta, orden, visible)
- [ ] Migración para tabla `contact_messages` (nombre, email, asunto, mensaje, leído)
- [x] Migración para tabla `social_links` (red, url, activo, orden)
- [x] Migración para tabla `site_settings` (email, teléfono, ubicación, whatsapp_url)

---

## Panel admin

### Dashboard
- [ ] Conectar contadores reales (citas hoy, pedidos pendientes, escritos publicados, mensajes sin leer)
- [ ] Gráfico de citas por semana/mes
- [ ] Accesos directos a acciones frecuentes (nueva cita, nuevo escrito, ver pedidos)

### Escritos ✓ (implementado)
- [x] Rich text en párrafos (negrita, cursiva, subrayado, enlaces inline) con toolbar de formato
- [x] Texto justificado en la vista pública del lector
- [x] Bloque separador estilo Medium (· · ·) para dividir secciones
- [x] Bloque de video YouTube (embed con URL)
- [x] Bloque de tabla (filas y columnas editables, visualización estilizada)
- [x] Fix: constraint de tipo en escrito_blocks ampliada para nuevos bloques (migración)
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

### Configuración (contacto + redes) ✓ (implementado)
- [x] Crear página `/admin/configuracion` con dos secciones
- [x] Editar datos de contacto (email, teléfono, ubicación, URL WhatsApp)
- [x] CRUD de redes sociales (nombre, ícono Lucide, URL)
- [x] Activar/desactivar cada red sin eliminarla
- [x] Datos de contacto dinámicos en /contacto
- [x] Redes sociales dinámicas en el footer

### Clientes
- [ ] Crear página `/admin/clientes`
- [ ] Listado de usuarios registrados
- [ ] Ver historial de citas por cliente
- [ ] Ver historial de pedidos por cliente

### Contacto
- [ ] Crear página `/admin/mensajes`
- [ ] Listado de mensajes recibidos (leído/no leído)
- [ ] Ver mensaje completo
- [ ] Marcar como leído

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
- [x] Admin /admin/valores: CRUD con selector de ícono Lucide, título y descripción
- [x] Activar/desactivar valor sin eliminarlo

### Servicios ✓ (implementado)
- [x] Crear página `/admin/servicios`
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
- [ ] Enviar email de confirmación automático al cliente tras reservar
- [ ] Enviar email de notificación a la admin cuando llega un mensaje
- [ ] Poder adjuntar un carrusel de imágenes al taller

### Portal del cliente (autenticado)
- [ ] Crear sección `/mi-portal` visible solo para usuarios logueados
- [ ] Ver mis citas (historial + próximas)
- [ ] Ver mis compras
- [ ] Acceder a mis infoproductos comprados
- [ ] Editar perfil (nombre, foto)
- [ ] Recuperación de contraseña por email
/talleres
/encuentros
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
- [x] Open Graph tags para escritos (título, imagen de portada, excerpt)
- [ ] Sitemap automático con escritos publicados
- [ ] Lazy loading en imágenes de tienda e infoproductos
- [ ] Code splitting por ruta para reducir el bundle inicial

---

## UX / Mejoras de interfaz

- [ ] Skeleton loaders en listados mientras carga la data
- [ ] Página 404 con link a inicio
- [ ] Toggle de dark mode visible en el navbar
- [ ] Toast de confirmación al reservar cita
- [ ] Responsive del panel admin en móvil (sidebar colapsable)
- [ ] Imagen placeholder cuando un escrito/producto no tiene portada
- [ ] Paginación o infinite scroll en listados largos (escritos, productos)
- [ ] Breadcrumbs en páginas de detalle
