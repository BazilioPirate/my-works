# Деплой eilat.coahlab.com

Сайт — статические файлы (`index.html`, `style.css`, `app.js`, `data.js`, `manifest.json`, `icons/`), сборка не нужна.

**Важно:** деплой нельзя выполнить из сессии Claude Code on the web — сетевая политика этой песочницы разрешает только HTTPS через прокси и блокирует произвольный TCP (в т.ч. SSH/22). Выполняйте шаги ниже с машины, у которой есть обычный SSH-доступ к серверу `203.161.49.154`.

## Вариант А — автоматически (deploy.sh)

```bash
cd eilat-guide
chmod +x deploy.sh
SSH_KEY=~/.ssh/id_ed25519 LETSENCRYPT_EMAIL=you@example.com ./deploy.sh
```

Скрипт сам:
1. создаёт `/var/www/eilat.coahlab.com/` на сервере;
2. копирует туда файлы сайта через `rsync`;
3. пишет nginx server block и подключает его в `sites-enabled` (рядом с `content.coahlab.com`, `bizlog.coahlab.com`);
4. (если задан `LETSENCRYPT_EMAIL`) выпускает SSL через certbot.

Без `LETSENCRYPT_EMAIL` скрипт остановится перед certbot — тогда шаг 4 нужно выполнить вручную (см. ниже) после того, как заработает DNS.

## Вариант Б — вручную, шаг за шагом

1. **Скопировать файлы на сервер:**
   ```bash
   rsync -avz --delete eilat-guide/ root@203.161.49.154:/var/www/eilat.coahlab.com/
   ```
   (Если на сервере уже принят другой путь для сайтов — например `/home/*/sites/` — используйте его вместо `/var/www/...`, посмотрите на структуру `content.coahlab.com` рядом.)

2. **nginx server block** — создать `/etc/nginx/sites-available/eilat.coahlab.com`:
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name eilat.coahlab.com;

       root /var/www/eilat.coahlab.com;
       index index.html;

       gzip on;
       gzip_types text/css application/javascript application/json text/plain image/svg+xml;
       gzip_min_length 512;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(?:css|js|json|png|jpg|jpeg|webp|svg|ico)$ {
           expires 7d;
           add_header Cache-Control "public";
       }

       location = /manifest.json {
           add_header Content-Type application/manifest+json;
       }
   }
   ```
   Затем:
   ```bash
   ln -s /etc/nginx/sites-available/eilat.coahlab.com /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

3. **DNS.** Убедитесь, что A-запись `eilat.coahlab.com` указывает на `203.161.49.154`. Без этого шаги 4–5 не сработают.

4. **SSL (Let's Encrypt / certbot):**
   ```bash
   certbot --nginx -d eilat.coahlab.com --agree-tos -m you@example.com --redirect
   ```
   Certbot сам допишет `listen 443 ssl` и редирект с 80 на 443 в конфиг из шага 2.

5. **Проверка:**
   ```bash
   curl -I https://eilat.coahlab.com/
   ```
   Должно быть `200 OK`. Дальше — открыть сайт с телефона по мобильной сети (перед поездкой 19 июля), проверить меню, Waze-кнопки, чек-листы.

## Примечания

- В задаче домен был указан как `eilat.coahlab.con` — считаю это опечаткой, использован `.com`, как и в остальном тексте ТЗ.
- Точный путь сайтов на сервере (`/var/www/...` или другой) не подтверждён — я не смог подключиться по SSH из этой сессии, чтобы посмотреть, как размещены `content.coahlab.com` и `bizlog.coahlab.com`. Проверьте перед запуском `deploy.sh` и поправьте `REMOTE_DIR` в скрипте при необходимости.
