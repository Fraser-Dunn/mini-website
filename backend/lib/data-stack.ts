import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";

const GITHUB_PAGES_ORIGIN = "https://fraser-dunn.github.io";
const LOCAL_DEV_ORIGIN = "http://localhost:5173";

export class DataStack extends cdk.Stack {
  public readonly table: dynamodb.Table;
  public readonly imagesBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, "MinisTable", {
      tableName: "Minis",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.imagesBucket = new s3.Bucket(this, "ImagesBucket", {
      bucketName: `mini-website-images-${cdk.Aws.ACCOUNT_ID}`,
      // Keep ACL-based public access blocked (bucket owner enforced), but
      // allow a scoped bucket *policy* to grant public read on images/*.
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: [GITHUB_PAGES_ORIGIN, LOCAL_DEV_ORIGIN],
          allowedHeaders: ["*"],
        },
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ["*"],
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.imagesBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "PublicReadImages",
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ["s3:GetObject"],
        resources: [this.imagesBucket.arnForObjects("images/*")],
      })
    );
  }
}
