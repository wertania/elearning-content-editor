
## Docker

```
docker build -f pocketbase.dockerfile -t pocketbase-dev .
docker run -it -p 8080:8080 -v $PWD/pb_data:/pb/pb_data -v $PWD/pb_public:/pb/pb_public pocketbase-dev
```

## Running using `docker compose`

To start all services needed to run the project, run the following commands:

```sh
cd .dev
docker compose up
```

Note that `video-convert-service` is a one-off service. It terminates when it has finished its work. Therefore, it has to be restarted manually using `docker compose up video-convert-service` inside `.dev/`.

