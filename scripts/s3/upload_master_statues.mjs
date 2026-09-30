import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const uploadTasks = [
  // 7 Dược Sư Buddhas
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/tuong_chinh/duc_phat_duoc_su_tuong_chinh.webp',
    id: 'duc_phat_duoc_su_luu_ly_quang_vuong_nhu_lai_dai_y_vuong_chua_lanh_than_tam',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Thiện Danh Xưng Cát Tường Vương Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/thien_danh_xung_cat_tuong_vuong_nhu_lai.webp',
    id: 'duc_phat_thien_danh_xung_cat_tuong_vuong_nhu_lai_anh_sang_tieu_tru_kho_nan',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai.webp',
    id: 'duc_phat_bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai_khai_mo_tri_tue_tang_truong_thien_can',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai.webp',
    id: 'duc_phat_kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai_chuyen_hoa_nghiep_sat_trom_san',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/vo_uu_toi_thang_cat_tuong_vuong_nhu_lai.webp',
    id: 'duc_phat_vo_uu_toi_thang_cat_tuong_vuong_nhu_lai_dut_tru_uu_bi_kho_nao',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Pháp Hải Lôi Âm Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/phap_hai_loi_am_nhu_lai.webp',
    id: 'duc_phat_phap_hai_loi_am_nhu_lai_chanh_kien_chanh_tin_tam_bao',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\chu_phat_hai_hoi\\DUC_PHAT_DUOC_SU\\NGHE_THUAT_PHAT_GIAO\\Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/nghe_thuat_phat_giao/phap_hai_thang_hue_du_hy_than_thong_nhu_lai.webp',
    id: 'duc_phat_phap_hai_thang_hue_du_hy_than_thong_nhu_lai_chuyen_hoa_nghiep_ac_thanh_thien_hanh',
  },

  // Nhật Quang Bồ Tát
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\thanh_tinh_dai_hai_chung\\BO_TAT_NHAT_NGUYET_QUANG\\nhat_nguyet_quang_bo_tat.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/thanh_tinh_dai_hai_chung/bo_tat_nhat_nguyet_quang/nhat_quang_bo_tat.webp',
    id: 'TP0039',
  },

  // Hộ Pháp Thần Vương
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\THÍCH ĐẾ HOÀN NHÂN.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/thich_de_hoan_nhan.webp',
    id: 'TP0064',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/thich_de_hoan_nhan_phong_co.webp',
    id: 'TP0065',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\KIÊN LAO ĐỊA THẦN.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/kien_lao_dia_than.webp',
    id: 'TP0066',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/vi_da_ho_phap_phu_dong_thien_vuong.webp',
    id: 'TP0067',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\vi_da_ho_phap_tam_bao.jpg',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/vi_da_ho_phap_tam_bao.webp',
    id: 'TP0068',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\VI ĐÀ HỘ PHÁP.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/vi_da_ho_phap.webp',
    id: 'TP0069',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\TRỪNG ÁC.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/trung_ac.webp',
    id: 'TP0070',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\KHUYẾN THIỆN.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/khuyen_thien.webp',
    id: 'TP0071',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\TRUNG_AC_can_dai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/trung_ac_can_dai.webp',
    id: 'TP0072',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\KHUYEN_THIEN_can_dai.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/khuyen_thien_can_dai.webp',
    id: 'TP0073',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\MẬT TÍCH KIM CANG_co.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/mat_tich_kim_cang_co.webp',
    id: 'TP0074',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\NGHE_THUAT_PHAT_GIAO\\NA LA DIEN KIM CANG_co.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/na_la_dien_kim_cang_co.webp',
    id: 'TP0075',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\MẬT TÍCH HỘ PHÁP.jpg',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/mat_tich_ho_phap.webp',
    id: 'TP0076',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\NA LA DIÊN HỘ PHÁP.jpg',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/na_la_dien_ho_phap.webp',
    id: 'TP0077',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\ho_phap_than_vuong\\TUONG_CHINH\\THẬP NHỊ DƯỢC XOA\\CUNG TỲ LA ĐẠI TƯỚNG.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/tuong_chinh/thap_nhi_duoc_xoa_cung_ty_la.webp',
    id: 'TP0078',
  },

  // Đại Thí Chủ
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\dai_thi_chu\\BÀ NGUYỆT TRANG ĐÀI.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/dai_thi_chu/ba_nguyet_trang_dai.webp',
    id: 'TP0088',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\dai_thi_chu\\THÁNH NỮ SUJATA.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/dai_thi_chu/thanh_nu_sujata.webp',
    id: 'TP0089',
  },

  // Thập Đại Đệ Tử
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\thanh_van_thanh_chung\\THAP_DAI_DE_TU\\Tôn giả Đại Ca Diếp.JPG',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/thanh_van_thanh_chung/thap_dai_de_tu/ton_gia_dai_ca_diep.webp',
    id: 'TP0045',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\BẢO TƯỢNG PHẬT GIÁO\\thanh_van_thanh_chung\\THAP_DAI_DE_TU\\NGHE_THUAT_PHAT_GIAO\\tranh_son_dau\\dai_ca_diep_.png',
    key: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/thanh_van_thanh_chung/thap_dai_de_tu/tranh_son_dau/dai_ca_diep.webp',
    id: 'thap_dai_de_tu_tranh_son_dau',
  },

  // Khu Vực Nổi Bật
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\VŨ TRỤ PHẬT GIÁO\\TAM BẢO\\TAM BẢO TỪ TRÊN CAO.jpg',
    key: 'tunglamhoaphuc2/04-vu-tru-phat-giao/tam_bao_tu_tren_cao.webp',
    id: 'AREA_TAM_BAO',
  },
  {
    local: 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\VŨ TRỤ PHẬT GIÁO\\GIẢNG ĐƯỜNG\\noc-giang-duong-luc-con-tuong-di-da.jpg',
    key: 'tunglamhoaphuc2/04-vu-tru-phat-giao/giang_duong_tuong_di_da.webp',
    id: 'AREA_GIANG_DUONG',
  },
];

