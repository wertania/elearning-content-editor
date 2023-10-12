cd..
npm run build

cd .dev

Copy-Item -Path ".\..\dist\*" -Destination ".\pb_public" -Recurse -Force

docker build -f pocketbase.dockerfile -t pocketbase-dev .
docker run -it -p 8080:8080 -v $PWD/pb_data:/pb/pb_data -v $PWD/pb_public:/pb/pb_public pocketbase-dev