#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { get } from "env-var";
import "source-map-support/register";
import { AppStack } from "../lib/app-stack";
import { EcrStack } from "../lib/ecr-stack";

dotenv.config();

const AWS_ACCOUNT = get("AWS_ACCOUNT").required().asString();
const AWS_REGION = get("AWS_REGION").required().asString();
const SERVICE = get("SERVICE").required().asString();
const STAGE = get("STAGE").required().asString();
const VERSION = get("VERSION").required().asString();

const app = new cdk.App();

const ecrStack = new EcrStack(app, `${SERVICE}-${STAGE}-ecr`, {
  description: `${SERVICE} ${STAGE} ecr`,
  service: SERVICE,
  stage: STAGE,
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION,
  },
});

new AppStack(app, `${SERVICE}-${STAGE}-app`, {
  description: `${SERVICE} ${STAGE} app`,
  service: SERVICE,
  stage: STAGE,
  env: {
    account: AWS_ACCOUNT,
    region: AWS_REGION,
  },
  webAppRepository: ecrStack.webAppRepository,
  version: VERSION,
});
