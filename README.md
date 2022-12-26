# README



## Reference


- [Work-with-cdk-typescript]
- [Deploy-webapp-ec2]
- [Continuous-delivery-of-amazon-eks-clusters-using-aws-cdk-and-cdk-pipelines]
## Prerequisites

### Install NVM and node

```bash
# This will be obsolete so check the official NVM README
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install the latest LTS node version
nvm install --lts --latest-npm
```

### Install typescript and aws-cdk

```bash
for item in typescript aws-cdk; do
  npm update -g $item || npm install -g $item
done
```

### Use global tools

Keep both components up to date but little risk in always using the latest versions. Reference: [Using local tsc and cdk]

```bash
# Initialise
cdk init --language typescript

# Build
tsc

# Run CDK Toolkit command
cdk ...
```

### Use local tools

```bash
export cdk="npx aws-cdk"

# Initialise
$cdk init --language typescript

# Build
npm run build

# Run CDK Toolkit command
npm run cdk ...
or
$cdk ...
```

### Import the modules needed

```bash
npm i @aws-cdk/aws-ec2 @aws-cdk/aws-iam @aws-cdk/aws-s3-assets cdk-ec2-key-pair
```

## Useful commands

The `cdk.json` file tells the CDK Toolkit how to execute your app.

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

[Using local tsc and cdk]: https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html#typescript-local
[Work-with-cdk-typescript]: https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html
[Deploy-webapp-ec2]: https://aws.amazon.com/getting-started/guides/deploy-webapp-ec2/
[Continuous-delivery-of-amazon-eks-clusters-using-aws-cdk-and-cdk-pipelines]: https://aws.amazon.com/blogs/containers/continuous-delivery-of-amazon-eks-clusters-using-aws-cdk-and-cdk-pipelines/
[cdkworkshop.com]: https://cdkworkshop.com/
