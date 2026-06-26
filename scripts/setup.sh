#!/usr/bin/env bash
##############################################################################
# ProductivityHub — setup.sh
# One-time setup: generates secrets, creates the Docker network, and validates
# that required tools are available.
#
# Usage:
#   chmod +x scripts/setup.sh
#   ./scripts/setup.sh
##############################################################################

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[info]${NC}  $1"; }
success() { echo -e "${GREEN}[ok]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[warn]${NC}  $1"; }
die()     { echo -e "${RED}[error]${NC} $1" >&2; exit 1; }

echo -e "\n${BOLD}ProductivityHub — Setup${NC}\n"

# ── Prerequisites ────────────────────────────────────────────────────────────
check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    die "$1 is not installed. Please install it first."
  fi
  success "$1 found"
}

info "Checking prerequisites…"
check_cmd docker
check_cmd openssl
docker compose version &>/dev/null || die "Docker Compose plugin not found. Install Docker Desktop or 'docker-compose-plugin'."
success "docker compose found"

# ── .env setup ───────────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
  info "Created .env from .env.example"
else
  warn ".env already exists — skipping copy"
fi

gen() { openssl rand -hex "$1"; }
gen_b64() { openssl rand -base64 32 | tr -d '\n'; }

replace_secret() {
  local key="$1" val="$2"
  # macOS-compatible in-place sed
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^${key}=.*|${key}=${val}|" .env
  else
    sed -i "s|^${key}=.*|${key}=${val}|" .env
  fi
}

info "Generating secrets…"
replace_secret NEXTAUTH_SECRET        "$(gen_b64)"
replace_secret CAL_DB_PASSWORD        "$(gen 16)"
replace_secret CAL_ENCRYPTION_KEY     "$(gen 32)"
replace_secret PLAUSIBLE_DB_PASSWORD  "$(gen 16)"
replace_secret PLAUSIBLE_SECRET_KEY   "$(gen 64)"
replace_secret GHOST_DB_ROOT_PASSWORD "$(gen 16)"
replace_secret GHOST_DB_PASSWORD      "$(gen 16)"
replace_secret N8N_ENCRYPTION_KEY     "$(gen 32)"
replace_secret SUPABASE_DB_PASSWORD   "$(gen 16)"
replace_secret MEDUSA_DB_PASSWORD     "$(gen 16)"
replace_secret MEDUSA_JWT_SECRET      "$(gen 32)"
replace_secret MEDUSA_COOKIE_SECRET   "$(gen 32)"
replace_secret APPFLOWY_DB_PASSWORD   "$(gen 16)"
replace_secret APPFLOWY_MINIO_PASSWORD "$(gen 16)"
replace_secret APPFLOWY_JWT_SECRET    "$(gen 32)"
replace_secret COOLIFY_DB_PASSWORD    "$(gen 16)"
replace_secret COOLIFY_REDIS_PASSWORD "$(gen 16)"
replace_secret COOLIFY_APP_KEY        "$(gen_b64)"
replace_secret LISTMONK_DB_PASSWORD   "$(gen 16)"
replace_secret PENPOT_DB_PASSWORD     "$(gen 16)"
replace_secret PENPOT_SECRET_KEY      "$(gen 32)"
success "Secrets generated and written to .env"

# ── Docker network ────────────────────────────────────────────────────────────
if docker network inspect hub &>/dev/null; then
  warn "Docker network 'hub' already exists"
else
  docker network create hub
  success "Created Docker network 'hub'"
fi

# ── DNS reminder ─────────────────────────────────────────────────────────────
DOMAIN=$(grep '^BASE_DOMAIN=' .env | cut -d= -f2)

echo ""
echo -e "${BOLD}DNS Records Required${NC}"
echo -e "Point the following A/CNAME records to your server IP:"
echo ""
printf "  %-28s → %s\n" "${DOMAIN}" "your.server.ip"
for sub in cal analytics blog n8n supabase store docs coolify campaigns design; do
  printf "  %-28s → %s\n" "${sub}.${DOMAIN}" "your.server.ip"
done
echo ""
echo -e "${YELLOW}Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before starting!${NC}"
echo ""

# ── Done ──────────────────────────────────────────────────────────────────────
echo -e "${GREEN}${BOLD}Setup complete.${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env  — set BASE_DOMAIN, ACME_EMAIL, ADMIN_EMAIL, ADMIN_PASSWORD"
echo "  2. Point DNS  — see table above"
echo "  3. docker compose up -d --build"
echo "  4. Open https://\${BASE_DOMAIN}"
echo ""
