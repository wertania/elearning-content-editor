docker build -f .\video-convert\docker\Dockerfile.video-convert.service -t video-convert-service .
docker run -it video-convert-service
