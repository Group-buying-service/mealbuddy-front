FROM nginx:latest

COPY ./mealbuddy-front/build /usr/share/nginx/html

COPY ./nginx/nginx/nginx.conf /etc/nginx/

COPY ./letsencrypt /etc/letsencrypt

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]