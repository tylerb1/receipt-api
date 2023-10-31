## To run:

cd receipt-api
docker compose up dev --build

## With server running:

### Test receipt processing
curl -X POST -H "Content-Type: application/json" -d @./<test-json-file>.json http://localhost:3000/receipts/process

### Test getting points
curl -H 'Content-Type: application/json' http://localhost:3000/receipts/<id-returned-from-processing>/points