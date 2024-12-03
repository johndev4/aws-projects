## Infrastructure

### Prerequisites

- AWS CLI

### Build the Cloud Architecture by Creating the CloudFormation Stacks

1. Once inside the docker container, navigate to "infrastructure" directory.

```bash
$ cd infrastructure
```

2. Then execute the cloudformation command to create stack

```bash
$ aws cloudformation create-stack --stack-name [PROJECT_NAME]-[Stage]-[TEMPLATE_NAME] --template-body file://cf_templates/[TEMPLATE_NAME].yaml --parameters ParameterKey=ProjectName,ParameterValue=[PROJECT_NAME] ParameterKey=Stage,ParameterValue=[Stage] --profile [aws_profile]
```

**_Note: Add `--capabilities CAPABILITY_NAMED_IAM` flag for `serverlessapp.yaml` template._**
