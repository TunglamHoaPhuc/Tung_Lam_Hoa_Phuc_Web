'use client';

import { FC, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Target,
  Play,
  Sparkles,
  LayoutGrid,
  Compass,
  Send,
  Bot,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface MapSpot {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  slug: string;
  mapPos: { x: number; y: number };
  imgUrl: string;
  description: string;
  quote: string;
  statues: Array<{ name: string; imgUrl: string }>;
  stories: Array<{ title: string; imgUrl: string; summary: string }>;
}

export const locationNodes = [
  { id: 1, name: "Lầu Kinh Luân", x: 6, y: 46 },
  { id: 2, name: "Con Đường Bình An", x: 30, y: 52 },
  { id: 3, name: "Tổ Đường", x: 50, y: 42 },
  { id: 4, name: "Tam Bảo", x: 50, y: 49 },
  { id: 5, name: "Đại Nam Quốc Mẫu", x: 53, y: 66 },
  { id: 6, name: "Bảo Tượng Quan Thế Âm", x: 56, y: 76 },
  { id: 7, name: "Bảo Tháp Vạn Phật Xá Lợi", x: 47, y: 15 },
  { id: 8, name: "Giảng Đường (Khu A)", x: 71, y: 39 },
  { id: 9, name: "Giảng Đường (Khu B)", x: 76, y: 23 },
  { id: 10, name: "Phòng Phát Hành", x: 67, y: 27 },
  { id: 11, name: "Khu Vệ Sinh", x: 64, y: 14 },
  { id: 12, name: "Sân Chụp Ảnh Xuân An Lành", x: 65, y: 52 },
  { id: 13, name: "Sân Di Đà", x: 57, y: 33 },
  { id: 14, name: "Cổng Tam Quan - Sân Di Lặc", x: 42, y: 57 },
  { id: 15, name: "Đình Làng", x: 42, y: 79 },
];

export const MAP_SPOTS_15: MapSpot[] = [
  {
    id: "1",
    number: 1,
    name: "LẦU KINH LUÂN",
    subtitle: "PHÁP LUÂN THƯỜNG CHUYỂN",
    slug: "ho-phong-sinh",
    mapPos: { x: 6, y: 46 },
    imgUrl: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=800&h=500&fit=crop",
    description: "Là biểu tượng cho Tam Bảo hiện hữu giữa nhân gian, nơi Phật, Pháp và Tăng cùng soi sáng con đường giác ngộ. Mỗi vòng xoay của Kinh Luân thể hiện sứ mệnh cao quý của Tăng Bảo - thay Đức Phật hoằng dương chánh pháp, lan tỏa ánh sáng từ bi và trí tuệ rộng khắp thế gian.",
    quote: "“Thả từng giọt thương yêu xuống dòng nước thanh tịnh, nuôi dưỡng lòng từ bi với muôn loài chúng sinh.”",
    statues: [{ name: "Kinh Luân Đá Cẩm Thạch", imgUrl: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop" }],
    stories: [{ title: "Kinh Luân Xoay Chuyển Từ Bi", imgUrl: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=400&h=240&fit=crop", summary: "Ý nghĩa thiêng liêng của Kinh Luân đối với người con Phật." }]
  },
  {
    id: "2",
    number: 2,
    name: "CỔNG TAM QUAN - SÂN DI LẶC",
    subtitle: "TAM GIẢI THOÁT MÔN & SÂN DI LẶC",
    slug: "cong-tam-quan",
    mapPos: { x: 30, y: 52 },
    imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
    description: "Cửa ngõ đầu tiên dẫn lối vào chốn thiêng gồm hệ thống Cổng Tam Quan uy nghi, kết nối qua cây Cầu Bát Chánh Đạo vượt dòng nước tịnh, dẫn lên Thềm Thất Thánh Tài và Sân Di Lặc - nơi tôn trí tôn tượng Bồ Tát Di Lặc hoan hỷ vô lượng.",
    quote: "“Bước qua cổng lớn, buông bỏ mọi phiền lụy nhân gian để an trú trong hiện tại thanh tịnh.”",
    statues: [
      { name: "Di Lặc Bồ Tát (Tượng Chính)", imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg" },
      { name: "Phật Di Lặc (Tượng Gỗ)", imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/Phật Di Lặc - tượng gỗ.JPG" }
    ],
    stories: []
  },
  {
    id: "3",
    number: 3,
    name: "TỔ ĐƯỜNG",
    subtitle: "TỔ ẤN TRÙNG QUANG",
    slug: "to-duong",
    mapPos: { x: 50, y: 42 },
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=500&fit=crop",
    description: "Không gian tôn nghiêm phụng thờ chư vị Tổ Sư qua các thời kỳ, tổ sư có công khai sơn và truyền thừa dòng mạch Phật pháp tại bổn tự. Nơi đón tiếp quý thiện nam tín nữ và ghi dấu tinh thần tri ân sâu sắc.",
    quote: "“Uống nước nhớ nguồn, ăn quả nhớ người trồng cây. Tôn vinh đạo lý truyền thừa ngàn đời của chốn thiền môn.”",
    statues: [
      { name: "Sư Tổ Ma Ha Ca Diếp", imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop" },
      { name: "Chư Vị Tiền Bối Tổ Sư", imgUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=300&h=300&fit=crop" }
    ],
    stories: [{ title: "Hành Trình Truyền Thừa Tâm Linh", imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=400&h=240&fit=crop", summary: "Những di huấn quý giá của chư vị Tổ sư." }]
  },
  {
    id: "4",
    number: 4,
    name: "TAM BẢO",
    subtitle: "ĐẠI HÙNG BẢO ĐIỆN",
    slug: "tam-bao",
    mapPos: { x: 50, y: 49 },
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=800&h=500&fit=crop",
    description: "Trung tâm tâm linh của toàn Chùa, được xây dựng theo lối kiến trúc truyền thống chữ CÔNG (工), hội tụ tinh hoa Phật giáo 3 miền Bắc - Trung - Nam. Nơi đại chúng trang nghiêm lễ bái cúng dường, mang nhiều ý nghĩa biểu tượng sâu sắc.",
    quote: "“Tâm bình thế giới bình, tâm an vạn sự an. Về dưới mái Tam Bảo tìm lại sự tĩnh lặng trong ngần.”",
    statues: [
      { name: "Đức Phật Thích Ca Mâu Ni", imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop" },
      { name: "Tôn Giả Ca Diếp", imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop" },
      { name: "Tôn Giả A Nạn", imgUrl: "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop" },
      { name: "Bộ Tượng Dược Sư", imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop" }
    ],
    stories: [
      { title: "Khai Sáng Ngọn Lửa Tâm Linh", imgUrl: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=400&h=240&fit=crop", summary: "Hành trình kiến tạo chánh điện Tam Bảo." },
      { title: "Ý Nghĩa Thếp Vàng Tôn Tượng", imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=400&h=240&fit=crop", summary: "Kỹ thuật dát vàng của làng nghề truyền thống." }
    ]
  },
  {
    id: "5",
    number: 5,
    name: "ĐẠI NAM QUỐC MẪU",
    subtitle: "MẪU NGHI THIÊN HẠ",
    slug: "dai-nam-quoc-mau",
    mapPos: { x: 53, y: 66 },
    imgUrl: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=800&h=500&fit=crop",
    description: "Với kiến trúc nguyên bản nhà đá ong nổi tiếng của vùng văn hóa xứ Đoài, nhà Đại Nam Quốc Mẫu được xây dựng để nhắc nhở mỗi người ý thức về truyền thống \"Uống nước nhớ nguồn\" của dân tộc Việt.",
    quote: "“Mẫu tâm bao la như biển cả, che chở nuôi dưỡng muôn dân Việt Nam qua bao thế hệ thanh bình.”",
    statues: [{ name: "Bảo Tượng Quốc Mẫu", imgUrl: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop" }],
    stories: []
  },
  {
    id: "6",
    number: 6,
    name: "BẢO TÀNG",
    subtitle: "DẤU XƯA LƯU TRUYỀN",
    slug: "bao-tang",
    mapPos: { x: 56, y: 76 },
    imgUrl: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=800&h=500&fit=crop",
    description: "Bảo tàng là nơi lưu giữ và tái hiện dòng chảy lịch sử, đồng thời phản ánh sinh động hành trình đồng hành của Phật giáo cùng dân tộc qua các thời kỳ. Còn Tượng đài Nguyệt Trí Quan Âm là một trong những hóa thân của Bồ Tát Quán Âm, tay phải cầm minh châu, tay trái cầm bình tịnh thủy tượng trưng cho sự trí tuệ và từ bi của Ngài, luôn soi sáng và làm dịu mát lửa não phiền của hết thảy chúng sinh.",
    quote: "“Dấu xưa lưu truyền, soi sáng bước chân hành giả trên con đường giải thoát.”",
    statues: [{ name: "Tượng Quan Âm Nguyệt Trí", imgUrl: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop" }],
    stories: []
  },
  {
    id: "7",
    number: 7,
    name: "BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH",
    subtitle: "VẠN PHẬT QUANG MINH",
    slug: "bao-thap-van-phat-xa-loi",
    mapPos: { x: 47, y: 15 },
    imgUrl: "https://images.unsplash.com/photo-1659513704374-0dc63b98dbb5?w=800&h=500&fit=crop",
    description: "Ngôi bảo tháp uy nghiêm, nơi tôn trí tượng Phật, kinh sách, biểu tượng cho ánh sáng tuệ giác. Đúng như tên gọi của bảo tháp, mặt trong và ngoài bảo tháp được tôn trí với gần một vạn tượng Phật - chế tác bởi thợ gốm Bát Tràng lấy mẫu từ vườn Nai Sannath-Varanasi nơi Đức Phật chuyển Pháp Luân. Bên trong chứa cấu trúc MẠN ĐÀ LA (Mandala) linh thiêng, đồng tâm vũ trụ với vạn Phật quang minh.",
    quote: "“Vạn Phật đồng tâm, ngọn tháp uy nghiêm vươn tới trời cao soi sáng con đường giải thoát.”",
    statues: [{ name: "Tượng Xá Lợi Phật", imgUrl: "https://images.unsplash.com/photo-1659513704374-0dc63b98dbb5?w=300&h=300&fit=crop" }],
    stories: []
  },
  {
    id: "8",
    number: 8,
    name: "GIẢNG ĐƯỜNG",
    subtitle: "CHƯ PHẬT HẢI HỘI",
    slug: "giang-duong",
    mapPos: { x: 71, y: 39 },
    imgUrl: "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=800&h=500&fit=crop",
    description: "Khu vực giảng đường với diện tích 700m vuông chia làm hai tầng, tầng trên làm giảng đường, tầng dưới làm trai đường. Giảng đường là nơi tu tập, sinh hoạt và học hỏi giáo lý nhà Phật theo các khóa tu được tổ chức định kỳ tại Tùng Lâm.",
    quote: "“Mở rộng cửa từ bi, truyền trao trí tuệ. Nơi hàng ngàn trái tim cùng hướng về chánh pháp an lạc.”",
    statues: [],
    stories: []
  },
  {
    id: "9",
    number: 9,
    name: "THƯ VIỆN",
    subtitle: "PHÁP BẢO LƯU THÔNG",
    slug: "thu-vien",
    mapPos: { x: 76, y: 23 },
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=500&fit=crop",
    description: "Thư viện là không gian lưu giữ Pháp tạng và những trang kinh, sách quý, góp phần lan tỏa đạo đức, trí tuệ Phật pháp đến mọi người.",
    quote: "“Học Phật là ngọn đuốc soi sáng tâm trí, đưa hành giả tiến bước trên lộ trình giải thoát.”",
    statues: [],
    stories: []
  },
  {
    id: "10",
    number: 10,
    name: "TỨ ÂN - VÃNG SINH ĐƯỜNG",
    subtitle: "CHƯ HƯƠNG LINH VỀ MIỀN TỊNH ĐỘ",
    slug: "tu-an",
    mapPos: { x: 67, y: 27 },
    imgUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=500&fit=crop",
    description: "Khu vực Nhà Tứ Ân để thờ chư Hương Linh, Cửu Huyền Thất Tổ của bách gia trăm họ, với ý nghĩa nhắc nhở mọi người hằng nhớ đến công ơn của Tam Bảo, Tổ Thầy, cha mẹ và quốc gia, dân tộc. Còn nhà vãng sinh là nơi để quý Phật tử, thiện nam, tín nữ ký gửi tro cốt của người thân đã khuất để chư Hương Linh được nghe kinh, nghe Pháp chuyển hóa và siêu tiến về các cảnh giới an lành.",
    quote: "“Uống nước nhớ nguồn, nguyện cầu chư hương linh siêu sanh Tịnh độ.”",
    statues: [],
    stories: []
  },
  {
    id: "11",
    number: 11,
    name: "TRAI ĐƯỜNG",
    subtitle: "HÒA CHÍNH TRAI ĐƯỜNG",
    slug: "trai-duong",
    mapPos: { x: 64, y: 14 },
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=500&fit=crop",
    description: "Nơi đại chúng và Phật tử thực hành nghi thức quá đường, thọ trai trong chánh niệm. Không gian nuôi dưỡng lòng biết ơn đối với đàn na tín thí và nuôi lớn tình pháp lữ, thực hành ăn trong tỉnh thức.",
    quote: "“Ăn trong chánh niệm, nuôi dưỡng lòng từ bi và trân trọng từng hạt cơm cúng dường.”",
    statues: [],
    stories: []
  },
  {
    id: "12",
    number: 12,
    name: "LÂM TỲ NI",
    subtitle: "ĐẢN SANH THỊ HIỆN",
    slug: "lam-ty-ni",
    mapPos: { x: 65, y: 52 },
    imgUrl: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=800&h=500&fit=crop",
    description: "Giữa không gian thanh tịnh, Sân Lâm Tỳ Ni tái hiện khoảnh khắc Đức Phật ra đời, mở ra hành trình giác ngộ cho nhân loại. Nơi đây, mỗi người con Phật có dịp lắng lòng, cảm nhận niềm hân hoan và tỉnh thức nơi chính tự tâm.",
    quote: "“Đức Phật ra đời khai mở nguồn tuệ giác, đưa muôn loài thoát khỏi cõi u mê.”",
    statues: [],
    stories: []
  },
  {
    id: "13",
    number: 13,
    name: "SÂN DI ĐÀ",
    subtitle: "QUANG MINH DI ĐÀ",
    slug: "san-di-da",
    mapPos: { x: 57, y: 33 },
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=500&fit=crop",
    description: "Không gian sân rộng lớn phía trước Chánh điện, trung tâm diễn ra các đại lễ truyền thống hoành tráng của Chùa, có tôn trí tôn tượng Đức Phật A Di Đà phóng quang tiếp dẫn đại chúng.",
    quote: "“Mỗi bước chân bước đi trên mặt đất là mỗi bước chân chạm vào bình an.”",
    statues: [],
    stories: []
  },
  {
    id: "14",
    number: 14,
    name: "KHÔNG GIAN TÂM LINH VĂN HÓA LÀNG XÃ BẮC BỘ",
    subtitle: "DI SẢN TÂM LINH VIỆT",
    slug: "lang-xa-tam-linh",
    mapPos: { x: 42, y: 57 },
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=800&h=500&fit=crop",
    description: "Khuôn viên đền thờ mang đậm nét kiến trúc thuần Việt cổ kính, kết nối với gốc cây Đa, sân đình và cổng đình. Nơi tôn vinh giá trị văn hóa lịch sử, làm nổi bật lên nét đẹp làng xã xưa gắn liền với mảnh đất bổn tự.",
    quote: "“Hồn quê Việt Nam đọng lại dưới mái đình cổ kính thanh bình.”",
    statues: [],
    stories: []
  },
  {
    id: "15",
    number: 15,
    name: "SÂN LA HÁN",
    subtitle: "THÁNH TĂNG ỨNG HÓA",
    slug: "san-la-han",
    mapPos: { x: 42, y: 79 },
    imgUrl: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=800&h=500&fit=crop",
    description: "Nằm ngay dưới chân Lầu Chuyển Kinh Luân, Sân La Hán được kiến tạo theo lối vườn cảnh thiền, kết hợp hài hòa giữa những khối đá nguyên sơ và sắc xanh của cỏ cây để Phật tử tĩnh tâm thiền hành, chiêm bái các chư vị Thập Bát La Hán.",
    quote: "“Tĩnh lặng thiền hành giữa chốn vườn đá La Hán, lắng nghe xào xạc lá rơi tan mọi ưu phiền.”",
    statues: [],
    stories: []
  }
];

function toSentenceCase(str?: string): string {
  if (!str) return '';
  if (/[a-z]/.test(str)) return str;
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

interface InteractiveMap2DProps {
  onExit2DMode?: () => void;
}

export const InteractiveMap2D: FC<InteractiveMap2DProps> = ({ onExit2DMode }) => {
  // Screen State: 'loading' | 'welcome' | 'map'
  const [screenState, setScreenState] = useState<'loading' | 'welcome' | 'map'>('loading');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [showAiChatBubble, setShowAiChatBubble] = useState<boolean>(false);
  
  // Transform & Pan states for Google Maps style interaction
  const [scale, setScale] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sidePanelRef = useRef<HTMLElement | null>(null);

  // Loading Progress Bar Effect (0% to 100% in ~1.5 - 2s)
  useEffect(() => {
    if (screenState !== 'loading') return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreenState('welcome'), 250);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [screenState]);

  // Handle Start Exploring button click
  const handleStartExplore = () => {
    setScreenState('map');
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  // Toggle Background Audio
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  // Chat Messages state for AI Chat Bubble
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Nam Mô A Di Đà Phật! Con là Trợ lý AI Tùng Lâm Hòa Phúc. Quý vị có thắc mắc gì về 15 khu vực thiền môn?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');

  // Helper to clamp positionX and positionY within container bounds so background is never exposed
  const getClampedPosition = (x: number, y: number, currentScale: number) => {
    const container = containerRef.current;
    if (!container || currentScale <= 1) {
      return { x: 0, y: 0 };
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaledWidth = containerWidth * currentScale;
    const scaledHeight = containerHeight * currentScale;

    // Minimum negative offset allowed before edge shows
    const minX = containerWidth - scaledWidth;
    const minY = containerHeight - scaledHeight;

    // Lock coordinates strictly within range [min, 0]
    const clampedX = Math.min(0, Math.max(x, minX));
    const clampedY = Math.min(0, Math.max(y, minY));

    return { x: clampedX, y: clampedY };
  };

  // Mouse Wheel Event: Zoom directly focused around current Mouse Origin with Boundary Clamping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If mouse cursor is inside the Side Panel or AI Chat Bubble, allow normal vertical scrolling and skip map zoom!
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (sidePanelRef.current?.contains(target) ||
          target.closest('.side-panel-scroll') ||
          target.closest('.ai-chat-bubble'))
      ) {
        return;
      }

      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setScale((prevScale) => {
        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
        const newScale = Math.min(Math.max(prevScale * zoomFactor, 1), 4);

        if (newScale === 1) {
          setPositionX(0);
          setPositionY(0);
        } else {
          const rawX = mouseX - (mouseX - positionX) * (newScale / prevScale);
          const rawY = mouseY - (mouseY - positionY) * (newScale / prevScale);

          const containerWidth = rect.width;
          const containerHeight = rect.height;
          const scaledWidth = containerWidth * newScale;
          const scaledHeight = containerHeight * newScale;

          const minX = containerWidth - scaledWidth;
          const minY = containerHeight - scaledHeight;

          setPositionX(Math.min(0, Math.max(rawX, minX)));
          setPositionY(Math.min(0, Math.max(rawY, minY)));
        }

        return newScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [positionX, positionY]);

  // Google Maps Drag & Pan Handlers with Clamping
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (sidePanelRef.current?.contains(target) ||
        target.closest('.side-panel-scroll') ||
        target.closest('.ai-chat-bubble') ||
        target.closest('.floating-dock-toolbar'))
    ) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { x: positionX, y: positionY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const rawX = posStartRef.current.x + deltaX;
    const rawY = posStartRef.current.y + deltaY;

    if (scale <= 1) {
      setPositionX(0);
      setPositionY(0);
      return;
    }

    const clamped = getClampedPosition(rawX, rawY, scale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setScale(1);
    setPositionX(0);
    setPositionY(0);
    setSelectedSpot(null);
  };

  const handleSpotClick = (spot: MapSpot) => {
    setSelectedSpot(spot);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const targetScale = 2.5;

      const spotX = (spot.mapPos.x / 100) * rect.width;
      const spotY = (spot.mapPos.y / 100) * rect.height;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rawX = centerX - spotX * targetScale;
      const rawY = centerY - spotY * targetScale;

      const clamped = getClampedPosition(rawX, rawY, targetScale);
      setPositionX(clamped.x);
      setPositionY(clamped.y);
      setScale(targetScale);
    } else {
      setScale(2.5);
    }
  };

  const handleSendMessage = () => {
    if (!inputQuery.trim()) return;
    const query = inputQuery.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');

    setTimeout(() => {
      let reply = "Cảm ơn quý vị đã đặt câu hỏi. Tùng Lâm Hòa Phúc là chốn thiền môn thanh tịnh hội tụ 15 khu vực bảo tượng và chánh điện trang nghiêm.";
      const lower = query.toLowerCase();

      const matchedSpot = MAP_SPOTS_15.find(
        (s) => lower.includes(s.name.toLowerCase()) || lower.includes(s.slug)
      );

      if (matchedSpot) {
        reply = `Khu vực ${matchedSpot.number}. ${matchedSpot.name}: ${matchedSpot.description}`;
        handleSpotClick(matchedSpot);
      } else if (lower.includes("tam bảo") || lower.includes("chánh điện")) {
        reply = "Tam Bảo (khu vực số 4) là chánh điện trung tâm của Tùng Lâm Hòa Phúc, được xây dựng theo lối kiến trúc chữ CÔNG (工) hội tụ tinh hoa Phật giáo.";
      } else if (lower.includes("quan âm") || lower.includes("bồ tát")) {
        reply = "Bảo Tượng Quan Thế Âm (khu vực số 6) là tôn tượng Bồ Tát lộ thiên cao sừng sững ngự trên đài sen ban vui cứu khổ cho muôn loài.";
      } else if (lower.includes("kinh luân")) {
        reply = "Lầu Kinh Luân (khu vực số 1) tôn trí Kinh Luân xoay chuyển giáo pháp cùng hồ nước phóng sinh thanh tịnh.";
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  const MAP_IMAGE_URL = "/images/vu-tru-phat-giao/canh-1.png";

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 bg-[#1C120C] overflow-hidden select-none">
      {/* ── BACKGROUND AUDIO ELEMENT & FLOATING AUDIO TOGGLE BUTTON ── */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/nhac-thien.mp3"
        onError={(e) => {
          // Fallback zen meditation audio URL if local audio file doesn't exist
          e.currentTarget.src = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-zen-112195.mp3";
        }}
      />

      {/* Floating Audio Toggle Button (Fixed bottom-5 left-5) */}
      <button
        type="button"
        onClick={toggleAudio}
        className="fixed bottom-5 left-5 z-50 w-10 h-10 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-[#FFE5A3] cursor-pointer hover:scale-110 transition-all shadow-lg backdrop-blur-md"
        title={isPlayingAudio ? "Tắt âm thanh nền" : "Bật âm thanh nền"}
      >
        {isPlayingAudio ? (
          <Volume2 className="w-5 h-5 text-[#F2C14E] animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-[#FFE5A3]/60" />
        )}
      </button>

      {/* ── SEAMLESS OVERLAY WITH TOAN-CANH-CHUA.JPG ANCHOR BACKGROUND (LOADING ➔ WELCOME ➔ MAP CROSSFADE) ── */}
      <AnimatePresence mode="wait">
        {screenState !== 'map' && (
          <motion.div
            key="anchor-welcome-loading-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-40 overflow-hidden select-none pointer-events-auto"
          >
            {/* Seamless Anchor Background Image: toan-canh-chua.jpg */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/vu-tru-phat-giao/toan-canh-chua.jpg"
                onError={(e) => {
                  e.currentTarget.src = "/images/toan-canh-chua.jpg";
                }}
                alt="Toàn cảnh Tùng Lâm Hòa Phúc"
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D] via-[#1C130D]/60 to-black/40" />
            </div>

            <AnimatePresence mode="wait">
              {/* Sub-Stage 1: Loading Progress Overlay */}
              {screenState === 'loading' ? (
                <motion.div
                  key="loading-substage"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 z-10 bg-[#0D0907]/80 backdrop-blur-sm flex flex-col items-center justify-center text-[#FFE5A3] select-none p-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2C1C11] border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_25px_rgba(242,193,78,0.4)]">
                    <span className="text-3xl animate-spin">☸</span>
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-normal text-[#F2C14E] uppercase tracking-wider mb-4"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    ĐANG TẢI SƠ ĐỒ VŨ TRỤ PHẬT GIÁO...
                  </h3>
                  <div className="w-64 h-1.5 bg-[#2C1C11] rounded-full overflow-hidden border border-[#F2C14E]/30 relative shadow-md">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#FFE5A3] transition-all duration-150 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold mt-2 text-[#FFE5A3]/90"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    {loadingProgress}%
                  </span>
                </motion.div>
              ) : (
                /* Sub-Stage 2: Welcome Screen Overlay */
                <motion.div
                  key="welcome-substage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 select-none"
                >
                  <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#2C1C11]/90 border-2 border-[#F2C14E] flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_30px_rgba(242,193,78,0.5)]">
                      <span className="text-3xl">☸</span>
                    </div>

                    {/* Subtitle: Sentence case (normal-case), font-niagara, gold color */}
                    <p
                      className="text-[#F2C14E] text-2xl md:text-3xl normal-case mb-2 font-normal tracking-wide drop-shadow-none"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      Tìm hiểu và khám phá
                    </p>

                    {/* Main Title: Uppercase, font-niagara, font-normal, NO glow/shadow, crisp white */}
                    <h1
                      className="text-[#FFFFFF] text-5xl md:text-7xl font-normal tracking-wider mb-8 uppercase drop-shadow-none text-shadow-none"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      TÙNG LÂM HÒA PHÚC
                    </h1>

                    {/* Action Button: Gold gradient bg, brown bold text font-avo */}
                    <button
                      type="button"
                      onClick={handleStartExplore}
                      className="bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(242,193,78,0.6)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5 uppercase tracking-wider"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <span>BẮT ĐẦU KHÁM PHÁ</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── 2. CỘT CÔNG CỤ DẠNG DOCK TỐI GIẢN (FLOATING TOOLBAR WITH 3 ICONS ON THE LEFT) ── */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 bg-[#1C130D]/85 backdrop-blur-md border border-[#F2C14E]/30 p-2.5 rounded-2xl shadow-2xl">
        {/* Icon 1: Vũ Trụ Phật Giáo (Chuyển về Dạng Lưới Grid) */}
        <div className="relative group">
          <button
            type="button"
            onClick={onExit2DMode || (() => window.history.back())}
            className="w-10 h-10 rounded-xl border border-[#F2C14E]/40 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md"
            title="Vũ Trụ Phật Giáo"
          >
            <span className="text-xl">☸</span>
          </button>
          <div
            className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#2C1C11] text-[#FFE5A3] px-2.5 py-1 rounded text-xs border border-[#F2C14E]/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Vũ Trụ Phật Giáo
          </div>
        </div>

        {/* Icon 2: Nhìn Toàn Bản Đồ (Reset góc nhìn 1x) */}
        <div className="relative group">
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-10 h-10 rounded-xl border border-[#F2C14E]/40 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md"
            title="Toàn cảnh bản đồ"
          >
            <Compass className="w-5 h-5 text-[#F2C14E]" />
          </button>
          <div
            className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#2C1C11] text-[#FFE5A3] px-2.5 py-1 rounded text-xs border border-[#F2C14E]/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Toàn cảnh bản đồ
          </div>
        </div>

        {/* Icon 3: Trợ Lý AI (Bật/Tắt Khung Chat Bubble AI) */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setShowAiChatBubble(!showAiChatBubble)}
            className={`w-10 h-10 rounded-xl border transition-all cursor-pointer shadow-md flex items-center justify-center ${
              showAiChatBubble
                ? "bg-[#F2C14E] text-[#2A1D14] border-[#FFE5A3] shadow-[0_0_20px_rgba(242,193,78,0.8)] scale-105"
                : "border-[#F2C14E]/40 bg-[#2C1C11]/90 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14]"
            }`}
            title="Hỏi Trợ lý AI Tùng Lâm"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <div
            className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#2C1C11] text-[#FFE5A3] px-2.5 py-1 rounded text-xs border border-[#F2C14E]/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Hỏi Trợ lý AI Tùng Lâm
          </div>
        </div>
      </div>

      {/* ── 3. BONG BÓNG CHAT AI MAGIC PHONG CÁCH KÍNH MỜ (MAGIC GLASSMORPHISM & GRADIENT BORDER) ── */}
      {showAiChatBubble && (
        <div
          className="absolute left-16 bottom-6 z-40 w-80 md:w-96 bg-[#1C130D]/75 backdrop-blur-xl rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-left animate-in fade-in slide-in-from-left-4"
          style={{
            background: "linear-gradient(#1C130D, #1C130D) padding-box, linear-gradient(135deg, rgba(242,193,78,0.8), rgba(255,229,163,0.2), rgba(242,193,78,0.6)) border-box",
            border: "1.5px solid transparent",
            maxHeight: "420px",
          }}
        >
          <div className="flex items-center justify-between border-b border-[#F2C14E]/20 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F2C14E] animate-pulse" />
              <h4
                className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                Trợ lý AI Tùng Lâm Hòa Phúc
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowAiChatBubble(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-56 no-scrollbar text-xs"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
                    msg.sender === 'user'
                      ? 'bg-[#F2C14E] text-[#2A1D14] font-bold rounded-br-none'
                      : 'bg-[#2A1D14]/90 text-[#FFE5A3] border border-[#F2C14E]/30 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#F2C14E]/20">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi về khu vực, bảo tượng..."
              className="flex-1 bg-[#1C120C]/80 border border-[#F2C14E]/30 rounded-xl px-3 py-2 text-xs text-[#FFE5A3] placeholder-[#c9b896]/60 focus:outline-none focus:border-[#F2C14E] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#2A1D14] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0 font-bold shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 4. KHUNG SƠ ĐỒ PHẲNG 2D TOÀN MÀN HÌNH KHÔNG VIỀN (CON TRỎ BÀN TAY KÉO PAN & ZOOM TẠI TÂM MOUSE) ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full flex items-center justify-center overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: `translate3d(${positionX}px, ${positionY}px, 0px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Clean Crisp Flat Map Image borderless edge-to-edge full cover */}
          <img
            src={MAP_IMAGE_URL}
            onError={(e) => {
              e.currentTarget.src = "/images/toan-canh-chua.jpg";
            }}
            alt="Sơ đồ 2D Tùng Lâm Hòa Phúc - canh-1.png"
            className="min-w-full min-h-full w-full h-full object-cover select-none pointer-events-auto block"
            draggable={false}
          />

          {/* 15 Flat Sharp Hotspot Pin Buttons with Active Selection Glowing Ring Boundary */}
          {MAP_SPOTS_15.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
                style={{
                  left: `${spot.mapPos.x}%`,
                  top: `${spot.mapPos.y}%`,
                }}
              >
                {/* Active Selection Glowing Ring Boundary Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 -m-3 rounded-full border-2 border-[#F2C14E] animate-ping opacity-80 shadow-[0_0_35px_rgba(242,193,78,0.95)] pointer-events-none" />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpotClick(spot);
                  }}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 font-bold text-xs md:text-sm flex items-center justify-center cursor-pointer transition-all duration-500 z-20 ${
                    isSelected
                      ? "bg-[#F2C14E] text-[#2C1C11] border-[#FFE5A3] ring-4 ring-[#F2C14E] shadow-[0_0_35px_rgba(242,193,78,0.95)] scale-125 z-30"
                      : "bg-[#2C1C11]/90 text-[#FFE5A3] border-[#F2C14E] hover:scale-110 shadow-md"
                  }`}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  title={spot.name}
                >
                  <span>{spot.number}</span>
                </button>

                {/* Tooltip Badge on Hover */}
                <div
                  className="absolute left-1/2 -top-9 -translate-x-1/2 px-2.5 py-1 rounded-md border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 bg-[#1A120B] border-[#F2C14E] text-[#F2C14E] text-xs font-medium"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {spot.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT SIDE PANEL POPUP DETAILS ── */}
        <AnimatePresence>
          {selectedSpot && (
            <motion.aside
              ref={sidePanelRef}
              onWheel={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="side-panel-scroll absolute right-0 top-0 bottom-0 w-full sm:w-[420px] z-40 overflow-y-auto border-l p-6 flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, rgba(30,19,12,0.95) 0%, rgba(18,11,6,0.98) 100%)",
                borderColor: "rgba(242,193,78,0.35)",
                boxShadow: "-16px 0 48px rgba(0,0,0,0.85)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div>
                {/* Close Sidebar Button [ ✕ ] */}
                <div className="flex items-center justify-between mb-4 pt-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest text-[#F2C14E]"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    KHU VỰC SỐ {selectedSpot.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSpot(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#F2C14E", border: "1px solid rgba(242,193,78,0.3)" }}
                    aria-label="Đóng bảng thông tin"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Header: Circle Badge + Title UTM Niagara + Subtitle UTM Avo */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #F2C14E 0%, #C9AD7B 100%)",
                      borderColor: "#F2C14E",
                    }}
                  >
                    <span className="text-xl">🏯</span>
                  </div>

                  <div>
                    <h3
                      className="text-2xl md:text-3xl font-normal leading-none text-[#F2C14E]"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {selectedSpot.name}
                    </h3>
                    <p
                      className="font-sans text-xs md:text-sm text-[#FFE5A3] font-bold mt-1"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {toSentenceCase(selectedSpot.subtitle)}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] w-full mb-4 bg-gradient-to-r from-[#F2C14E]/50 via-[#F2C14E]/20 to-transparent" />

                {/* Close-up Image Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden border mb-5 shadow-lg" style={{ borderColor: "rgba(242,193,78,0.35)" }}>
                  <img src={selectedSpot.imgUrl} alt={selectedSpot.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140D08]/80 via-transparent to-transparent" />
                </div>

                {/* Statue Badges if available */}
                {selectedSpot.statues.length > 0 && (
                  <div className="mb-5">
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest text-[#F2C14E] mb-2"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      BẢO TƯỢNG NỔI BẬT:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedSpot.statues.map((st, idx) => (
                        <div
                          key={idx}
                          className="w-9 h-9 rounded-full border overflow-hidden relative group cursor-pointer"
                          style={{ borderColor: "rgba(242,193,78,0.5)" }}
                          title={st.name}
                        >
                          <img src={st.imgUrl} alt={st.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div
                        className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold text-[#F2C14E]"
                        style={{
                          background: "rgba(242,193,78,0.15)",
                          borderColor: "rgba(242,193,78,0.4)",
                          fontFamily: "'UTM Avo', sans-serif",
                        }}
                      >
                        +{selectedSpot.statues.length}
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p
                  className="font-sans text-xs md:text-sm text-[#D3C0AD] leading-relaxed text-justify mb-4"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedSpot.description}
                </p>

                {/* Zen Meditation Quote Blockquote */}
                <blockquote
                  className="border-l-2 border-[#F2C14E] bg-[#3a2718]/60 p-3 italic text-xs md:text-sm text-[#FFE5A3] rounded-r-lg mb-6 leading-relaxed"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedSpot.quote}
                </blockquote>

                {/* Stories */}
                {selectedSpot.stories.length > 0 && (
                  <div className="mb-6">
                    <h4
                      className="text-xs uppercase font-bold text-[#F2C14E] tracking-widest mb-3 flex items-center gap-1.5"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>NHỮNG CÂU CHUYỆN KHU VỰC</span>
                    </h4>

                    <div className="space-y-2.5">
                      {selectedSpot.stories.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border flex items-center gap-3 transition-colors hover:border-[#F2C14E] cursor-pointer"
                          style={{
                            background: "rgba(42,29,20,0.5)",
                            borderColor: "rgba(242,193,78,0.2)",
                          }}
                          onClick={() => setVideoModalUrl(st.imgUrl)}
                        >
                          <img
                            src={st.imgUrl}
                            alt={st.title}
                            className="w-14 h-11 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5
                              className="text-xs font-bold text-[#e3d2c1] line-clamp-1"
                              style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            >
                              {st.title}
                            </h5>
                            <p
                              className="text-[10px] text-[#c9b896] line-clamp-1 mt-0.5"
                              style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            >
                              {st.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t space-y-2.5" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
                <Link
                  href={`/vu-tru-phat-giao/${selectedSpot.slug}`}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F2C14E 0%, #D4A017 100%)",
                    color: "#2A1D14",
                    fontFamily: "'UTM Avo', sans-serif",
                    boxShadow: "0 0 20px rgba(242,193,78,0.3)",
                  }}
                >
                  <span>Khám phá chi tiết {selectedSpot.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoModalUrl(selectedSpot.imgUrl)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all hover:bg-[#F2C14E]/10 cursor-pointer"
                  style={{
                    borderColor: "rgba(242,193,78,0.4)",
                    color: "#F2C14E",
                    fontFamily: "'UTM Avo', sans-serif",
                  }}
                >
                  <Play className="w-3.5 h-3.5 fill-[#F2C14E]" />
                  <span>Xem Pháp thoại / Video</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Video Modal Popup */}
      {videoModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setVideoModalUrl(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden border shadow-2xl p-6 bg-[#2A1D14]"
            style={{ borderColor: "#F2C14E" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-[#F2C14E]"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-normal text-[#F2C14E] mb-4" style={{ fontFamily: "'UTM Niagara', serif" }}>
              THƯỚC PHIM TƯ LIỆU THIỀN MÔN
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img src={videoModalUrl} alt="Video preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const InteractiveFlycamMap = InteractiveMap2D;
