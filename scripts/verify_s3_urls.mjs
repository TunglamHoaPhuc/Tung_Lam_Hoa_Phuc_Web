import https from 'https';

const urls = [
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-hoang-phap-chu-thich-popup.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-pho-chieu-hai-phong.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/su-to-ngo-chan-tu.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tung-lam-hoa-phuc.webp',
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-banner-thumnail.webp',
];

urls.forEach((url) => {
  https.get(url, (res) => {
    console.log(res.statusCode, url);
  }).on('error', (e) => console.error(url, e.message));
});
