// One-off migration: Firestore `minis` collection + Firebase Storage images
// -> DynamoDB `Minis` table + S3 images bucket. Run locally, not part of the
// deployed app. Usage:
//   npm run migrate -- --dry-run       (preview only, no AWS writes)
//   npm run migrate                    (full run: all minis + images)
//   npm run migrate -- --only-missing  (retry only images still on Firebase)
import { initializeApp } from "firebase/app";
import { getFirestore, getDocsFromServer, collection } from "firebase/firestore";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const DRY_RUN = process.argv.includes("--dry-run");
const ONLY_MISSING = process.argv.includes("--only-missing");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AWS_REGION = process.env.AWS_REGION ?? "eu-west-2";
const TABLE_NAME = process.env.TABLE_NAME ?? "Minis";
const BUCKET_NAME =
  process.env.BUCKET_NAME ?? "mini-website-images-770014285821";

// Firebase web config values are not secrets - they're already public in the
// deployed site's JS bundle, same as here.
const firebaseConfig = {
  apiKey: "AIzaSyD9mJLsIsyJTRtQy7EwnxqoL-gBXDa1pxg",
  authDomain: "my-minis-site.firebaseapp.com",
  projectId: "my-minis-site",
  storageBucket: "my-minis-site.appspot.com",
  messagingSenderId: "294752755431",
  appId: "1:294752755431:web:ec3b79f135af3eda694c42",
};

function extensionForContentType(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  return "bin";
}

interface MigratedItem {
  PK: "MINI";
  SK: string;
  id: string;
  name: string;
  brand: string;
  maker: string;
  set: string;
  number: number;
  quantity: number;
  race: string;
  gender: string;
  type: string;
  size: string;
  rarity: string;
  damaged: boolean;
  statblock: string;
  imageUrls: string[];
  timestamp: string;
  userRef: string;
}

async function migrateImage(
  s3: S3Client,
  id: string,
  sourceUrl: string
): Promise<string | undefined> {
  const MAX_ATTEMPTS = 4;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(sourceUrl);
    if (res.ok) {
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      const key = `images/${id}-${randomUUID()}.${extensionForContentType(contentType)}`;
      const bytes = new Uint8Array(await res.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: bytes,
          ContentType: contentType,
        })
      );

      return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(750 * attempt);
    } else {
      console.warn(
        `  ! failed to fetch image for ${id} after ${MAX_ATTEMPTS} attempts: HTTP ${res.status}`
      );
    }
  }
  return undefined;
}

// Existing DynamoDB items whose imageUrls[0] still points at Firebase Storage
// means their image transfer failed on a previous run.
async function findIdsStillOnFirebase(
  ddb: DynamoDBDocumentClient
): Promise<Set<string>> {
  const stillOnFirebase = new Set<string>();
  let ExclusiveStartKey: Record<string, unknown> | undefined;

  do {
    const result = await ddb.send(
      new ScanCommand({ TableName: TABLE_NAME, ExclusiveStartKey })
    );
    for (const item of result.Items ?? []) {
      const url: string | undefined = item.imageUrls?.[0];
      if (url?.includes("firebasestorage.googleapis.com")) {
        stillOnFirebase.add(item.SK);
      }
    }
    ExclusiveStartKey = result.LastEvaluatedKey as
      | Record<string, unknown>
      | undefined;
  } while (ExclusiveStartKey);

  return stillOnFirebase;
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const s3 = new S3Client({ region: AWS_REGION });
  const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));

  const snapshot = await getDocsFromServer(collection(db, "minis"));
  console.log(
    `Found ${snapshot.docs.length} minis in Firestore.${DRY_RUN ? " (dry run - no AWS writes will happen)" : ""}`
  );

  let idsToProcess: Set<string> | undefined;
  if (ONLY_MISSING && !DRY_RUN) {
    idsToProcess = await findIdsStillOnFirebase(ddb);
    console.log(
      `--only-missing: ${idsToProcess.size} of ${snapshot.docs.length} still point at Firebase Storage; only retrying those.\n`
    );
  } else {
    console.log("");
  }

  const items: MigratedItem[] = [];

  for (const docSnap of snapshot.docs) {
    const id = docSnap.id;
    if (idsToProcess && !idsToProcess.has(id)) {
      continue;
    }

    const data = docSnap.data() as Record<string, any>;

    const sourceUrl: string | undefined = data.imageUrls?.[0];
    let newImageUrl: string | undefined;

    if (sourceUrl && !DRY_RUN) {
      newImageUrl = await migrateImage(s3, id, sourceUrl);
      await sleep(150);
    }

    const timestamp: string =
      typeof data.timestamp?.toDate === "function"
        ? data.timestamp.toDate().toISOString()
        : new Date().toISOString();

    const item: MigratedItem = {
      PK: "MINI",
      SK: id,
      id,
      name: data.name ?? "",
      brand: data.brand ?? "",
      maker: data.maker ?? "",
      set: data.set ?? "",
      number: Number(data.number ?? 0),
      quantity: Number(data.quantity ?? 1),
      race: data.race ?? "",
      gender: data.gender ?? "",
      type: data.type ?? "",
      size: data.size ?? "Medium",
      rarity: data.rarity ?? "",
      damaged: Boolean(data.damaged),
      statblock: data.statblock ?? "",
      imageUrls: newImageUrl ? [newImageUrl] : sourceUrl ? [sourceUrl] : [],
      timestamp,
      userRef: data.userRef ?? "migrated-legacy",
    };

    items.push(item);
    console.log(
      `  ${DRY_RUN ? "[dry-run] would migrate" : "migrated"}: ${item.set} #${item.number} - ${item.name}${
        sourceUrl && DRY_RUN ? " (image would be re-uploaded)" : ""
      }`
    );
  }

  if (DRY_RUN) {
    console.log(
      `\nDry run complete: ${items.length} items would be written to DynamoDB table "${TABLE_NAME}" and images to s3://${BUCKET_NAME}/images/. No AWS writes were made.`
    );
    return;
  }

  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    let requestItems: Record<string, any> = {
      [TABLE_NAME]: chunk.map((item) => ({ PutRequest: { Item: item } })),
    };

    let attempt = 0;
    while (Object.keys(requestItems).length > 0) {
      const result = await ddb.send(
        new BatchWriteCommand({ RequestItems: requestItems })
      );
      requestItems = result.UnprocessedItems ?? {};
      if (Object.keys(requestItems).length > 0) {
        attempt++;
        if (attempt > 5) {
          throw new Error("Too many retries writing to DynamoDB");
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
    console.log(`Wrote batch ${Math.floor(i / 25) + 1} (${chunk.length} items)`);
  }

  console.log(
    `\nMigration complete: ${items.length} minis written to DynamoDB table "${TABLE_NAME}", images uploaded to s3://${BUCKET_NAME}/images/.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
