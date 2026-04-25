#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FirstBridgeStack } from "./firstbridge-stack";

const app = new cdk.App();

new FirstBridgeStack(app, "FirstBridgeStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
});
