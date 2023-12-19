docker build -f .\docker\Dockerfile.service -t video-convert-service --target production .
docker run -it video-convert-service
