FROM traefik:v3.0

ARG DOCKER_GID=111
RUN addgroup -g $DOCKER_GID docker \
    && adduser -S -G docker traefik

USER traefik