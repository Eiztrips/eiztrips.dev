#!/usr/bin/env bash
set -eo pipefail

cd /app || exit 0

if [ -f "./mvnw" ]; then
  echo "Detected Maven wrapper. Running: ./mvnw spring-boot:run"
  chmod +x ./mvnw
  export SPRING_DEVTOOLS_RESTART_ENABLED=true
  exec ./mvnw -DskipTests=true spring-boot:run -Dspring-boot.run.fork=false
elif [ -f "./gradlew" ]; then
  echo "Detected Gradle wrapper. Running: ./gradlew bootRun"
  chmod +x ./gradlew
  export SPRING_DEVTOOLS_RESTART_ENABLED=true
  exec ./gradlew bootRun --no-daemon
else
  JAR=$(ls /app/target/*.jar 2>/dev/null | head -n1 || true)
  if [ -n "$JAR" ]; then
    echo "Running jar: $JAR"
    exec java -jar "$JAR"
  fi

  echo "No wrapper or jar found; container will stay up. Mount sources and run mvnw/gradlew from host or rebuild the image."
  tail -f /dev/null
fi

