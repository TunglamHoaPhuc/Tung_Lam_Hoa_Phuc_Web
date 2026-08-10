import { FC } from "react";
import {
  Heart,
  Sun,
  Compass,
  Flower2,
  Sparkles,
  BookOpen,
  Scroll,
  HandHeart,
  Landmark,
} from "lucide-react";

export interface TaxonomyCategory {
  id: number;
  name: string;
  slug: string;
  iconName?: string;
  iconUrl?: string; // WordPress CMS custom icon URL
  IconComponent?: FC<{ className?: string }>;
  description?: string;
  tags?: string[];
}

export const MAIN_TAXONOMY: TaxonomyCategory[] = [
  {
    id: 1,
    name: "Tâm lý – chữa lành",
    slug: "tam-ly-chua-lanh",
    iconName: "Heart",
    IconComponent: Heart,
    description: "Chữa lành tổn thương, xoa dịu tâm hồn và vượt qua nghịch cảnh",
    tags: ["chữa lành tổn thương", "tâm lý", "cảm xúc", "nỗi đau", "hồi phục"],
  },
  {
    id: 2,
    name: "Phật pháp – đời sống",
    slug: "phat-phap-doi-song",
    iconName: "Sun",
    IconComponent: Sun,
    description: "Sống sao cho đúng và an, ứng dụng triết lý Phật giáo vào gia đình và xã hội",
    tags: ["tình yêu", "xung đột gia đình", "cha mẹ và con cái", "áp lực cuộc sống"],
  },
  {
    id: 3,
    name: "Chánh niệm – tỉnh thức",
    slug: "chanh-niem-tinh-thuc",
    iconName: "Compass",
    IconComponent: Compass,
    description: "Bình an trong hiện tại, nghệ thuật sống chậm và quán chiếu hơi thở",
    tags: ["sống tỉnh thức", "chánh niệm", "bình an", "nhận biết", "hơi thở"],
  },
  {
    id: 4,
    name: "Tu tập – chuyển hóa",
    slug: "tu-tap-chuyen-hoa",
    iconName: "Flower2",
    IconComponent: Flower2,
    description: "Thay đổi gốc tâm để đi đến giải thoát, văn tư tu và tịnh giới",
    tags: ["tự học Phật pháp", "thiền định", "giới luật", "giới định tuệ", "tín nguyện hạnh"],
  },
  {
    id: 5,
    name: "Phát triển bản thân - nội tâm",
    slug: "phat-trien-ban-than-noi-tam",
    iconName: "Sparkles",
    IconComponent: Sparkles,
    description: "Xây dựng lòng tin Tam Bảo, nuôi dưỡng nội lực và lòng biết ơn",
    tags: ["lòng tin Tam Bảo", "tư duy tích cực", "biết ơn", "tự trọng", "phụng sự"],
  },
  {
    id: 6,
    name: "Phật học phổ thông",
    slug: "phat-hoc-pho-thong",
    iconName: "BookOpen",
    IconComponent: BookOpen,
    description: "Kiến thức căn bản cho người mới học Phật, Ngũ giới và Thập thiện",
    tags: ["Tam Bảo", "Ngũ giới", "Thập thiện", "Phật tử tại gia", "sám hối", "phóng sinh"],
  },
  {
    id: 7,
    name: "Giáo lý Phật giáo",
    slug: "giao-ly-phat-giao",
    iconName: "Scroll",
    IconComponent: Scroll,
    description: "Các pháp môn Tịnh Độ, Thiền tông, Nhân quả, Vô thường, Tứ Diệu Đế",
    tags: ["Tịnh Độ", "Thiền tông", "nhân quả", "vô thường", "Tứ Diệu Đế", "Bát Chánh Đạo"],
  },
  {
    id: 8,
    name: "Bồ tát hạnh",
    slug: "bo-tat-hanh",
    iconName: "HandHeart",
    IconComponent: HandHeart,
    description: "Phát Bồ Đề tâm, Lục độ Ba la mật và tinh thần phụng sự chúng sinh",
    tags: ["Bồ đề tâm", "hạnh nguyện", "Lục độ Ba la mật", "từ bi", "hỷ xả", "phụng sự"],
  },
  {
    id: 9,
    name: "Phật học - biểu tượng tâm linh",
    slug: "phat-hoc-bieu-tuong-tam-linh",
    iconName: "Landmark",
    IconComponent: Landmark,
    description: "Ý nghĩa danh hiệu chư Phật, Bồ Tát, Thập bát La hán và các pháp khí",
    tags: ["Đức Phật Thích Ca", "Phật A Di Đà", "Quán Thế Âm Bồ Tát", "Địa Tạng Vương", "18 vị La Hán"],
  },
];

/**
 * Helper function to retrieve category metadata and Lucide icon component by name
 */
export function getCategoryInfo(categoryName?: string) {
  if (!categoryName) {
    return {
      name: "Phật học phổ thông",
      slug: "phat-hoc-pho-thong",
      iconName: "Sparkles",
      IconComponent: Sparkles,
    };
  }

  const nameLower = categoryName.toLowerCase().trim();

  const found = MAIN_TAXONOMY.find((cat) => {
    const catNameLower = cat.name.toLowerCase();
    return (
      catNameLower.includes(nameLower) ||
      nameLower.includes(catNameLower) ||
      (nameLower.includes("tâm lý") && cat.id === 1) ||
      (nameLower.includes("đời sống") && cat.id === 2) ||
      (nameLower.includes("chánh niệm") && cat.id === 3) ||
      (nameLower.includes("chuyển hóa") && cat.id === 4) ||
      (nameLower.includes("nội tâm") && cat.id === 5) ||
      (nameLower.includes("phổ thông") && cat.id === 6) ||
      (nameLower.includes("giáo lý") && cat.id === 7) ||
      (nameLower.includes("bồ tát") && cat.id === 8) ||
      (nameLower.includes("biểu tượng") && cat.id === 9)
    );
  });

  if (found) {
    return {
      name: found.name,
      slug: found.slug,
      iconName: found.iconName,
      iconUrl: found.iconUrl,
      IconComponent: found.IconComponent || Sparkles,
    };
  }

  return {
    name: categoryName,
    slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
    iconName: "Sparkles",
    IconComponent: Sparkles,
  };
}
