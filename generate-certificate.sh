#!/bin/bash

docker run -it -v $(pwd)/config/ssl:/export frapsoft/openssl genrsa -des3 -passout pass:x -out /export/server.pass.key 2048
docker run -it -v $(pwd)/config/ssl:/export frapsoft/openssl rsa -passin pass:x -in /export/server.pass.key -out /export/server.key
rimraf $(pwd)/config/ssl/server.pass.key
docker run -it -v $(pwd)/config/ssl:/export frapsoft/openssl req -new -key /export/server.key -out /export/server.csr \
    -subj "/C=UK/ST=Warwickshire/L=Leamington/O=OrgName/OU=IT Department/CN=localhost"
docker run -it -v $(pwd)/config/ssl:/export frapsoft/openssl x509 -req -days 365 -in /export/server.csr -signkey /export/server.key -out /export/server.crt
