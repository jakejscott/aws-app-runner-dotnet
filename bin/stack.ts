#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AppStack } from "../lib/app-stack";
import { get } from "env-var";
import * as dotenv from "dotenv";

dotenv.config();

const AWS_ACCOUNT = get("AWS_ACCOUNT").required().asString();
const AWS_REGION = get("AWS_REGION").required().asString();
const SERVICE = get("SERVICE").required().asString();
const STAGE = get("STAGE").required().asString();

const app = new cdk.App();

new AppStack(app, `${SERVICE}-${STAGE}-app`, {
  description: `${SERVICE} ${STAGE} app`,
  service: SERVICE,
  stage: STAGE,
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION,
  },
});
