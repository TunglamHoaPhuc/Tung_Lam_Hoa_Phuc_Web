import { listS3Explorer } from '../src/lib/s3-client';

async function main() {
  const res = await listS3Explorer('02-tong-chi-tu-hoc');
  console.log('Success:', res.success);
  console.log('Error:', res.error);
  console.log('Folders:', res.folders);
  console.log('Files count:', res.files.length);
  res.files.forEach(f => {
    console.log(f.name, '->', f.url);
  });

  // Also check subfolders
  for (const folder of res.folders) {
    const subRes = await listS3Explorer(`02-tong-chi-tu-hoc/${folder}`);
    console.log(`\nSubfolder [${folder}] files count:`, subRes.files.length);
    subRes.files.forEach(f => {
      console.log(`  ${f.name} -> ${f.url}`);
    });
  }
}

main().catch(console.error);
