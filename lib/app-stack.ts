import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as cdk from "aws-cdk-lib";
import * as apprunner_l1 from "aws-cdk-lib/aws-apprunner";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface AppStackProps extends cdk.StackProps {
  stage: string;
  service: string;
  webAppRepository: ecr.Repository;
  version: string;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const webAppInstaceRole = new iam.Role(this, "WebAppInstanceRole", {
      assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
    });

    const webAppAccessRole = new iam.Role(this, "WebAppAccessRole", {
      assumedBy: new iam.ServicePrincipal("build.apprunner.amazonaws.com"),
    });

    props.webAppRepository.grantPull(webAppAccessRole);

    const webAppService = new apprunner.Service(this, "WebAppService", {
      serviceName: `${this.stackName}-webapp`,
      cpu: apprunner.Cpu.ONE_VCPU,
      memory: apprunner.Memory.TWO_GB,
      accessRole: webAppAccessRole,
      instanceRole: webAppInstaceRole,
      autoDeploymentsEnabled: false,
      vpcConnector: undefined,
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 8080,
          environmentVariables: {
            ASPNETCORE_ENVIRONMENT: "Production",
          },
        },
        repository: props.webAppRepository,
        tagOrDigest: props.version,
      }),
    });

    const webAppServiceCfn = webAppService.node.defaultChild as apprunner_l1.CfnService;

    webAppServiceCfn.healthCheckConfiguration = {
      protocol: "HTTP",
      path: "/",
      healthyThreshold: 1,
      unhealthyThreshold: 5,
      interval: 5,
      timeout: 2,
    };

    new cdk.CfnOutput(this, "WebAppServiceUrl", {
      value: `https://${webAppService.serviceUrl}`,
    });
  }
}
