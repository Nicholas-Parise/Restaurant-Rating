FROM postgres:16-alpine

# copy SQL files and shell script
COPY sql/ /sql/
COPY run.sh /run.sh

RUN chmod +x /run.sh

# pass DATABASE_URL from Docker Compose
ENV DATABASE_URL=postgres://postgres:password@db:5432/fooddb

CMD ["/run.sh"]