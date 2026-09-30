import sharp from 'sharp';

async function check() {
  const url = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/bao_tuong_phat_giao/chu_phat_hai_hoi/duc_phat_duoc_su/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp';
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log('✅ Đức Phật Dược Sư final dimension:', meta.width, 'x', meta.height);
}

check().catch(console.error);
