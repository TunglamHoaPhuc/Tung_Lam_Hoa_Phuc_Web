import sharp from 'sharp';
import fs from 'fs';

async function testRotate() {
  const url = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/bao_tuong_phat_giao/chu_phat_hai_hoi/duc_phat_di_da/duc_phat_di_da_tuong_chinh-JPG.webp';
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log('Original metadata:', meta.width, 'x', meta.height, 'format:', meta.format);

  // If width > height, it was shot horizontally or rotated 90 deg clockwise or counter-clockwise
  // Let's test rotating 90 deg clockwise
  const rot90 = await sharp(buf).rotate(90).webp({ quality: 90 }).toBuffer();
  fs.writeFileSync('scratch/test_adida_90.webp', rot90);

  // Rotate 270 deg (90 counter-clockwise)
  const rot270 = await sharp(buf).rotate(270).webp({ quality: 90 }).toBuffer();
  fs.writeFileSync('scratch/test_adida_270.webp', rot270);
  console.log('Saved rot90 and rot270 in scratch/');
}

testRotate().catch(console.error);
