import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as elasticache from "aws-cdk-lib/aws-elasticache";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";

export class FirstBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── VPC ──
    const vpc = new ec2.Vpc(this, "FirstBridgeVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // ── Security Groups ──
    const dbSg = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc,
      description: "FirstBridge PostgreSQL",
      allowAllOutbound: false,
    });

    const redisSg = new ec2.SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      description: "FirstBridge Redis",
      allowAllOutbound: false,
    });

    const appSg = new ec2.SecurityGroup(this, "AppSecurityGroup", {
      vpc,
      description: "FirstBridge App",
    });

    dbSg.addIngressRule(appSg, ec2.Port.tcp(5432), "App to Postgres");
    redisSg.addIngressRule(appSg, ec2.Port.tcp(6379), "App to Redis");

    // ── RDS PostgreSQL ──
    const dbCredentials = new secretsmanager.Secret(this, "DbCredentials", {
      secretName: "firstbridge/db-credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "firstbridge" }),
        generateStringKey: "password",
        excludePunctuation: true,
        passwordLength: 32,
      },
    });

    const database = new rds.DatabaseInstance(this, "FirstBridgeDb", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MEDIUM
      ),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [dbSg],
      credentials: rds.Credentials.fromSecret(dbCredentials),
      databaseName: "firstbridge",
      storageEncrypted: true,
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ── ElastiCache Redis ──
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(
      this,
      "RedisSubnetGroup",
      {
        description: "FirstBridge Redis subnet group",
        subnetIds: vpc.privateSubnets.map((s) => s.subnetId),
      }
    );

    const redisCluster = new elasticache.CfnCacheCluster(
      this,
      "FirstBridgeRedis",
      {
        engine: "redis",
        cacheNodeType: "cache.t4g.micro",
        numCacheNodes: 1,
        vpcSecurityGroupIds: [redisSg.securityGroupId],
        cacheSubnetGroupName: redisSubnetGroup.ref,
      }
    );

    // ── S3 Bucket for Bedrock Knowledge Base data ──
    const kbBucket = new s3.Bucket(this, "KnowledgeBaseBucket", {
      bucketName: `firstbridge-kb-${this.account}-${this.region}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ── IAM Role for Bedrock access ──
    const bedrockRole = new iam.Role(this, "BedrockAccessRole", {
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      description: "Role for Bedrock Knowledge Base to access S3",
    });

    kbBucket.grantRead(bedrockRole);

    // ── IAM Policy for app to invoke Bedrock ──
    const bedrockInvokePolicy = new iam.ManagedPolicy(
      this,
      "BedrockInvokePolicy",
      {
        description: "Allow invoking Bedrock models and guardrails",
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "bedrock:InvokeModel",
              "bedrock:InvokeModelWithResponseStream",
              "bedrock:ApplyGuardrail",
              "bedrock:Retrieve",
              "bedrock:RetrieveAndGenerate",
            ],
            resources: ["*"],
          }),
        ],
      }
    );

    // ── Bedrock Guardrail ──
    const guardrail = new bedrock.CfnGuardrail(this, "FirstBridgeGuardrail", {
      name: "FirstBridgeGuardrail",
      blockedInputMessaging:
        "I cannot help with that request. Let me guide you in a different direction.",
      blockedOutputsMessaging:
        "I need to rephrase my response. Let me try again.",
      contentPolicyConfig: {
        filtersConfig: [
          {
            type: "SEXUAL",
            inputStrength: "HIGH",
            outputStrength: "HIGH",
          },
          {
            type: "VIOLENCE",
            inputStrength: "HIGH",
            outputStrength: "HIGH",
          },
          {
            type: "HATE",
            inputStrength: "HIGH",
            outputStrength: "HIGH",
          },
          {
            type: "INSULTS",
            inputStrength: "MEDIUM",
            outputStrength: "HIGH",
          },
        ],
      },
      topicPolicyConfig: {
        topicsConfig: [
          {
            name: "DirectAcademicAnswers",
            definition:
              "Providing direct answers to homework, exam questions, or academic assignments",
            examples: [
              "What is the answer to question 3?",
              "Solve this equation for me",
              "Write my essay about Shakespeare",
            ],
            type: "DENY",
          },
          {
            name: "TherapeuticClaims",
            definition:
              "Making therapeutic claims, diagnosing mental health conditions, or presenting as a mental health professional",
            examples: [
              "You have depression",
              "I diagnose you with anxiety",
              "As your therapist, I recommend",
            ],
            type: "DENY",
          },
          {
            name: "OutcomePromises",
            definition:
              "Making promises about academic outcomes, grades, job placement, or guaranteed results",
            examples: [
              "You will definitely get an A",
              "This guarantees you a job",
              "I promise you will pass",
            ],
            type: "DENY",
          },
        ],
      },
    });

    // ── Outputs ──
    new cdk.CfnOutput(this, "DatabaseEndpoint", {
      value: database.dbInstanceEndpointAddress,
      description: "PostgreSQL endpoint",
    });

    new cdk.CfnOutput(this, "DatabasePort", {
      value: database.dbInstanceEndpointPort,
    });

    new cdk.CfnOutput(this, "RedisEndpoint", {
      value: redisCluster.attrRedisEndpointAddress,
      description: "Redis endpoint",
    });

    new cdk.CfnOutput(this, "RedisPort", {
      value: redisCluster.attrRedisEndpointPort,
    });

    new cdk.CfnOutput(this, "KnowledgeBaseBucketName", {
      value: kbBucket.bucketName,
    });

    new cdk.CfnOutput(this, "GuardrailId", {
      value: guardrail.attrGuardrailId,
      description: "Bedrock Guardrail ID",
    });

    new cdk.CfnOutput(this, "DbCredentialsSecretArn", {
      value: dbCredentials.secretArn,
    });

    new cdk.CfnOutput(this, "BedrockInvokePolicyArn", {
      value: bedrockInvokePolicy.managedPolicyArn,
      description: "Attach this policy to your app role for Bedrock access",
    });
  }
}
