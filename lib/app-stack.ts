import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface AppStackProps extends cdk.StackProps {
  stage: string;
  service: string;
}

export class AppStack extends cdk.Stack {
  private props: AppStackProps;

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);
    this.props = props;
  }
}
