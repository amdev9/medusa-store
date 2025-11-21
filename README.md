
# Init project
npm i // install dependencies
npm run docker:up // run docker
docker compose logs -f // to see logs
npm run docker:down // stop docker

<!-- {your_publishable_api_key} -->

# Endpoint curl examples

curl 'http://localhost:9000/store/currency/convert?amount=200&from=USD&to=EUR' \
-H 'x-publishable-api-key: pk_e5ac14e5fb0ee1b9f0af8d1cd2ffed632aece2243e5cb6c7d876d6860c7b097b'
{"message":"173.16"}


curl 'http://localhost:9000/store/currency/convert?amount=100&from=USD&to=EUR' \
-H 'x-publishable-api-key: pk_e5ac14e5fb0ee1b9f0af8d1cd2ffed632aece2243e5cb6c7d876d6860c7b097b'
{"message":"86.58"}


curl 'http://localhost:9000/store/currency/convert?amount=100&to=EUR' \
-H 'x-publishable-api-key: pk_e5ac14e5fb0ee1b9f0af8d1cd2ffed632aece2243e5cb6c7d876d6860c7b097b'
{"message":"Initial country code not found or have invalid format"}


curl 'http://localhost:9000/store/currency/convert?amount=100&from=USD&to=' \
-H 'x-publishable-api-key: pk_e5ac14e5fb0ee1b9f0af8d1cd2ffed632aece2243e5cb6c7d876d6860c7b097b'
{"message":"Result country code not defined or have invalid format"}

curl 'http://localhost:9000/store/currency/convert?amount=10a&from=USD&to=EUR' \
-H 'x-publishable-api-key: pk_e5ac14e5fb0ee1b9f0af8d1cd2ffed632aece2243e5cb6c7d876d6860c7b097b'
{"message":"Initial amount not defined or not valid"}







