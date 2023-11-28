docker build -f .\dockerfile.api -t videoworkflowapi .
docker run -it -p 8000:8000 -v $(pwd)/working:/app/working videoworkflowapi
