FROM appsoa/docker-alpine-htpasswd AS base
ARG FOO=test
RUN mkdir /app
WORKDIR /app
# ENV FOO $FOO
RUN htpasswd -Bbn "$FOO" "$FOO" > /app/test

FROM appsoa/docker-alpine-htpasswd AS final
WORKDIR /
# ARG FOO=test
COPY --from=base /app/test /tmp/test
ENTRYPOINT ["cat", "/tmp/test"]
