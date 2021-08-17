FROM appsoa/docker-alpine-htpasswd AS base
ARG FOO=test
RUN htpasswd -Bbn "${FOO}" "${FOO}" > /tmp/.htpasswd
### Working version
# ARG FOO=test
# RUN mkdir /app
# WORKDIR /app
# RUN htpasswd -Bbn "$FOO" "$FOO" > /app/test

FROM appsoa/docker-alpine-htpasswd AS final
COPY --from=base //tmp/.htpasswd /tmp/test

### Working version
# WORKDIR /
# COPY --from=base /app/test /tmp/test
ENTRYPOINT ["cat", "/tmp/test"]
