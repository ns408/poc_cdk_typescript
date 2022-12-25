import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from "@aws-cdk/aws-ec2";            // Allows working with EC2 and VPC resources
import * as iam from "@aws-cdk/aws-iam";            // Allows working with IAM resources
import * as s3assets from "@aws-cdk/aws-s3-assets"; // Allows managing files with S3
import * as keypair from "cdk-ec2-key-pair";        // Helper to create EC2 SSH keypairs
import * as path from "path";                       // Helper for working with file paths

import variablesFile from '../variables_file.json'; // Import from a file

export class PocCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'PocCdkTypescriptQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
