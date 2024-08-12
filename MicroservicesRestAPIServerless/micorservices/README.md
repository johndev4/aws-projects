## Microservices

### Deployment

1. From root directory `MicroserviceUsingServerlessFramework`, navigate to `.docker` of `infrastructure` folder.

```bash
$ cd .\micorservices\.docker
```

2. Run the docker compose command and specify the name of the service to deploy

```bash
$ docker compose up [service_name]
```

**_Note: Make sure you are using `command: sh -c "echo \"Build and deploy Coffee service\" && cd /myservice/layer/nodejs && npm i && cd /myservice && npm i && npx sls deploy -s development"` inside the `docker-compose.yml` file._**
