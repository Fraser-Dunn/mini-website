# mini-website backend

AWS CDK app (TypeScript) that provisions the backend for the mini-website
frontend: DynamoDB + S3 + Lambda + API Gateway + Cognito, deployed to
`eu-west-2`.

## Stacks

- **`MiniWebsiteDataStack`** ([`lib/data-stack.ts`](lib/data-stack.ts)) —
  the `Minis` DynamoDB table and the S3 bucket holding mini images (public
  read on `images/*` only). Stateful resources, `RemovalPolicy.RETAIN`.
- **`MiniWebsiteApiStack`** ([`lib/api-stack.ts`](lib/api-stack.ts)) — a
  Cognito User Pool (single admin user, no self sign-up), four Lambdas
  (`lambdas/listMinis`, `getMiniById`, `createMini`, `getUploadUrl`), and
  an HTTP API in front of them. Write routes require a valid Cognito JWT.

## Commands

```
npm install
npm run build            # type-check
npx cdk synth             # render the CloudFormation templates
npx cdk deploy --all      # deploy both stacks
npx cdk diff              # compare deployed stacks with current code
```

First-time setup in a fresh AWS account/region needs `npx cdk bootstrap
aws://<account-id>/eu-west-2` once.

## Migration script

[`scripts/migrate.ts`](scripts/migrate.ts) is a one-off script (not part of
the deployed app) used to migrate data from the original Firebase backend
into DynamoDB/S3. Not needed again unless re-running a migration.

```
npm run migrate -- --dry-run       # preview only, no AWS writes
npm run migrate                    # full run: all minis + images
npm run migrate -- --only-missing  # retry only images still on Firebase
```
