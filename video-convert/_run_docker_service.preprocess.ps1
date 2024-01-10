cd..
docker build -f .\video-convert\docker\Dockerfile.preprocess.service -t video-preprocess-service .
docker run -it video-preprocess-service