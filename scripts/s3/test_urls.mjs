const urls = [
  'http://localhost:3000/vu-tru-phat-giao/bao-thap',
  'http://localhost:3000/bao-tuong-phat-giao',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/ban-do-danh-tang-viet-nam-final.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/bao-thap/so-do-bao-thap.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/canh-1.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/anh-tho-cac-vi-cao-tang/anh-hoa-thuong-tong-hop/THIEN-SU-VAN-HANH-938-1018.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/bao_tuong_phat_giao/chu_phat_hai_hoi/duc_phat_di_da/duc_phat_di_da_tuong_chinh-JPG.webp',
];

async function check() {
  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(`✅ [${res.status}] ${u}`);
    } catch (err) {
      console.error(`❌ [ERR] ${u}: ${err.message}`);
    }
  }
}

check();
