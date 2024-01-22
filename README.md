# Decoder

A service to decode blockchain transaction, logs and errors.
The service expose two endpoints
1. POST /api/internal/transaction/decode
2. POST /api/internal/logs/decode

### Run the service locally

To run the server run and listen to new changes run 
`npm run dev`

to build docker image run
`docker build . --file Dockerfile --tag decoder:0.0.1`

to run docker image
`docker run -p 8001:8000 decoder:0.0.1`
will be available under `http://localhost:8001` port can be changed in the previous command
