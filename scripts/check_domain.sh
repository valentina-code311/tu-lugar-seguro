#!/bin/bash

# =============================================================================
# Script: check_domain.sh
# Descripción: Verifica el estado de un dominio configurado en Cloud Run
# Uso: ./check_domain.sh <domain> <region> [project-id]
# Ejemplo: ./check_domain.sh example.com us-central1
# =============================================================================

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
Uso: $0 <domain> <region> [project-id]

Argumentos:
  domain       Nombre del dominio (ej: example.com)
  region       Región del servicio (ej: us-central1)
  project-id   (Opcional) ID del proyecto GCP

Ejemplo:
  $0 psico-maryen.com us-central1
EOF
    exit 1
}

# Validar argumentos
if [ $# -lt 2 ]; then
    log_error "Argumentos insuficientes"
    usage
fi

DOMAIN="$1"
REGION="$2"
PROJECT_ID="${3:-$(gcloud config get-value project)}"

# Validar que el proyecto esté configurado
if [ -z "$PROJECT_ID" ]; then
    log_error "No se pudo determinar el proyecto GCP"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 Verificación de Dominio: $DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# 1. Verificar Domain Mapping
# =============================================================================
log_info "Verificando domain mapping..."

if ! gcloud beta run domain-mappings describe \
    --domain="$DOMAIN" \
    --region="$REGION" \
    --project="$PROJECT_ID" &>/dev/null; then
    log_error "No se encontró domain mapping para '$DOMAIN'"
    exit 1
fi

MAPPING_INFO=$(gcloud beta run domain-mappings describe \
    --domain="$DOMAIN" \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --format="yaml")

SERVICE_NAME=$(echo "$MAPPING_INFO" | grep "routeName:" | awk '{print $2}')
log_success "Domain mapping encontrado → Servicio: $SERVICE_NAME"

# =============================================================================
# 2. Verificar estado del certificado
# =============================================================================
echo ""
log_info "Verificando estado del certificado SSL..."

CERT_STATUS=$(echo "$MAPPING_INFO" | grep -A 5 "type: CertificateProvisioned" | grep "status:" | head -1 | awk '{print $2}' | tr -d "'\"")
CERT_MESSAGE=$(echo "$MAPPING_INFO" | grep -A 5 "type: CertificateProvisioned" | grep "message:" | sed 's/.*message: //' | tr -d "'\"")

case "$CERT_STATUS" in
    "True")
        log_success "Certificado SSL: Provisionado ✓"
        ;;
    "False")
        log_error "Certificado SSL: Falló"
        echo "  Mensaje: $CERT_MESSAGE"
        ;;
    "Unknown"|*)
        log_warning "Certificado SSL: Pendiente ⏳"
        echo "  Mensaje: $CERT_MESSAGE"
        ;;
esac

# =============================================================================
# 3. Verificar estado general
# =============================================================================
echo ""
log_info "Estado general del dominio..."

READY_STATUS=$(echo "$MAPPING_INFO" | grep -A 5 "type: Ready" | grep "status:" | head -1 | awk '{print $2}' | tr -d "'\"")
READY_MESSAGE=$(echo "$MAPPING_INFO" | grep -A 5 "type: Ready" | grep "message:" | sed 's/.*message: //' | tr -d "'\"")

case "$READY_STATUS" in
    "True")
        log_success "Dominio: ACTIVO ✓"
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}  ✓ Tu dominio está completamente configurado y funcionando${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "  🌐 URL: https://$DOMAIN"
        ;;
    "False")
        log_error "Dominio: INACTIVO"
        echo "  Mensaje: $READY_MESSAGE"
        ;;
    "Unknown"|*)
        log_warning "Dominio: EN CONFIGURACIÓN ⏳"
        echo "  Mensaje: $READY_MESSAGE"
        echo ""
        log_info "El dominio está en proceso de configuración. Esto puede tomar:"
        echo "  • Propagación DNS: 10-30 minutos (hasta 48 horas)"
        echo "  • Emisión de certificado: 5-15 minutos después de la propagación DNS"
        ;;
esac

# =============================================================================
# 4. Verificar DNS
# =============================================================================
echo ""
log_info "Verificando registros DNS..."

ZONE_NAME=$(echo "$DOMAIN" | sed 's/\./-/g')

if gcloud dns managed-zones describe "$ZONE_NAME" --project="$PROJECT_ID" &>/dev/null; then
    log_success "Zona DNS encontrada: $ZONE_NAME"

    echo ""
    echo "  Registros configurados:"
    gcloud dns record-sets list --zone="$ZONE_NAME" --project="$PROJECT_ID" \
        --filter="name=$DOMAIN." --format="table(name,type,ttl,rrdatas)" | sed 's/^/  /'
else
    log_warning "No se encontró zona DNS en Cloud DNS para este dominio"
fi

# =============================================================================
# 5. Test de conectividad
# =============================================================================
echo ""
log_info "Probando conectividad..."

# Verificar resolución DNS
if host "$DOMAIN" &>/dev/null; then
    log_success "Resolución DNS: OK"
    IP=$(host "$DOMAIN" | grep "has address" | head -1 | awk '{print $4}')
    echo "  IP: $IP"
else
    log_warning "Resolución DNS: Pendiente o no propagada"
fi

# Intentar conectar via HTTPS
if timeout 5 curl -s -I "https://$DOMAIN" &>/dev/null; then
    log_success "HTTPS: Accesible ✓"

    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null)
    echo "  HTTP Status: $HTTP_STATUS"
else
    log_warning "HTTPS: No accesible aún (puede estar propagándose)"
fi

# =============================================================================
# 6. Comandos útiles
# =============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📝 Comandos útiles"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Ver detalles completos:"
echo "    gcloud beta run domain-mappings describe \\"
echo "      --domain=$DOMAIN --region=$REGION"
echo ""
echo "  Ver todos los mappings:"
echo "    gcloud beta run domain-mappings list --region=$REGION"
echo ""
echo "  Eliminar mapping (si es necesario):"
echo "    gcloud beta run domain-mappings delete \\"
echo "      --domain=$DOMAIN --region=$REGION"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
