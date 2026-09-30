import { listS3Explorer } from '../src/lib/s3-client';

async function main() {
  const root = await listS3Explorer('02-tong-chi-tu-hoc');
  console.log('Root folders:', root.folders);
  console.log('\n--- ROOT FILES ---');
  root.files.forEach(f => console.log(f.name, '->', f.url));

  for (const folder of root.folders) {
    const sub = await listS3Explorer(`02-tong-chi-tu-hoc/${folder}`);
    console.log(`\n--- FOLDER [${folder}] (${sub.files.length} files) ---`);
    sub.files.forEach(f => console.log(`  ${f.name} -> ${f.url}`));
  }
}

main().catch(console.error);
