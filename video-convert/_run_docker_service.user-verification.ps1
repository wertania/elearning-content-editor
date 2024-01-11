cd..
docker build -f .\video-convert\docker\Dockerfile.user-verification.service -t user-verification-service .
docker run -it user-verification-service