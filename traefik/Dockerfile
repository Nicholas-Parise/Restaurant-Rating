FROM traefik:v3.0

COPY traefik.yml /etc/traefik/traefik.yml

ARG DOCKER_GID=111
RUN addgroup -g $DOCKER_GID docker \
    && adduser -S -G docker traefik

USER traefik