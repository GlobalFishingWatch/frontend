#################################################################################
# Generate htpasswd file
#################################################################################
# FROM appsoa/docker-alpine-htpasswd as htpasswd
# ARG BASIC_AUTH_USER=gfw
# ARG BASIC_AUTH_PASS=default
# ENV BASIC_AUTH_USER $BASIC_AUTH_USER
# ENV BASIC_AUTH_PASS $BASIC_AUTH_PASS
# RUN htpasswd -Bbn "$BASIC_AUTH_USER" "$BASIC_AUTH_PASS" > /home/.htpasswd

#################################################################################
# Actual application to run
#################################################################################
# Using stable version that uses alpine 3.14 to fix build errors
# https://github.com/alpinelinux/docker-alpine/issues/182
FROM nginx:stable-alpine as production

COPY ./nginx.conf /etc/nginx/nginx.template
# COPY --from=htpasswd /home/.htpasswd /home/.htpasswd
# RUN cat /home/.htpasswd >> /etc/nginx/.htpasswd
COPY ./entrypoint.sh entrypoint.sh
COPY ./ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]

