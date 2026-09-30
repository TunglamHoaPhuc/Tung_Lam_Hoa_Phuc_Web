import { listS3Explorer } from '../src/lib/s3-client';

async function main() {
  for (const folder of ['nen-tang-tu-hoc', 'nep-song-thien-gia', 'lo-trinh-tu-hoc', 'phuong-phap-hanh-tri']) {
    const sub = await listS3Explorer(`02-tong-chi-tu-hoc/${folder}`);
    console.log(`\n=== [${folder}] (${sub.files.length} files) ===`);
    sub.files.forEach(f => console.log(`  ${f.name} -> ${f.url}`));
  }
}

main().catch(console.error);
