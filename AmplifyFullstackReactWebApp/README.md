# Full Stack React Web Application with AWS Amplify

### Deploy Amplify Cloud sandbox

Let’s initialize the Amplify backend by deploying the code on the Amplify Cloud sandbox to test our frontend locally. Every time you make changes to your Amplify backend code on your local machine, it will re-deploy on the AWS cloud. Note that this is different from CI/CD deployment on the AWS cloud using a Git repository. In CI/CD (Continuous Integration and Continuous Delivery), after you push your committed code to your repository, Amplify will automatically trigger the build process of AWS resources for your application, including the frontend (not just the Amplify backend).

1. Open a new terminal window, navigate to your app's root folder (expensetracker), and run the following command to deploy cloud resources into an isolated development space so you can iterate fast.

```bash
$ npx ampx sandbox --profile [aws_profile] --identifier [identifier_name]
```

2. After the cloud sandbox has been fully deployed, your terminal will display a confirmation message and the `amplify_outputs.json` file will be generated and added to your project. This deployment will take several minutes to complete.

### Delete Amplify Cloud sandbox

1. Open a new terminal window, navigate to your app's root folder (expensetracker), and run the following command to delete the cloud resources from isolated development space.

```bash
$ npx ampx sandbox delete --profile [aws_profile] --identifier [identifier_name]
```

**_References:_**

- [Deploy a Web App on AWS Amplify](https://aws.amazon.com/getting-started/guides/deploy-webapp-amplify/?ref=gsrchandson)
- [Build a Full Stack React Application](https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/?ref=gsrchandson&id=updated)
