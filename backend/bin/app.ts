#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/data-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "eu-west-2",
};

const dataStack = new DataStack(app, "MiniWebsiteDataStack", { env });

new ApiStack(app, "MiniWebsiteApiStack", {
  env,
  table: dataStack.table,
  imagesBucket: dataStack.imagesBucket,
});
