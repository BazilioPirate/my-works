#!/usr/bin/env bash
# Деплой eilat.coahlab.com на 203.161.49.154 — Docker-контейнер + nginx-прокси
# хоста, по образцу cf_webapp (8000) / cf_webapp_dev (8001) / style-changer (5100).
#
# ВАЖНО: запускать с машины, у которой есть обычный SSH-доступ к серверу —
# из песочницы Claude Code on the web это невозможно (сетевая политика
# пропускает только HTTPS через прокси, порт 22 заблокирован).
#
# Порядок использования (НЕ пропускайте check — на сервере чужие правила
# в /root/cf_docs/RULES.md, их нужно прочитать до внесения изменений):
#
#   chmod +x deploy.sh
#   SSH_KEY=~/.ssh/id_ed25519 ./deploy.sh check    # только смотрит, ничего не меняет
#   SSH_KEY=~/.ssh/id_ed25519 ./deploy.sh apply    # копирует файлы, поднимает контейнер, настраивает nginx
#   SSH_KEY=~/.ssh/id_ed25519 LETSENCRYPT_EMAIL=you@example.com ./deploy.sh ssl

set -euo pipefail

MODE="${1:-check}"
SERVER_HOST="203.161.49.154"
SERVER_USER="root"
DOMAIN="eilat.coahlab.com"
REMOTE_DIR="${REMOTE_DIR:-/root/eilat_guide}"
CONTAINER_PORT="${CONTAINER_PORT:-8002}"
SSH_KEY="${SSH_KEY:-}"
LETSENCRYPT_EMAIL="${LETSENCRYPT_EMAIL:-}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "$SSH_KEY" ]; then
  SSH_OPTS+=(-i "$SSH_KEY")
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ssh_run() { ssh "${SSH_OPTS[@]}" "${SERVER_USER}@${SERVER_HOST}" "$@"; }

case "$MODE" in

check)
  echo "==> Правила сервера (/root/cf_docs/RULES.md) — прочитайте перед apply:"
  ssh_run "cat /root/cf_docs/RULES.md 2>/dev/null || echo '(файл не найден)'"
  echo
  echo "==> Работающие контейнеры:"
  ssh_run "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'"
  echo
  echo "==> Занятые порты 8000/8001/5100/${CONTAINER_PORT}:"
  ssh_run "ss -tlnp 2>/dev/null | grep -E ':(8000|8001|5100|${CONTAINER_PORT})\\b' || echo '(порт ${CONTAINER_PORT} свободен)'"
  echo
  echo "==> Существующие nginx server blocks (ищем, где лежат content.coahlab.com и т.п.):"
  ssh_run "grep -rl 'server_name' /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null || echo '(не найдено — уточните расположение конфигов)'"
  echo
  echo "==> DNS-проверка (A-запись ${DOMAIN}):"
  ssh_run "getent hosts ${DOMAIN} || echo '${DOMAIN} пока не резолвится — проверьте DNS'"
  echo
  echo "Дальше: посмотрите вывод выше и cf_docs/RULES.md, при необходимости поменяйте"
  echo "REMOTE_DIR / CONTAINER_PORT, затем запустите: ./deploy.sh apply"
  ;;

apply)
  echo "==> 1. Копирую файлы сайта в ${REMOTE_DIR}"
  ssh_run "mkdir -p ${REMOTE_DIR}"
  rsync -avz --delete -e "ssh ${SSH_OPTS[*]}" \
    --exclude 'deploy.sh' --exclude 'DEPLOY.md' \
    "${SCRIPT_DIR}/" "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/"

  echo "==> 2. Собираю и поднимаю контейнер eilat_guide (порт ${CONTAINER_PORT})"
  ssh_run "cd ${REMOTE_DIR} && CONTAINER_PORT=${CONTAINER_PORT} docker compose up -d --build"

  echo "==> 3. Настраиваю nginx-прокси хоста для ${DOMAIN}"
  ssh_run bash -s -- "$DOMAIN" "$CONTAINER_PORT" <<'REMOTE_SCRIPT'
set -euo pipefail
DOMAIN="$1"
PORT="$2"

if [ -d /etc/nginx/sites-available ]; then
  CONF="/etc/nginx/sites-available/${DOMAIN}"
  ENABLE_CMD="ln -sf ${CONF} /etc/nginx/sites-enabled/${DOMAIN}"
else
  CONF="/etc/nginx/conf.d/${DOMAIN}.conf"
  ENABLE_CMD="true"
fi

cat > "$CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

eval "$ENABLE_CMD"
nginx -t
systemctl reload nginx
echo "nginx: прокси ${DOMAIN} -> 127.0.0.1:${PORT} применён (файл: ${CONF})"
REMOTE_SCRIPT

  echo "==> Готово. Проверка: curl -I http://${DOMAIN}/ (после того как DNS укажет на ${SERVER_HOST})"
  echo "    Для SSL запустите: ./deploy.sh ssl"
  ;;

ssl)
  if [ -z "$LETSENCRYPT_EMAIL" ]; then
    echo "Укажите LETSENCRYPT_EMAIL=you@example.com" >&2
    exit 1
  fi
  ssh_run "certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m ${LETSENCRYPT_EMAIL} --redirect"
  echo "==> Готово: https://${DOMAIN}/"
  ;;

*)
  echo "Использование: ./deploy.sh [check|apply|ssl]" >&2
  exit 1
  ;;
esac
