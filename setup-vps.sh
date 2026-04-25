#!/usr/bin/env bash
# ═══════════════════════════════════════════════════
#  ForgeInfra — Setup VPS AlmaLinux 10
#  Lancer en root une seule fois
# ═══════════════════════════════════════════════════
set -euo pipefail

echo "═══ ForgeInfra VPS Setup ═══"

# ── 1. Mise à jour système ────────────────────────
dnf update -y

# ── 2. Docker ────────────────────────────────────
dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin git curl

systemctl enable --now docker
echo "✓ Docker installé : $(docker --version)"

# ── 3. User forgeinfra-user dans docker group ────
usermod -aG docker forgeinfra-user
echo "✓ forgeinfra-user ajouté au groupe docker"

# ── 4. Structure des dossiers ────────────────────
mkdir -p /opt/forgeinfra/{portal,api,nginx/conf.d,nginx/certbot/conf,nginx/certbot/www}
chown -R forgeinfra-user:forgeinfra-user /opt/forgeinfra
echo "✓ Dossiers créés dans /opt/forgeinfra"

# ── 5. Clone les repos ───────────────────────────
su - forgeinfra-user -c "
  git clone https://github.com/msr-infratech/forgeinfra-portal /opt/forgeinfra/portal
  git clone https://github.com/msr-infratech/forgeinfra-api    /opt/forgeinfra/api
"
echo "✓ Repos clonés"

# ── 6. Nginx config (HTTP d'abord, HTTPS après domaine) ──
cat > /opt/forgeinfra/nginx/conf.d/forgeinfra.conf <<'EOF'
server {
    listen 80;
    server_name _;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Proxy vers le portal React
    location / {
        proxy_pass http://forgeinfra-portal:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Proxy vers l'API FastAPI
    location /api/ {
        proxy_pass http://forgeinfra-api:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
echo "✓ Config Nginx créée"

# ── 7. Firewall ──────────────────────────────────
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
echo "✓ Firewall : ports 80 et 443 ouverts"

# ── 8. Premier démarrage ─────────────────────────
cd /opt/forgeinfra/portal
docker compose up -d

echo ""
echo "═══════════════════════════════════════"
echo "✓ Setup terminé"
echo "  Site accessible sur http://77.37.120.51"
echo ""
echo "Quand tu as un domaine :"
echo "  1. Mets à jour /opt/forgeinfra/nginx/conf.d/forgeinfra.conf"
echo "  2. Lance : docker compose run certbot certonly --webroot -w /var/www/certbot -d forgeinfra.io"
echo "  3. Active HTTPS dans la config nginx"
echo "═══════════════════════════════════════"
