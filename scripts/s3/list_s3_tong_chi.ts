import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const secretKey = process.env.S3_SECRET_ACCESS_KEY || 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA';
const accessKey = process.env.S3_ACCESS_KEY_ID || '005bc25330e1c1f0000000029';
const endpoint = process.env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
const region = process.env.S3_REGION || 'us-east-005';
const bucketName = process.env.S3_BUCKET_NAME || 'media-tunglamhoaphuc';

const client = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  forcePathStyle: true,
});

async function main() {
  const res = await client.send(new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: 'tunglamhoaphuc2/02-tong-chi-tu-hoc/',
    MaxKeys: 1000
  }));
  console.log('Total files under tunglamhoaphuc2/02-tong-chi-tu-hoc/:', res.Contents?.length || 0);
  (res.Contents || []).forEach(c => console.log(c.Key));
}

main().catch(console.error);
