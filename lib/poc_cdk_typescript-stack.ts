import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

//import * as ec2 from "@aws-cdk/aws-ec2";            // Allows working with EC2 and VPC resources
//import * as iam from "@aws-cdk/aws-iam";            // Allows working with IAM resources
//import * as s3assets from "@aws-cdk/aws-s3-assets"; // Allows managing files with S3
import * as keypair from "cdk-ec2-key-pair";        // Helper to create EC2 SSH keypairs
import * as path from "path";                       // Helper for working with file paths

import variablesFile from '../variables_file.json'; // Import from a file

export class PocCdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // console.log(variablesFile.vpcid)
    const vpc = cdk.aws_ec2.Vpc.fromLookup(this, 'VPC', { vpcId: variablesFile.vpcid }
      // {tags: {'aws-cdk:Name': variablesFile.vpcname}}
    );

    //ec2.Vpc.fromVpcAttributes(this, 'MyVPC', {
    //  vpcId: variablesFile.vpcid,
    //});

    // Create a key pair to be used with this EC2 Instance
    const key = new keypair.KeyPair(this, "KeyPair", {
      name: "cdk-keypair",
      description: "Key Pair created with CDK Deployment",
    });
    key.grantReadOnPublicKey;

    // Security group for the EC2 instance
    const securityGroup = new cdk.aws_ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow SSH (TCP port 22) and HTTP (TCP port 80) in",
      allowAllOutbound: true,
    });

    // Allow SSH access on port tcp/22
    securityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(variablesFile.whitelistIP),
      cdk.aws_ec2.Port.tcp(22),
      "Allow SSH Access"
    );

    // Allow HTTP access on port tcp/80
    securityGroup.addIngressRule(
      cdk.aws_ec2.Peer.ipv4(variablesFile.whitelistIP),
      cdk.aws_ec2.Port.tcp(80),
      "Allow HTTP Access"
    );

    // IAM role to allow access to other AWS services
    const role = new cdk.aws_iam.Role(this, "ec2Role", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // IAM policy attachment to allow access to
    role.addManagedPolicy(
      cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Look up the AMI Id for the Amazon Linux 2 Image with CPU Type X86_64
    const ami = new cdk.aws_ec2.AmazonLinuxImage({
      generation: cdk.aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: cdk.aws_ec2.AmazonLinuxCpuType.X86_64,
    });

    // Create the EC2 instance using the Security Group, AMI, and KeyPair defined.
    const ec2Instance = new cdk.aws_ec2.Instance(this, "MyInstance", {
      vpc,
      instanceType: cdk.aws_ec2.InstanceType.of(
        cdk.aws_ec2.InstanceClass.T2,
        cdk.aws_ec2.InstanceSize.MICRO
      ),
      machineImage: ami,
      securityGroup: securityGroup,
      keyName: key.keyPairName,
      role: role,
    });

    // Use an asset to allow uploading files to S3, and then download it to the EC2 instance as part of the user data

    // --- Sample App ---
    // Upload the sample app  to S3
    const sampleAppAsset = new cdk.aws_s3_assets.Asset(this, "SampleAppAsset", {
      path: path.join(__dirname, "../../SampleApp"),
    });

    // Allow EC2 instance to read the file
    sampleAppAsset.grantRead(role);

    // Download the file from S3, and store the full location and filename as a variable
    const sampleAppFilePath = ec2Instance.userData.addS3DownloadCommand({
      bucket: sampleAppAsset.bucket,
      bucketKey: sampleAppAsset.s3ObjectKey,
    });

    // --- Sample App ---

    // --- Configuration Script ---
    // Upload the configuration file to S3
    const configScriptAsset = new cdk.aws_s3_assets.Asset(this, "ConfigScriptAsset", {
      path: path.join(__dirname, "../../SampleApp/configure_amz_linux_sample_app.sh"),
    });

    // Allow EC2 instance to read the file
    configScriptAsset.grantRead(ec2Instance.role);

    // Download the file from S3, and store the full location and filename as a variable
    const configScriptFilePath = ec2Instance.userData.addS3DownloadCommand({
      bucket: configScriptAsset.bucket,
      bucketKey: configScriptAsset.s3ObjectKey,
    });

    // Add a line to the user data to execute the downloaded file
    ec2Instance.userData.addExecuteFileCommand({
      filePath: configScriptFilePath,
      arguments: sampleAppFilePath,
    });

    // Create outputs for connecting

    // Output the private IP address of the EC2 instance
    new cdk.CfnOutput(this, "IP Address", {
      value: ec2Instance.instancePrivateIp,
    });

    // Command to download the SSH key
    new cdk.CfnOutput(this, "Download Key Command", {
      value:
        "aws secretsmanager get-secret-value --secret-id ec2-ssh-key/cdk-keypair/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem",
    });

    // Command to access the EC2 instance using SSH
    new cdk.CfnOutput(this, "ssh command", {
      value:
        "ssh -i cdk-key.pem -o IdentitiesOnly=yes ec2-user@" +
        ec2Instance.instancePrivateIp,
    });

    // --- Configuration Script ---

  }
}