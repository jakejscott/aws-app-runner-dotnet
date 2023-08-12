# aws app runner dotnet

Install CDK cli

```
npm install -g aws-cdk
```

Install dependencies

```
npm install
```

Create a `.env` file and add the following variables:

```
AWS_ACCOUNT=<AWS ACCOUNT ID>
AWS_REGION=<AWS REGION>
SERVICE=apprunner
STAGE=ft-0001  # feature, dev, staging or prod.
VERSION=0.0.1
```

Deploy ECR Stack

```
cdk deploy apprunner-ft-0001-ecr --profile dev
```

Push to ECR

```
aws ecr get-login-password --profile dev
docker login --username AWS -p <ECR_PASSWORD> <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com
docker-compose build webapp
docker-compose push webapp
```

Deploy App stack

```
cdk deploy apprunner-ft-0001-app --profile dev
```

Destroy stacks

```
cdk destroy apprunner-ft-0001-app --profile dev
cdk destroy apprunner-ft-0001-ecr --profile dev
```
