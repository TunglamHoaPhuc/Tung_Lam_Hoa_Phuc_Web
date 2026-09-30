import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: '005bc25330e1c1f0000000029',
    secretAccessKey: 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA',
  },
});

async function getAllS3Files() {
  let allKeys = [];
  let ContinuationToken = undefined;

  do {
    const res = await s3Client.send(new ListObjectsV2Command({
      Bucket: 's2-cnv03',
      Prefix: 'tunglamhoaphuc2/',
      ContinuationToken,
    }));

    if (res.Contents) {
      for (const item of res.Contents) {
        if (item.Key && !item.Key.endsWith('/')) {
          allKeys.push(item.Key);
        }
      }
    }
    ContinuationToken = res.NextContinuationToken;
  } while (ContinuationToken);

  console.log(`Total S3 files in tunglamhoaphuc2: ${allKeys.length}`);
  fs.writeFileSync('s3_keys.json', JSON.stringify(allKeys, null, 2), 'utf8');
}

getAllS3Files().catch(console.error);
