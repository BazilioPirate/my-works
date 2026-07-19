#!/usr/bin/env bash
# Деплой eilat.coahlab.com на сервер 203.161.49.154.
#
# ВАЖНО: этот скрипт нельзя запустить из среды Claude Code on the web —
# сетевая политика этой песочницы пропускает только HTTPS-трафик через прокси
# и блокирует произвольный TCP (включая SSH/22). Запускайте его с обычного
# терминала (свой ноутбук / сервер с прямым доступом в интернет), где есть
# SSH-доступ к серверу.
#
# Использование:
#   chmod +x deploy.sh
#   ./deploy.sh                       # обычный запуск (ключ по умолчанию из ~/.ssh)
#   SSH_KEY=~/.ssh/id_ed25519 ./deploy.sh
#   LETSENCRYPT_EMAIL=you@example.com ./deploy.sh   # чтобы сразу выпустить SSL

set -euo pipefail

SERVER_HOST="203.161.49.154"
SERVER_USER="root"
DOMAIN="eilat.coahlab.com"
REMOTE_DIR="/var/www/${DOMAIN}"
SSH_KEY="${SSH_KEY:-}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "$SSH_KEY" ]; then
  SSH_OPTS+=(-i "$SSH_KEY")
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> 1. Создаю каталог сайта на сервере: ${REMOTE_DIR}"
ssh "${SSH_OPTS[@]}" "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_DIR}"

echo "==> 2. Копирую файлы сайта (rsync)"
rsync -avz --delete -e "ssh ${SSH_OPTS[*]}" \
  --exclude 'deploy.sh' --exclude 'DEPLOY.md' \
  "${SCRIPT_DIR}/" "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/"

echo "==> 3. Настраиваю nginx server block"
ssh "${SSH_OPTS[@]}" "${SERVER_USER}@${SERVER_HOST}" bash -s -- "$DOMAIN" "$REMOTE_DIR" <<'REMOTE_SCRIPT'
set -euo pipefail
DOMAIN="$1"
REMOTE_DIR="$2"
CONF="/etc/nginx/sites-available/${DOMAIN}"

cat > "$CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${REMOTE_DIR};
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json text/plain image/svg+xml;
    gzip_min_length 512;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(?:css|js|json|png|jpg|jpeg|webp|svg|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    location = /manifest.json {
        add_header Content-Type application/manifest+json;
    }
}
NGINX

ln -sf "$CONF" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t
systemctl reload nginx
echo "nginx: конфиг ${DOMAIN} применён и перезагружен"
REMOTE_SCRIPT

echo "==> 4. Проверка по HTTP"
echo "    curl -I http://${DOMAIN}/  (должно быть 200, после того как DNS A-запись указывает на ${SERVER_HOST})"

if [ -n "$LETSENCRYPT_EMAIL" ]; then
  echo "==> 5. Выпускаю SSL-сертификат Let's Encrypt"
  ssh "${SSH_OPTS[@]}" "${SERVER_USER}@${SERVER_HOST}" \
    "certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m ${LETSENCRYPT_EMAIL} --redirect"
else
  echo "==> 5. SSL пропущен (LETSENCRYPT_EMAIL не задан)."
  echo "    Убедитесь, что DNS A-запись ${DOMAIN} -> ${SERVER_HOST} уже применилась, затем выполните на сервере:"
  echo "    certbot --nginx -d ${DOMAIN} --agree-tos -m you@example.com --redirect"
fi

echo "==> Готово. Проверьте: https://${DOMAIN}/"
