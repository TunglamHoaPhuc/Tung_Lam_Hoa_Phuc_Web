import fs from 'fs';

const files = [
  'src/features/universe/components/BatBoKimCangSection.tsx',
  'src/features/universe/components/DanhTangMap.tsx',
  'src/features/universe/components/GiangDuongPhapThoai.tsx',
  'src/features/universe/components/OtherAreasSection.tsx',
  'src/features/universe/components/SpaceGallerySection.tsx',
  'src/features/universe/components/BatBoKimCangGrid.tsx',
  'src/features/universe/components/ThapBatLaHanGrid.tsx',
  'src/features/universe/components/ThapNhiDuocXoaGrid.tsx',
  'src/features/universe/components/ThatPhatDuocSuSection.tsx',
  'src/features/universe/components/ArtisticStatueSection.tsx',
  'src/features/statues/components/StatueDetailCoreLayout.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replaceAll('/images/icon-minh-hoa/bieu-tuong-tuong-phap.png', 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/bieu-tuong-tuong-phap.webp');
    c = c.replaceAll("'/images/bieu-tuong-tuong-phap.svg'", "'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.webp'");
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated icons in:', f);
  }
});
