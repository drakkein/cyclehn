FROM nginx
COPY nginx.conf /usr/share/nginx/conf/nginx.conf
COPY build /usr/share/nginx/html