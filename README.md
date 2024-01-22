# decoder-service

To run the server run and listen to new changes run 
`npm run dev`

to build docker image run
`docker build . --file Dockerfile --tag decoder-service:0.0.1`

to run docker image
`docker run -p 8001:8000 decoder-service:0.0.1`
will be available under `http://localhost:8001` port can be changed in the previous command

Project structure
* routes - application routes
  * public - routes without protection
  * internal - routes with basic auth protection
* config - middlewares, logger config, ...
* models - DB models
* services - business logic


> **Warning** 
> 
> **Github action might fail**
> 
> 
> We try to fetch contract service image from ECR which require token
> the token is valid for 12 hours, and we will need to update it.
> we have followup ticket to fix it for permanent solution but until then
> we can generate new token by using this command and update it in the 
> Github secrets
> 
> to get a new token run this command
> ``aws ecr get-login-password --region us-east-1``

