## Infrastructure

### Build and run the Docker image of customamazonlinux

1. From root directory `MicroserviceUsingServerlessFramework`, navigate to `.docker` of `infrastructure` folder.

```bash
$ cd .\infrastructure\.docker\
```

2. Build the docker image with the command.

```bash
$ docker build -t [user]/customamazonlinux .
```

3. On the `infrastructure` directory, run the following command to mount the diretory inside the docker image.

```bash
docker run -it --env-file="../../environments/.env" -v .:/infrastructure --workdir="/infrastructure"  --memory=4g --memory-swap=4g --memory-swappiness=0 --entrypoint=/bin/bash [user]/customamazonlinux
```

### Build the cloud architecture by creating the stack

1. Once inside the docker container, navigate to "infrastructure" directory.

```bash
$ cd infrastructure
```

2. Then execute the cloudformation command to create stack

```bash
$ aws cloudformation create-stack --stack-name [PROJECT_NAME]-[Stage]-[TEMPLATE_NAME] --template-body file://cf_templates/[TEMPLATE_NAME].yaml --parameters ParameterKey=ProjectName,ParameterValue=[PROJECT_NAME] ParameterKey=Stage,ParameterValue=[Stage]
```

**_Note: Add `--capabilities CAPABILITY_NAMED_IAM` flag for `microservicesFunctionRole.yaml` template._**
