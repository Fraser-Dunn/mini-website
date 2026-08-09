import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "node:path";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";

const GITHUB_PAGES_ORIGIN = "https://fraser-dunn.github.io";
const LOCAL_DEV_ORIGIN = "http://localhost:5173";

export interface ApiStackProps extends cdk.StackProps {
  table: dynamodb.Table;
  imagesBucket: s3.Bucket;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { table, imagesBucket } = props;

    // --- Cognito: single admin user, no self sign-up, no Hosted UI ---
    const userPool = new cognito.UserPool(this, "AdminUserPool", {
      userPoolName: "mini-website-admin",
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const userPoolClient = userPool.addClient("AdminUserPoolClient", {
      authFlows: { userSrp: true, userPassword: true },
      generateSecret: false,
    });

    // --- Lambdas ---
    const bundling: nodejs.BundlingOptions = {
      externalModules: ["@aws-sdk/*"],
      target: "node22",
    };

    const listMinisFn = new nodejs.NodejsFunction(this, "ListMinisFunction", {
      entry: path.join(__dirname, "../lambdas/listMinis/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(listMinisFn, "dynamodb:Query");

    const getMiniByIdFn = new nodejs.NodejsFunction(this, "GetMiniByIdFunction", {
      entry: path.join(__dirname, "../lambdas/getMiniById/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(getMiniByIdFn, "dynamodb:GetItem");

    const createMiniFn = new nodejs.NodejsFunction(this, "CreateMiniFunction", {
      entry: path.join(__dirname, "../lambdas/createMini/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(createMiniFn, "dynamodb:PutItem");

    const getUploadUrlFn = new nodejs.NodejsFunction(this, "GetUploadUrlFunction", {
      entry: path.join(__dirname, "../lambdas/getUploadUrl/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { BUCKET_NAME: imagesBucket.bucketName },
      bundling,
    });
    imagesBucket.grantPut(getUploadUrlFn, "images/*");

    const listPaintsFn = new nodejs.NodejsFunction(this, "ListPaintsFunction", {
      entry: path.join(__dirname, "../lambdas/listPaints/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(listPaintsFn, "dynamodb:Query");

    const createPaintFn = new nodejs.NodejsFunction(this, "CreatePaintFunction", {
      entry: path.join(__dirname, "../lambdas/createPaint/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(createPaintFn, "dynamodb:PutItem");

    const updatePaintFn = new nodejs.NodejsFunction(this, "UpdatePaintFunction", {
      entry: path.join(__dirname, "../lambdas/updatePaint/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(updatePaintFn, "dynamodb:GetItem", "dynamodb:PutItem");

    const deletePaintFn = new nodejs.NodejsFunction(this, "DeletePaintFunction", {
      entry: path.join(__dirname, "../lambdas/deletePaint/index.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: { TABLE_NAME: table.tableName },
      bundling,
    });
    table.grant(deletePaintFn, "dynamodb:DeleteItem");

    // --- HTTP API ---
    const httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      apiName: "mini-website-api",
      corsPreflight: {
        allowOrigins: [GITHUB_PAGES_ORIGIN, LOCAL_DEV_ORIGIN],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.DELETE,
        ],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    const authorizer = new authorizers.HttpUserPoolAuthorizer(
      "AdminAuthorizer",
      userPool,
      { userPoolClients: [userPoolClient] }
    );

    httpApi.addRoutes({
      path: "/minis",
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "ListMinisIntegration",
        listMinisFn
      ),
    });

    httpApi.addRoutes({
      path: "/minis/{id}",
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "GetMiniByIdIntegration",
        getMiniByIdFn
      ),
    });

    httpApi.addRoutes({
      path: "/minis",
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "CreateMiniIntegration",
        createMiniFn
      ),
      authorizer,
    });

    httpApi.addRoutes({
      path: "/uploads",
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "GetUploadUrlIntegration",
        getUploadUrlFn
      ),
      authorizer,
    });

    httpApi.addRoutes({
      path: "/paints",
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "ListPaintsIntegration",
        listPaintsFn
      ),
    });

    httpApi.addRoutes({
      path: "/paints",
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "CreatePaintIntegration",
        createPaintFn
      ),
      authorizer,
    });

    httpApi.addRoutes({
      path: "/paints/{id}",
      methods: [apigwv2.HttpMethod.PUT],
      integration: new integrations.HttpLambdaIntegration(
        "UpdatePaintIntegration",
        updatePaintFn
      ),
      authorizer,
    });

    httpApi.addRoutes({
      path: "/paints/{id}",
      methods: [apigwv2.HttpMethod.DELETE],
      integration: new integrations.HttpLambdaIntegration(
        "DeletePaintIntegration",
        deletePaintFn
      ),
      authorizer,
    });

    new cdk.CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
    new cdk.CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
