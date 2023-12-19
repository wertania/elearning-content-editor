docker build -f .\docker\Dockerfile.api -t video-convert-api --target production .
docker run -it -p 8000:8000 -v ${PWD}/working:/app/working video-convert-api
