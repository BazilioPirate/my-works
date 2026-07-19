FROM nginx:alpine

COPY index.html style.css app.js data.js manifest.json /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons
COPY nginx-site.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
