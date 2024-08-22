## Microservices

### Prerequisites

- AWS CLI
- Node.js (v20)
- Docker

### DotENV

```bash
# For AWS deployment using Docker
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=

# Required environment variables for microservices Rest API serverless
PROJECT_NAME=
STAGE=dev

# Unbuffer the entire service
PYTHONUNBUFFERED=1
```

### Deployment

1. From root directory `MicroserviceUsingServerlessFramework`, navigate to `.docker` of `infrastructure` folder.

```bash
$ cd .\microservices\.docker
```

2. Run the docker compose command and specify the name of the service to deploy

```bash
$ docker compose up [service_name]
```

**_Note: Make sure you are using `command: sh -c "echo \"Build and deploy Coffee service\" && cd /myservice/layer/nodejs && npm i && cd /myservice && npm i && npx sls deploy -s dev"` inside the `docker-compose.yml` file._**

### Adding common dependencies

When you want to add dependencies for a specified service, you must install those dependencies in the `package.json` file located in both the root directory and the `layer/nodejs` directory of the service. The `package.json` file in layer/nodejs is for common dependencies for all the service’s AWS Lambdas in the cloud, while the `package.json` file in the root directory of the service is for offline use.

```bash
$ npm install [dependency_name]
```

In the future, if you have too many services, you may also add common dependencies for all microservices and automate the installation of these common dependencies. This approach makes it easier and faster for developers to install dependencies and prevents problematic missing dependencies after deployment.

## Serverless Offline for Local Environment

### Prerequisites

- Python

### Installation

1. Navigate to `microservices/offline` directory then execute this command:

```bash
$ pip install -r requirements.txt
```

2. After executing the command, install all dependencies that are defined on `package.json` by executing this command:

```
$ npm install
```

### Usage

```bash
$ npm run offline
```
