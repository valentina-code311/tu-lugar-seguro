#!/bin/bash

# =============================================================================
# Script: setup_domain.sh
# Descripción: Configura un dominio personalizado para Cloud Run desde cero
# Uso: ./setup_domain.sh <domain> <service-name> <region> [project-id]
# Ejemplo: ./setup_domain.sh example.com my-service us-central1
# =============================================================================

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Función para mostrar uso
usage() {
    cat << EOF
Uso: $0 <domain> <service-name> <region> [project-id]

Argumentos:
  domain       Nombre del dominio (ej: example.com)
  service-name Nombre del servicio de Cloud Run
  region       Región del servicio (ej: us-central1)
  project-id   (Opcional) ID del proyecto GCP

Ejemplo:
  $0 psico-maryen.com maryen-front us-central1

Prerequisitos:
  - gcloud CLI instalado y autenticado
  - Dominio ya registrado en Cloud Domains o configurado con nameservers de Google
  - Servicio de Cloud Run ya desplegado
EOF
    exit 1
}

# Validar argumentos
if [ $# -lt 3 ]; then
    log_error "Argumentos insuficientes"
    usage
fi

DOMAIN="$1"
SERVICE_NAME="$2"
REGION="$3"
PROJECT_ID="${4:-$(gcloud config get-value project)}"

# Validar que el proyecto esté configurado
if [ -z "$PROJECT_ID" ]; then
    log_error "No se pudo determinar el proyecto GCP. Especifícalo como argumento o configúralo con: gcloud config set project PROJECT_ID"
    exit 1
fi

log_info "Configuración:"
echo "  Dominio:  $DOMAIN"
echo "  Servicio: $SERVICE_NAME"
echo "  Región:   $REGION"
echo "  Proyecto: $PROJECT_ID"
echo ""

# =============================================================================
# 1. Verificar que el servicio existe
# =============================================================================
log_info "Verificando que el servicio '$SERVICE_NAME' existe..."
if ! gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    log_error "El servicio '$SERVICE_NAME' no existe en la región '$REGION'"
    log_info "Servicios disponibles:"
    gcloud run services list --project="$PROJECT_ID"
    exit 1
fi
log_success "Servicio encontrado"

# =============================================================================
# 2. Crear domain mapping en Cloud Run
# =============================================================================
log_info "Creando domain mapping..."
if gcloud beta run domain-mappings describe --domain="$DOMAIN" --region="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    log_warning "El domain mapping ya existe"
else
    if gcloud beta run domain-mappings create \
        --service="$SERVICE_NAME" \
        --domain="$DOMAIN" \
        --region="$REGION" \
        --project="$PROJECT_ID" &>/dev/null; then
        log_success "Domain mapping creado"
    else
        log_error "Error al crear domain mapping"
        exit 1
    fi
fi

# Esperar un momento para que se generen los registros DNS
sleep 3

# =============================================================================
# 3. Obtener los registros DNS necesarios
# =============================================================================
log_info "Obteniendo registros DNS necesarios..."
MAPPING_INFO=$(gcloud beta run domain-mappings describe \
    --domain="$DOMAIN" \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --format="yaml")

# Extraer registros A
A_RECORDS=$(echo "$MAPPING_INFO" | grep -A 10 "resourceRecords:" | grep "type: A" -B 1 | grep "rrdata:" | awk '{print $2}' | tr '\n' ',' | sed 's/,$//')

# Extraer registros AAAA
AAAA_RECORDS=$(echo "$MAPPING_INFO" | grep -A 20 "resourceRecords:" | grep "type: AAAA" -B 1 | grep "rrdata:" | awk '{print $2}' | tr '\n' ',' | sed 's/,$//')

if [ -z "$A_RECORDS" ]; then
    log_error "No se pudieron obtener los registros A. Intenta de nuevo en unos momentos."
    exit 1
fi

log_success "Registros DNS obtenidos"
echo "  A records:    $A_RECORDS"
echo "  AAAA records: $AAAA_RECORDS"

# =============================================================================
# 4. Configurar Cloud DNS
# =============================================================================
# Convertir dominio a nombre de zona válido (ej: example.com -> example-com)
ZONE_NAME=$(echo "$DOMAIN" | sed 's/\./-/g')

log_info "Verificando zona DNS '$ZONE_NAME'..."
if ! gcloud dns managed-zones describe "$ZONE_NAME" --project="$PROJECT_ID" &>/dev/null; then
    log_warning "La zona DNS no existe. Creándola..."

    if gcloud dns managed-zones create "$ZONE_NAME" \
        --dns-name="$DOMAIN." \
        --description="DNS zone for $DOMAIN" \
        --visibility=public \
        --project="$PROJECT_ID"; then
        log_success "Zona DNS creada"

        # Mostrar los nameservers
        log_info "Nameservers de la zona (configúralos en tu registrador de dominio):"
        gcloud dns managed-zones describe "$ZONE_NAME" --project="$PROJECT_ID" --format="value(nameServers)" | tr ';' '\n' | sed 's/^/  /'
    else
        log_error "Error al crear la zona DNS"
        exit 1
    fi
else
    log_success "Zona DNS encontrada"
fi

# =============================================================================
# 5. Crear registros DNS A y AAAA
# =============================================================================
log_info "Configurando registros DNS..."

# Eliminar registros existentes si los hay (para evitar conflictos)
if gcloud dns record-sets describe "$DOMAIN." --zone="$ZONE_NAME" --type=A --project="$PROJECT_ID" &>/dev/null; then
    log_warning "Eliminando registros A existentes..."
    OLD_A=$(gcloud dns record-sets describe "$DOMAIN." --zone="$ZONE_NAME" --type=A --project="$PROJECT_ID" --format="value(rrdatas)" | tr ';' ',')
    gcloud dns record-sets delete "$DOMAIN." --zone="$ZONE_NAME" --type=A --project="$PROJECT_ID" --quiet
fi

if gcloud dns record-sets describe "$DOMAIN." --zone="$ZONE_NAME" --type=AAAA --project="$PROJECT_ID" &>/dev/null; then
    log_warning "Eliminando registros AAAA existentes..."
    gcloud dns record-sets delete "$DOMAIN." --zone="$ZONE_NAME" --type=AAAA --project="$PROJECT_ID" --quiet
fi

# Crear registros A
log_info "Creando registros A..."
if gcloud dns record-sets create "$DOMAIN." \
    --zone="$ZONE_NAME" \
    --type=A \
    --ttl=300 \
    --rrdatas="$A_RECORDS" \
    --project="$PROJECT_ID"; then
    log_success "Registros A creados"
else
    log_error "Error al crear registros A"
    exit 1
fi

# Crear registros AAAA (si existen)
if [ -n "$AAAA_RECORDS" ]; then
    log_info "Creando registros AAAA..."
    if gcloud dns record-sets create "$DOMAIN." \
        --zone="$ZONE_NAME" \
        --type=AAAA \
        --ttl=300 \
        --rrdatas="$AAAA_RECORDS" \
        --project="$PROJECT_ID"; then
        log_success "Registros AAAA creados"
    else
        log_warning "No se pudieron crear registros AAAA (no crítico)"
    fi
fi

# =============================================================================
# 6. Verificar configuración
# =============================================================================
echo ""
log_success "¡Configuración completada!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📋 Resumen"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Dominio:      $DOMAIN"
echo "  Servicio:     $SERVICE_NAME"
echo "  Región:       $REGION"
echo "  Zona DNS:     $ZONE_NAME"
echo ""
echo "  ⏳ El certificado SSL se está generando automáticamente"
echo "  ⏳ La propagación DNS puede tomar 10-30 minutos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📝 Próximos pasos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Verificar el estado del certificado:"
echo "     gcloud beta run domain-mappings describe \\"
echo "       --domain=$DOMAIN \\"
echo "       --region=$REGION"
echo ""
echo "  2. Listar todos los domain mappings:"
echo "     gcloud beta run domain-mappings list --region=$REGION"
echo ""
echo "  3. Ver registros DNS configurados:"
echo "     gcloud dns record-sets list --zone=$ZONE_NAME"
echo ""
echo "  4. Probar el dominio (una vez propagado):"
echo "     curl -I https://$DOMAIN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
