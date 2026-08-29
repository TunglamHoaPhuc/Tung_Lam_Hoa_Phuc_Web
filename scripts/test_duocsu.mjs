import sharp from 'sharp';
import fs from 'fs';

async function testDuocSu() {
  const url = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/bao_tuong_phat_giao/chu_phat_hai_hoi/duc_phat_duoc_su/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp';
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log('Current dimensions:', meta.width, 'x', meta.height);

  // In our previous script, we rotated it 270 deg because meta.width > meta.height!
  // Wait! If the original image was landscape (chụp ngang, e.g. 1920x1280), but our script rotated it 270 deg, then it BECAME portrait (1280x1920) or got turned sideways!
  // Or if it was rotated 270 deg and is still sideways, let's generate 0, 90, 180, 270!

  fs.writeFileSync('scratch/duocsu_current.webp', buf);
  fs.writeFileSync('scratch/duocsu_rot90.webp', await sharp(buf).rotate(90).webp().toBuffer());
  fs.writeFileSync('scratch/duocsu_rot180.webp', await sharp(buf).rotate(180).webp().toBuffer());
  fs.writeFileSync('scratch/duocsu_rot270.webp', await sharp(buf).rotate(270).webp().toBuffer());

  console.log('Generated duocsu rotations in scratch/');
}

testDuocSu().catch(console.error);
