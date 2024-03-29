# Python
FROM python:3.11-slim as base

RUN set -ex \
    && RUN_DEPS=" \
    build-essential \
    tk-dev \
    mesa-common-dev \
    wget \
    " \
    && seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{} \
    && apt-get update && apt-get install -y --no-install-recommends $RUN_DEPS \
    && rm -rf /var/lib/apt/lists/*

RUN \
  wget \
    -O sqlite.tar.gz \
    https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release \
    && \
    tar xvfz sqlite.tar.gz

RUN \
  ./sqlite/configure --prefix=/usr && \
  make && \
  make install \
  && \
  sqlite3 --version

FROM base AS ai-search-elearning-base
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM ai-search-elearning-base AS ai-search-elearning-api

WORKDIR /app
COPY . .

EXPOSE 80
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
