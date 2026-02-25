# 🌐 Scripts de Gestión de Dominios para Cloud Run

Scripts automatizados para configurar y gestionar dominios personalizados en Google Cloud Run.

## 📋 Scripts Disponibles

### 1. `setup_domain.sh` - Configuración Completa de Dominio

Configura un dominio personalizado para un servicio de Cloud Run desde cero.

**Uso:**
```bash
./scripts/setup_domain.sh <domain> <service-name> <region> [project-id]
```

**Ejemplo:**
```bash
./scripts/setup_domain.sh psico-maryen.com maryen-front us-central1
```

**Lo que hace:**
1. ✅ Verifica que el servicio de Cloud Run existe
2. ✅ Crea el domain mapping en Cloud Run
3. ✅ Obtiene los registros DNS necesarios (A y AAAA)
4. ✅ Crea la zona DNS en Cloud DNS (si no existe)
5. ✅ Configura los registros A y AAAA automáticamente
6. ✅ Muestra instrucciones para verificar el progreso

**Prerequisitos:**
- `gcloud` CLI instalado y autenticado
- Dominio ya registrado (en Cloud Domains o con nameservers apuntando a Google)
- Servicio de Cloud Run ya desplegado
- Permisos para crear recursos en GCP

---

### 2. `check_domain.sh` - Verificación de Estado

Verifica el estado completo de un dominio configurado en Cloud Run.

**Uso:**
```bash
./scripts/check_domain.sh <domain> <region> [project-id]
```

**Ejemplo:**
```bash
./scripts/check_domain.sh psico-maryen.com us-central1
```

**Lo que verifica:**
- ✅ Estado del domain mapping
- ✅ Estado del certificado SSL
- ✅ Configuración de registros DNS
- ✅ Resolución DNS
- ✅ Conectividad HTTPS
- ✅ Código de respuesta HTTP

---

## 🚀 Flujo de Trabajo Típico

### Opción A: Dominio Nuevo en Cloud Domains

```bash
# 1. Registrar dominio (hacer manualmente en Cloud Domains)
# https://console.cloud.google.com/net-services/domains

# 2. Desplegar tu servicio en Cloud Run
gcloud run deploy mi-servicio --source . --region us-central1

# 3. Configurar el dominio
./scripts/setup_domain.sh mi-dominio.com mi-servicio us-central1

# 4. Esperar 10-30 minutos y verificar
./scripts/check_domain.sh mi-dominio.com us-central1
```

### Opción B: Dominio Existente (Registrado en Otro Lugar)

```bash
# 1. Desplegar tu servicio en Cloud Run
gcloud run deploy mi-servicio --source . --region us-central1

# 2. Configurar el dominio (esto creará la zona DNS)
./scripts/setup_domain.sh mi-dominio.com mi-servicio us-central1

# 3. El script te mostrará los nameservers de Google Cloud
# Configúralos en tu registrador de dominios (GoDaddy, Namecheap, etc.)

# 4. Esperar propagación DNS (hasta 48 horas) y verificar
./scripts/check_domain.sh mi-dominio.com us-central1
```

---

## 📝 Ejemplos de Salida

### Setup Domain (Exitoso)
```
✓ Configuración completada!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋 Resumen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dominio:      psico-maryen.com
  Servicio:     maryen-front
  Región:       us-central1
  Zona DNS:     psico-maryen-com

  ⏳ El certificado SSL se está generando automáticamente
  ⏳ La propagación DNS puede tomar 10-30 minutos
```

### Check Domain (Activo)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔍 Verificación de Dominio: psico-maryen.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Verificando domain mapping...
✓ Domain mapping encontrado → Servicio: maryen-front

ℹ Verificando estado del certificado SSL...
✓ Certificado SSL: Provisionado ✓

ℹ Estado general del dominio...
✓ Dominio: ACTIVO ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Tu dominio está completamente configurado y funcionando
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🌐 URL: https://psico-maryen.com
```

---

## ⏱️ Tiempos Esperados

| Paso | Tiempo |
|------|--------|
| Creación de domain mapping | Instantáneo |
| Creación de zona DNS | Instantáneo |
| Propagación DNS (Cloud Domains) | 10-30 minutos |
| Propagación DNS (Registrador externo) | 2-48 horas |
| Emisión de certificado SSL | 5-15 minutos después de DNS |
| **Total (Cloud Domains)** | **15-45 minutos** |
| **Total (Registrador externo)** | **2-48 horas** |

---

## 🔧 Troubleshooting

### El certificado no se emite

**Síntoma:** Después de 1 hora, el certificado sigue "Pendiente"

**Solución:**
```bash
# 1. Verificar que los registros DNS estén configurados
./scripts/check_domain.sh tu-dominio.com us-central1

# 2. Verificar propagación DNS global
dig tu-dominio.com @8.8.8.8

# 3. Si los registros son correctos, espera más tiempo (hasta 48 horas)
```

### Error: "Service not found"

**Síntoma:** El script dice que el servicio no existe

**Solución:**
```bash
# Ver todos los servicios disponibles
gcloud run services list

# Asegúrate de usar el nombre y región correctos
./scripts/setup_domain.sh dominio.com nombre-exacto region-exacta
```

### Los nameservers no coinciden

**Síntoma:** El dominio usa nameservers diferentes a los de la zona DNS

**Solución:**
```bash
# 1. Obtener los nameservers de la zona DNS
gcloud dns managed-zones describe tu-zona-dns --format="value(nameServers)"

# 2. Configurarlos en tu registrador de dominios
# (GoDaddy, Namecheap, Google Domains, etc.)
```

---

## 🗑️ Eliminar Configuración

Si necesitas eliminar la configuración de un dominio:

```bash
# 1. Eliminar domain mapping
gcloud beta run domain-mappings delete \
  --domain=tu-dominio.com \
  --region=us-central1

# 2. Eliminar registros DNS (opcional)
ZONE_NAME=$(echo "tu-dominio.com" | sed 's/\./-/g')
gcloud dns record-sets delete tu-dominio.com. \
  --zone=$ZONE_NAME \
  --type=A

gcloud dns record-sets delete tu-dominio.com. \
  --zone=$ZONE_NAME \
  --type=AAAA

# 3. Eliminar zona DNS (opcional, si ya no la necesitas)
gcloud dns managed-zones delete $ZONE_NAME
```

---

## 📚 Recursos Adicionales

- [Cloud Run Custom Domains](https://cloud.google.com/run/docs/mapping-custom-domains)
- [Cloud DNS Documentation](https://cloud.google.com/dns/docs)
- [Cloud Domains](https://cloud.google.com/domains)
- [SSL Certificate Troubleshooting](https://cloud.google.com/run/docs/troubleshooting#certificate-errors)

---

## 💡 Tips y Mejores Prácticas

1. **Usa Cloud Domains si es posible:** La integración es más rápida y automática
2. **Configura múltiples dominios:** Puedes apuntar varios dominios al mismo servicio
3. **Monitorea la expiración:** Los certificados SSL se renuevan automáticamente
4. **Usa TTL bajo (300s) al inicio:** Facilita correcciones rápidas si algo falla
5. **Aumenta TTL después:** Una vez estable, usa TTL de 3600s o más

---

## 🤝 Contribuir

Si encuentras bugs o tienes mejoras, por favor:
1. Abre un issue
2. Crea un PR con la mejora
3. Documenta los cambios

---

**Creado para:** Tu Lugar Seguro
**Última actualización:** 2026-02-15
