FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /service

RUN apt-get update \
    ; apt-get install -y --no-install-recommends curl \
    ; rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x docker/entrypoint.sh

RUN groupadd --gid 10001 appuser \
    ; useradd --uid 10001 --gid appuser --create-home --shell /usr/sbin/nologin appuser \
    ; chown -R appuser:appuser /service

USER appuser

EXPOSE 8000

ENTRYPOINT ["/bin/sh", "docker/entrypoint.sh"]
