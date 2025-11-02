FROM eclipse-temurin:24-jdk
LABEL authors="eiztrips"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends bash procps curl unzip && rm -rf /var/lib/apt/lists/*

COPY dev-entrypoint.sh /usr/local/bin/dev-entrypoint.sh
RUN chmod +x /usr/local/bin/dev-entrypoint.sh

VOLUME ["/app"]
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/dev-entrypoint.sh"]
