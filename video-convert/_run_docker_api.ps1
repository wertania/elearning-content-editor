docker build -f .\dockerfile.api -t videoworkflowapi .
docker run -it -p 8000:8000 -v ${PWD}/working:/app/working videoworkflowapi
