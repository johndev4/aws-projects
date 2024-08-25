## Infrastructure

### Prerequisites

- AWS CLI
- Python
- Docker

### DotENV

```bash
# For AWS deployment using Docker
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=

# Required environment variables for CloudFormation stack name and AWS resources name
PROJECT_NAME=
STAGE=dev
```

### Build and Run the Docker Image of bobthebuilder

1. From root directory `MicroserviceUsingServerlessFramework`, navigate to `.docker` of `infrastructure` folder.

```bash
$ cd .\infrastructure\.docker\
```

2. Build the docker image with the command.

```bash
$ docker build -t [user]/bobthebuilder .
```

3. On the `infrastructure` directory, run the following command to mount the diretory inside the docker image.

```bash
docker run -it --env-file=".env.dev" -v .:/infrastructure --workdir="/infrastructure"  --memory=4g --memory-swap=4g --memory-swappiness=0 --entrypoint=/bin/bash [user]/bobthebuilder
```

### Build the Cloud Architecture by Creating the CloudFormation Stacks

1. Once inside the docker container, navigate to "infrastructure" directory.

```bash
$ cd infrastructure
```

2. Then execute the cloudformation command to create stack

```bash
$ aws cloudformation create-stack --stack-name [PROJECT_NAME]-[Stage]-[TEMPLATE_NAME] --template-body file://cf_templates/[TEMPLATE_NAME].yaml --parameters ParameterKey=ProjectName,ParameterValue=[PROJECT_NAME] ParameterKey=Stage,ParameterValue=[Stage]
```

**_Note: Add `--capabilities CAPABILITY_NAMED_IAM` flag for `microservicesFunctionRole.yaml` template._**

### Automate the CloudFormation Stack Creation in Order

You can automate the process of stack creation by using a Python script inside a Docker container. This will prevent errors if one stack depends on resources from another stack. By defining your environment variables in `.env.[stage]`, they will be imported into the Docker environment, which is different from your local environment. If you want to automate the process in your local environment, you need to install the required resources such as AWS CLI, Python, and the boto3 (AWS SDK) Python library, and define the required environment variables on your machine.

1. From root directory `MicroserviceUsingServerlessFramework`, navigate to `.docker` of `infrastructure` folder.

```bash
$ cd .\infrastructure\.docker\
```

2. Execute the docker compose service `create-stacks`.

```bash
$ docker compose up create-stack
```
