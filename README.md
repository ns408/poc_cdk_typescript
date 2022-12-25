# README


## Reference

- https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html
- https://aws.amazon.com/getting-started/guides/deploy-webapp-ec2/
- https://aws.amazon.com/blogs/containers/continuous-delivery-of-amazon-eks-clusters-using-aws-cdk-and-cdk-pipelines/

## Prerequisites

### Install NVM and node

```bash
# This will be obsolete so check the official NVM README
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install the latest LTS node version
nvm install --lts --latest-npm
```

### Install typescript and aws-cdk globally

```bash
for item in typescript aws-cdk; do
  npm update -g $item || npm install -g $item
done
```
