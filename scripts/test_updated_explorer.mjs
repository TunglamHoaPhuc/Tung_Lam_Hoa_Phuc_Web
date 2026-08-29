import { listS3Explorer } from '../src/lib/s3-client.js';

async function main() {
  const tongChiRoot = await listS3Explorer('tong-chi-tu-hoc');
  console.log('tong-chi-tu-hoc folders:', tongChiRoot.folders);
  console.log('tong-chi-tu-hoc files count:', tongChiRoot.files.length);

  const tongPhong = await listS3Explorer('tong-chi-tu-hoc/tong-phong-truyen-thua');
  console.log('Tông phong truyền thừa files count:', tongPhong.files.length);
  console.log('Sample files in Tông phong truyền thừa:', tongPhong.files.slice(0, 5).map(f => f.name));
}

main().catch(console.error);
