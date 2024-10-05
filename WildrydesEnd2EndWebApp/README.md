# Wildrydes End-to-end Web Application

## Deploy the application using SAM

The [AWS SAM CLI](https://aws.amazon.com/serverless/sam/) provides functionality for building and testing serverless applications. It makes it easy to sync your changes to your deployment in AWS for rapid development.

To use the [AWS SAM CLI](https://aws.amazon.com/serverless/sam/), you need the following:

- An AWS Account - Create an account at https://aws.amazon.com
- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js](https://nodejs.org/en/), including the npm package management tool.

To build and deploy your application, run the following in your shell:

```bash
$ sam build
$ sam deploy --guided --config-env [stage] --profile [aws_profile] --region [aws_region]
```

The first command will build the source of your application. The second command will package and deploy your application to your AWS account, with a series of prompts:

- **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name. The default for this project is `aws-app-composer-basic-api`.
- **AWS Region**: The AWS region you want to deploy your app to.
- **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
- **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. This prompt acknowledges your permission to create IAM Roles as part of the deployment.
- **Disable rollback**: By default if a deployment fails all new changes as part of the deployment will be rolled back. You can change this behavior to leave the deployment in a partial state for debugging purposes.
- **\<Route\> may not have authorization defined, is this okay?**: Each route in this example is unauthorized for simplicity. To deploy, confirm it is ok that each route does not have authorization. Authorization can be added later at any time.
- **Save arguments to samconfig.toml**: If set to yes, your choices will be saved / updated to the [`samconfig.toml`](./samconfig.toml) configuration file inside the project, so that in the future you can just re-run `sam deploy` and other commands without parameters to deploy changes to your application.

## Cleanup

You can run the following command to cleanup (delete) all the resources created for this application in your AWS Account:

```bash
$ sam delete --config-env [stage] --profile [aws_profile] --region [aws_region]
```

## Upload public files to S3 bucket

You can run the following command to upload the WildRydes website files on S3 bucket

```bash
$ aws s3 cp wildrydes-static-website s3://[website_bucket_name] --recursive --profile [aws_profile] --region [aws_region]
```