async function run() {
  console.log('=== Uploading Missing Master Images to S3 ===');
  const database = JSON.parse(fs.readFileSync('src/data/statues-database.json', 'utf8'));

  for (const task of uploadTasks) {
    if (!fs.existsSync(task.local)) {
      console.warn(`⚠️ Local file not found: ${task.local}`);
      continue;
    }

    try {
      console.log(`Processing: ${task.id} -> ${task.key}`);
      const rawBuf = fs.readFileSync(task.local);
      // sharp rotate() fixes any EXIF rotation automatically
      const webpBuf = await sharp(rawBuf)
        .rotate()
        .webp({ quality: 85 })
        .toBuffer();

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: task.key,
          Body: webpBuf,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.backblazeb2.com/${task.key}`;
      console.log(`✅ Uploaded: ${s3Url}`);

      // Update statue in database if matching id
      const statue = database.find((s) => s.id === task.id);
      if (statue) {
        statue.imgUrl = s3Url;
        statue.avatarUrl = s3Url;
        console.log(`  Updated database record for ${task.id}`);
      }
    } catch (err) {
      console.error(`❌ Error with ${task.id}:`, err);
    }
  }

  // Clean trailing dashes and fix typos in statue names
  for (const s of database) {
    if (s.name) {
      s.name = s.name.replace(/\s*-\s*$/, '').trim();
    }
    if (s.title) {
      s.title = s.title.replace(/\s*-\s*$/, '').trim();
    }
    if (s.titleName) {
      s.titleName = s.titleName.replace(/\s*-\s*$/, '').trim();
    }
  }

  fs.writeFileSync('src/data/statues-database.json', JSON.stringify(database, null, 2), 'utf8');
  console.log('🎉 Database saved successfully!');
}

run();
