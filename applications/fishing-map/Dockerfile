#################################################################################
# Actual application to run
#################################################################################
FROM nginx as production
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default

RUN apt-get update && apt-get install openssl -y

COPY ./nginx.conf /etc/nginx/nginx.template
RUN echo -n ${BASIC_AUTH_USER}: >> /etc/nginx/.htpasswd
RUN echo ${BASIC_AUTH_PASS} | openssl passwd -apr1 -stdin >> /etc/nginx/.htpasswd
COPY ./entrypoint.sh entrypoint.sh
COPY ./html /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
