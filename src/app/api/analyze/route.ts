import { NextRequest, NextResponse } from 'next/server';

interface TibetanCharMeta {
  wylie: string;
  phonetic: string;
  name: string;
  meaning: string;
  pos: string;
  root: string;
  vowel: string;
  tone: string;
  spelling: string[];
  tips: string[];
  situation: string;
  teachings: string;
}

const TIBETAN_CONSONANTS_DICT: Record<string, TibetanCharMeta> = {
  'ཀ': {
    wylie: 'ka', phonetic: 'ka (âm cao, không bật hơi)', name: 'Phụ âm Ka',
    meaning: 'Chữ cái thứ 1 trong 30 phụ âm Tạng. Căn tự khởi đầu của trí tuệ và khởi tâm thanh tịnh.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཀ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc trực tiếp căn tự: Ka'],
    tips: ['Khép nhẹ cuống họng, bật âm [k] dứt khoát không đẩy luồng hơi mạnh, giữ thanh quản căng.'],
    situation: 'Dùng cấu tạo các từ cơ bản: ཀ་བ (cột trụ), ཀུན་ཏུ་ (khắp tất cả).',
    teachings: 'Tượng trưng cho Tính Không và Bản tâm thanh tịnh vốn có (Ka-dak).'
  },
  'ཁ': {
    wylie: 'kha', phonetic: 'kha (âm cao, bật hơi mạnh)', name: 'Phụ âm Kha',
    meaning: 'Chữ cái thứ 2 trong 30 phụ âm Tạng. Nghĩa đen: Cái miệng, lời nói, tuyết, hoặc lối vào.',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཁ', vowel: 'a', tone: 'Cao bật hơi',
    spelling: ['Đọc trực tiếp căn tự: Kha (bật hơi)'],
    tips: ['Khẩu hình mở tự nhiên, đẩy luồng hơi mạnh từ cuống họng ra ngoài (âm bật hơi có gió).'],
    situation: 'Dùng chỉ cái miệng (ཁ), tuyết (ཁ་བ), hoặc lời nói (ཁ་སྐད).',
    teachings: 'Tượng trưng cho Khẩu thanh tịnh — lời nói chân thật, hòa ái, không vọng ngữ.'
  },
  'ག': {
    wylie: 'ga', phonetic: 'ga / ka (âm thấp)', name: 'Phụ âm Ga',
    meaning: 'Chữ cái thứ 3 trong 30 phụ âm Tạng. Âm thấp giọng.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ག', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Ga (hạ giọng trầm)'],
    tips: ['Hạ thấp thanh quản, phát âm trầm ấm và kéo dài nhẹ.'],
    situation: 'Dùng trong གང་ (cái gì), གལ་ཆེན་ (quan trọng).',
    teachings: 'Tượng trưng cho niềm hỷ lạc (Gawa) trên con đường tu học giải thoát.'
  },
  'ང': {
    wylie: 'nga', phonetic: 'nga (âm mũi thấp)', name: 'Phụ âm Nga',
    meaning: 'Chữ cái thứ 4 trong 30 phụ âm Tạng. Nghĩa đen: Tôi / Con / Bản thân (Đại từ nhân xưng).',
    pos: 'Phụ âm gốc / Đại từ', root: 'ང', vowel: 'a', tone: 'Thấp âm mũi',
    spelling: ['Đọc căn tự: Nga (âm mũi vòm họng)'],
    tips: ['Đưa luồng hơi qua khoang mũi, phát âm giống như "ng" trong tiếng Việt.'],
    situation: 'Đại từ xưng hô thông dụng: ང་ (tôi), ངའི་ (của tôi), ང་ཚོ་ (chúng tôi).',
    teachings: 'Quán chiếu về "Ngã" (bản ngã) để nhận diện tự tính vô ngã thanh lương.'
  },
  'ཅ': {
    wylie: 'ca', phonetic: 'ca / cha (âm cao, không bật hơi)', name: 'Phụ âm Ca',
    meaning: 'Chữ cái thứ 5 trong 30 phụ âm Tạng. Nhóm âm vòm cứng.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཅ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Ca'],
    tips: ['Đặt đầu lưỡi chạm vòm họng trước, phát âm [ch] nhẹ không bật hơi.'],
    situation: 'Dùng trong ཅ་ལག (đồ đạc), ཅི་ (cái gì).',
    teachings: 'Tượng trưng cho sự chú tâm chánh niệm trong từng sát-na.'
  },
  'ཆ': {
    wylie: 'cha', phonetic: 'cha (âm cao, bật hơi)', name: 'Phụ âm Cha',
    meaning: 'Chữ cái thứ 6 trong 30 phụ âm Tạng. Nghĩa đen: Nước (ཆུ), Pháp (ཆོས).',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཆ', vowel: 'a', tone: 'Cao bật hơi',
    spelling: ['Đọc căn tự: Cha (bật hơi)'],
    tips: ['Đầu lưỡi chạm vòm miệng rồi bật mạnh luồng gió ra.'],
    situation: 'Dùng tạo từ ཆུ་ (nước), ཆོས་ (Pháp bảo / Dharma).',
    teachings: 'Gắn liền với Pháp (Dharma) — dòng nước thanh tịnh tưới mát tâm thức chúng sinh.'
  },
  'ཇ': {
    wylie: 'ja', phonetic: 'ja (âm thấp)', name: 'Phụ âm Ja',
    meaning: 'Chữ cái thứ 7 trong 30 phụ âm Tạng. Nghĩa đen: Trà / Nước chè (Ja).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཇ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Ja (trầm giọng)'],
    tips: ['Thả lỏng lưỡi, phát âm trầm ấm tương tự "cha/da" trong giọng đàm thoại Tạng.'],
    situation: 'Nét văn hóa thưởng trà Tây Tạng: ཇ (trà), ཇ་མངར་མོ (trà ngọt), བོད་ཇ (trà bơ Tạng).',
    teachings: 'Uống trà trong chánh niệm — thưởng thức hương vị hiện tại không vọng tưởng.'
  },
  'ཉ': {
    wylie: 'nya', phonetic: 'nya (âm mũi thấp)', name: 'Phụ âm Nya',
    meaning: 'Chữ cái thứ 8 trong 30 phụ âm Tạng. Nghĩa đen: Con cá (ཉ) hoặc ngày rằm (ཉ་གང).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཉ', vowel: 'a', tone: 'Thấp âm mũi',
    spelling: ['Đọc căn tự: Nya'],
    tips: ['Ép phẳng thân lưỡi lên vòm họng, phát âm âm mũi [ny] giống "nh" trong tiếng Việt.'],
    situation: 'Dùng trong: ཉ (con cá), ཉ་པ (người đánh cá), ཉ་ཤ (thịt cá).',
    teachings: 'Tượng trưng cho Đôi cá vàng cát tường (Gser-nya) — sự tự do bơi lội trong biển Phật pháp.'
  },
  'ཏ': {
    wylie: 'ta', phonetic: 'ta (âm cao, không bật hơi)', name: 'Phụ âm Ta',
    meaning: 'Chữ cái thứ 9 trong 30 phụ âm Tạng. Âm đầu lưỡi răng.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཏ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Ta'],
    tips: ['Đầu lưỡi chạm mặt sau răng trên, bật âm [t] đanh gọn, không thở gió.'],
    situation: 'Dùng trong ཏ་ལའི་བླ་མ (Đức Đạt-lai Lạt-ma), གཏན་དུ (mãi mãi).',
    teachings: 'Tâm kiên định như kim cương bất hoại trên đường tu tập.'
  },
  'ཐ': {
    wylie: 'tha', phonetic: 'tha (âm cao, bật hơi)', name: 'Phụ âm Tha',
    meaning: 'Chữ cái thứ 10 trong 30 phụ âm Tạng. Nghĩa: Tận cùng, biên giới, kết thúc.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཐ', vowel: 'a', tone: 'Cao bật hơi',
    spelling: ['Đọc căn tự: Tha (bật hơi)'],
    tips: ['Đầu lưỡi chạm răng trên và bật luồng hơi mạnh ra trước.'],
    situation: 'Dùng trong ཐུགས་རྗེ་ཆེ (Cảm ơn / Đại bi), ཐོས་པ (lắng nghe).',
    teachings: 'Khởi sinh Tâm Đại Bi (Thugs-rje) bao trùm muôn loài khắp mười phương.'
  },
  'ད': {
    wylie: 'da', phonetic: 'da / ta (âm thấp)', name: 'Phụ âm Da',
    meaning: 'Chữ cái thứ 11 trong 30 phụ âm Tạng. Nghĩa đen: Bây giờ (ད), mặt trăng (ཟླ་བ).',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ད', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Da (trầm giọng)'],
    tips: ['Phát âm âm đầu lưỡi với thanh điệu trầm ấm.'],
    situation: 'Dùng trong དེང་སང (ngày nay), དགེ་འདུན (Tăng đoàn).',
    teachings: 'Trụ tâm trong giây phút hiện tại "Bây giờ và ở đây" (Da-lta).'
  },
  'ན': {
    wylie: 'na', phonetic: 'na (âm mũi thấp)', name: 'Phụ âm Na',
    meaning: 'Chữ cái thứ 12 trong 30 phụ âm Tạng. Nghĩa: Nếu (trợ từ giả định), bệnh tật.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ན', vowel: 'a', tone: 'Thấp âm mũi',
    spelling: ['Đọc căn tự: Na'],
    tips: ['Đầu lưỡi chạm nướu răng, đẩy hơi qua mũi, âm giống "n" tiếng Việt.'],
    situation: 'Dùng trong ནང་པ (Phật tử / Người hướng nội), ནམ་མཁའ (hư không).',
    teachings: 'Người học Phật hướng tâm vào bên trong (Nang-pa) để tìm về tự tính thanh tịnh.'
  },
  'པ': {
    wylie: 'pa', phonetic: 'pa (âm cao, không bật hơi)', name: 'Phụ âm Pa',
    meaning: 'Chữ cái thứ 13 trong 30 phụ âm Tạng. Nhóm âm môi.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'པ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Pa'],
    tips: ['Mím chặt hai môi rồi mở ra dứt khoát, âm sắc cao, không thở hơi.'],
    situation: 'Dùng trong པདྨ (hoa sen - Padma), དཔེ་ཆ (kinh sách).',
    teachings: 'Tượng trưng cho hoa sen tinh khiết mọc lên từ bùn nhơ mà không nhiễm bụi trần.'
  },
  'ཕ': {
    wylie: 'pha', phonetic: 'pha (âm cao, bật hơi)', name: 'Phụ âm Pha',
    meaning: 'Chữ cái thứ 14 trong 30 phụ âm Tạng. Nghĩa đen: Người cha (ཕ), bờ bên kia (ཕ་རོལ).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཕ', vowel: 'a', tone: 'Cao bật hơi',
    spelling: ['Đọc căn tự: Pha (bật hơi)'],
    tips: ['Hai môi mím nhẹ rồi mở ra tống luồng hơi mạnh ra ngoài.'],
    situation: 'Dùng trong ཕ་མ (cha mẹ), ཕ་རོལ་ཏུ་ཕྱིན་པ (Bát-nhã Ba-la-mật-đa / Đáo bỉ ngạn).',
    teachings: 'Đưa hành giả vượt qua biển khổ sinh tử cập bến bờ giác ngộ an vui.'
  },
  'བ': {
    wylie: 'ba', phonetic: 'ba / wa (âm thấp)', name: 'Phụ âm Ba',
    meaning: 'Chữ cái thứ 15 trong 30 phụ âm Tạng. Nghĩa đen: Con bò cái (བ), xứ Tây Tạng (བོད).',
    pos: 'Phụ âm gốc / Danh từ', root: 'བ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Ba (trầm giọng)'],
    tips: ['Môi mở nhẹ, phát âm ấm và trầm.'],
    situation: 'Dùng trong བོད་ཡིག (chữ Tạng), བཀྲ་ཤིས (cát tường), བདེ་སྐྱིད (hạnh phúc).',
    teachings: 'Đại diện cho cội nguồn đất Tạng tuyết sơn hộ trì giáo pháp Đại thừa Kim Cang Thừa.'
  },
  'མ': {
    wylie: 'ma', phonetic: 'ma (âm mũi thấp)', name: 'Phụ âm Ma',
    meaning: 'Chữ cái thứ 16 trong 30 phụ âm Tạng. Nghĩa đen: Người mẹ (ཨ་མ), không (tiền tố phủ định).',
    pos: 'Phụ âm gốc / Danh từ', root: 'མ', vowel: 'a', tone: 'Thấp âm mũi',
    spelling: ['Đọc căn tự: Ma'],
    tips: ['Khép hai môi, phát âm rung ấm qua khoang mũi.'],
    situation: 'Dùng trong ཨ་མ (mẹ hiền), མཁས་པ (bậc học giả), མེ་ཏོག (hoa tươi).',
    teachings: 'Quán chiếu tất cả chúng sinh trong muôn kiếp đều từng là cha mẹ hiền của mình.'
  },
  'ཙ': {
    wylie: 'tsa', phonetic: 'tsa (âm cao, không bật hơi)', name: 'Phụ âm Tsa',
    meaning: 'Chữ cái thứ 17 trong 30 phụ âm Tạng.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཙ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Tsa'],
    tips: ['Đầu lưỡi chạm răng trước rồi nhả âm [ts] đanh gọn, không thở hơi.'],
    situation: 'Dùng trong ཙི་ཙི (con chuột), རྩ་བ (căn bản / gốc rễ).',
    teachings: 'Gốc rễ của muôn pháp lành bắt đầu từ tâm Bồ-đề.'
  },
  'ཚ': {
    wylie: 'tsha', phonetic: 'tsha (âm cao, bật hơi)', name: 'Phụ âm Tsha',
    meaning: 'Chữ cái thứ 18 trong 30 phụ âm Tạng. Nghĩa đen: Nóng (ཚ་པོ), muối (ཚྭ).',
    pos: 'Phụ âm gốc / Tính từ', root: 'ཚ', vowel: 'a', tone: 'Cao bật hơi',
    spelling: ['Đọc căn tự: Tsha (bật hơi mạnh)'],
    tips: ['Bật luồng hơi mạnh qua khe răng trước khi phát âm [tsh].'],
    situation: 'Dùng trong ཚ་པོ (nóng bức), ཚོང་ཁང (cửa hàng), ཚོགས (tụ hội / Tăng đoàn).',
    teachings: 'Ngọn lửa trí tuệ thiêu rụi mọi phiền não vô minh.'
  },
  'ཛ': {
    wylie: 'dza', phonetic: 'dza (âm thấp)', name: 'Phụ âm Dza',
    meaning: 'Chữ cái thứ 19 trong 30 phụ âm Tạng. Xuất hiện trong thần chú Dzambhala.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཛ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Dza (trầm giọng)'],
    tips: ['Phát âm [dz] với thanh quản rung trầm ấm.'],
    situation: 'Dùng trong ཛམ་བྷ་ལ (Bảo Sanh Hoàng Thần Tài Dzambhala).',
    teachings: 'Tượng trưng cho sự viên mãn tài bảo tâm linh và công đức vô lượng.'
  },
  'ཝ': {
    wylie: 'wa', phonetic: 'wa (âm thấp)', name: 'Phụ âm Wa',
    meaning: 'Chữ cái thứ 20 trong 30 phụ âm Tạng. Nghĩa đen: Con cáo (ཝ་མོ).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཝ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Wa'],
    tips: ['Tròn môi nhẹ, phát âm lướt mềm mại.'],
    situation: 'Dùng trong ཝ (con cáo), ཝ་མོ (loài hồ ly), ཝ་ཟུར (chân chữ phụ Wa-zur).',
    teachings: 'Biểu hiện sự uyển chuyển, thích nghi linh hoạt của trí tuệ phương tiện.'
  },
  'ཞ': {
    wylie: 'zha', phonetic: 'zha (âm xát thấp)', name: 'Phụ âm Zha',
    meaning: 'Chữ cái thứ 21 trong 30 phụ âm Tạng. Nghĩa đen: Cái mũ (ཞྭ་མོ), thanh tịnh tịch diệt (ཞི་བ).',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཞ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Zha'],
    tips: ['Uốn nhẹ đầu lưỡi, phát âm xát nhẹ [zh] trầm ấm.'],
    situation: 'Dùng trong ཞི་བ (tịch tĩnh / an lạc), ཞི་གནས (Thiền Chỉ Samatha).',
    teachings: 'Thiền Chỉ (Samatha - Zhi-gnas) mang lại sự an định tĩnh lặng tuyệt đối cho tâm hồn.'
  },
  'ཟ': {
    wylie: 'za', phonetic: 'za (âm xát thấp)', name: 'Phụ âm Za',
    meaning: 'Chữ cái thứ 22 trong 30 phụ âm Tạng. Nghĩa đen: Ăn (động từ ཟ), hành tinh/ngày (གཟའ).',
    pos: 'Phụ âm gốc / Động từ', root: 'ཟ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Za'],
    tips: ['Để đầu lưỡi gần răng cửa dưới, phát âm âm [z] rung nhẹ thanh đới.'],
    situation: 'Dùng trong: ཟ (ăn), ཟ་ཁང (nhà hàng / quán ăn), ཟས་ (thức ăn).',
    teachings: 'Ăn uống trong chánh niệm, biết ơn vạn vật và nuôi dưỡng thân tâm thanh tịnh.'
  },
  'འ': {
    wylie: "'a", phonetic: "'a (âm thanh hầu nhẹ)", name: 'Phụ âm A-chung',
    meaning: 'Chữ cái thứ 23 trong 30 phụ âm Tạng (A nhỏ). Đóng vai trò làm tiền tự và hậu tự quan trọng.',
    pos: 'Phụ âm gốc / Tiền tự / Hậu tự', root: 'འ', vowel: 'a', tone: 'Thấp nhẹ',
    spelling: ['Đọc căn tự: A-chung'],
    tips: ['Mở họng nhẹ nhàng từ đáy thanh quản, âm thanh thanh thoát.'],
    situation: 'Dùng làm biến âm tiền tố: འགྲོ (đi), འདི (đây), འཁོར་བ (luân hồi).',
    teachings: 'Tượng trưng cho Luân hồi (Khor-ba) và cánh cửa chuyển hóa nghiệp chướng.'
  },
  'ཡ': {
    wylie: 'ya', phonetic: 'ya (âm bán nguyên âm thấp)', name: 'Phụ âm Ya',
    meaning: 'Chữ cái thứ 24 trong 30 phụ âm Tạng. Thường làm chân chữ Ya-tags.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཡ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Ya'],
    tips: ['Nâng thân lưỡi hướng về ngạc cứng, phát âm lướt mượt mà.'],
    situation: 'Dùng trong ཡིག་གེ (chữ viết), ཡར་རྒྱས (tiến bộ), ཡག་པོ (tốt đẹp).',
    teachings: 'Tâm hướng thượng (Yargyas) tinh tấn trên bước đường văn - tư - tu.'
  },
  'ར': {
    wylie: 'ra', phonetic: 'ra (âm rung thấp)', name: 'Phụ âm Ra',
    meaning: 'Chữ cái thứ 25 trong 30 phụ âm Tạng. Nghĩa đen: Con dê (ར), ngọn núi (རི).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ར', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: Ra (rung nhẹ đầu lưỡi)'],
    tips: ['Rung nhẹ đầu lưỡi ở vòm răng trên.'],
    situation: 'Dùng trong: ར (con dê), རི (núi cao), རིན་པོ་ཆེ (Rinpoche - Bậc bảo châu tôn kính).',
    teachings: 'Núi cao biểu tượng cho sự vững chãi, uy nghi và từ bi vô lượng của bậc Đạo sư.'
  },
  'ལ': {
    wylie: 'la', phonetic: 'la (âm cạnh lưỡi thấp)', name: 'Phụ âm La',
    meaning: 'Chữ cái thứ 26 trong 30 phụ âm Tạng. Nghĩa đen: Đèo núi (ལ), trợ từ chỉ vị trí (ở, tại, vào).',
    pos: 'Phụ âm gốc / Trợ từ / Danh từ', root: 'ལ', vowel: 'a', tone: 'Thấp',
    spelling: ['Đọc căn tự: La'],
    tips: ['Áp đầu lưỡi lên chân răng trên, luồng hơi thoát ra hai bên cạnh lưỡi.'],
    situation: 'Dùng trong བཀྲ་ཤིས་བདེ་ལེགས (cát tường), ལྷ་ས (Lhasa - Thánh địa của chư Thiên).',
    teachings: 'Mỗi bước qua con đèo (La) là một lần vượt qua chướng ngại tâm thức để lên đỉnh an lạc.'
  },
  'ཤ': {
    wylie: 'sha', phonetic: 'sha (âm xát cao)', name: 'Phụ âm Sha',
    meaning: 'Chữ cái thứ 27 trong 30 phụ âm Tạng. Nghĩa đen: Thịt (ཤ), con hươu (ཤྭ་བ).',
    pos: 'Phụ âm gốc / Danh từ', root: 'ཤ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Sha'],
    tips: ['Uốn cong nhẹ lưỡi, đẩy luồng hơi êm qua vòm họng.'],
    situation: 'Dùng trong: ཤ (thịt), ཤེས་རབ (Trí tuệ Bát-nhã / Prajna), ཤཱཀྱ་མུ་ནེ (Đức Phật Thích Ca).',
    teachings: 'Trí Tuệ Bát Nhã (Sherab - Prajna) soi chiếu tận cùng bản thể vũ trụ muôn loài.'
  },
  'ས': {
    wylie: 'sa', phonetic: 'sa (âm xát cao)', name: 'Phụ âm Sa',
    meaning: 'Chữ cái thứ 28 trong 30 phụ âm Tạng. Nghĩa đen: Đất đai / Địa đại (ས), nơi chốn.',
    pos: 'Phụ âm gốc / Danh từ', root: 'ས', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Sa'],
    tips: ['Đầu lưỡi chạm chân răng dưới, phát âm [s] sắc gọn, âm vực cao.'],
    situation: 'Dùng trong ས་རཱ (Học viện Phật giáo Sara), སེམས (tâm thức), སངས་རྒྱས (Phật Đà).',
    teachings: 'Tâm thanh tịnh tỏa rạng thành tựu Quả vị Phật (Sangye) viên mãn vô thượng.'
  },
  'ཧ': {
    wylie: 'ha', phonetic: 'ha (âm thanh hầu cao)', name: 'Phụ âm Ha',
    meaning: 'Chữ cái thứ 29 trong 30 phụ âm Tạng. Xuất hiện trong thần chú Kim Cang.',
    pos: 'Phụ âm gốc (Căn tự)', root: 'ཧ', vowel: 'a', tone: 'Cao',
    spelling: ['Đọc căn tự: Ha (thở luồng hơi sâu từ ngực)'],
    tips: ['Mở rộng cuống họng, đẩy luồng hơi mạnh và thanh thoát từ ngực.'],
    situation: 'Dùng trong ཧ་ཅང (rất nhiều), thần chú ཨོཾ་ཨཱཿཧཱུྃ (Om Ah Hum).',
    teachings: 'Âm thanh đại biểu cho Ý thanh tịnh và Pháp thân viên giác bất khả hoại.'
  },
  'ཨ': {
    wylie: 'a', phonetic: 'a (âm gốc nguyên thủy)', name: 'Phụ âm A',
    meaning: 'Chữ cái thứ 30 — Chữ cái tối thượng trong Tạng ngữ. Cội nguồn sinh khởi của vạn pháp.',
    pos: 'Phụ âm gốc / Căn tự tối cao', root: 'ཨ', vowel: 'a', tone: 'Cao thanh tịnh',
    spelling: ['Đọc căn tự: A'],
    tips: ['Mở khẩu hình tròn tự nhiên, phát âm "A" thanh thoát, sâu lắng.'],
    situation: 'Dùng trong ཨ་མ (mẹ hiền), ཨོཾ (OM), chủng tự A trong thiền Đại Toàn Thiện Dzogchen.',
    teachings: 'Chữ A tượng trưng cho Tính Không Vô Sanh (Anutpada) — nguồn gốc của toàn bộ kinh điển và chân ngôn.'
  }
};

// ── BẢNG TỪ ĐIỂN TẠNG - VIỆT TOÀN DIỆN (LEXICON & COMPOUND PHRASES) ──
interface LexiconEntry {
  wylie: string;
  phonetic: string;
  meaning: string;
  pos: string;
  teachings?: string;
}

const TIBETAN_LEXICON_DATABASE: Record<string, LexiconEntry> = {
  // ── Tiêu đề & Thuật ngữ Giáo trình Sara Book ──
  'སྐད་ཡིག་འཛིན་གྲྭ': {
    wylie: "skad-yig 'dzin-grwa",
    phonetic: 'ke-yik dzin-dra',
    meaning: 'Lớp học ngôn ngữ / Khóa học tiếng Tạng',
    pos: 'Cụm danh từ',
    teachings: 'Học ngôn ngữ Phật pháp là phương tiện thù thắng để tiếp cận kho tàng kinh điển giác ngộ.'
  },
  'སྐད་ཡིག': {
    wylie: 'skad-yig',
    phonetic: 'ke-yik',
    meaning: 'Ngôn ngữ / Văn tự / Tiếng nói và chữ viết',
    pos: 'Danh từ',
    teachings: 'Tạng ngữ lưu giữ trọn vẹn nhất kho tàng Đại tạng kinh Phật giáo Đại thừa và Kim Cương thừa.'
  },
  'འཛིན་གྲྭ': {
    wylie: "'dzin-grwa",
    phonetic: 'dzin-dra',
    meaning: 'Lớp học / Khóa học / Lớp đào tạo',
    pos: 'Danh từ'
  },
  'ས་རཱ': {
    wylie: 'sa-ra',
    phonetic: 'sa-ra',
    meaning: 'Học viện Phật giáo Cao đẳng Sara (Dharamsala, Ấn Độ)',
    pos: 'Danh từ riêng',
    teachings: 'Viện Phật học danh tiếng đào tạo ngôn ngữ và triết học Phật giáo Tây Tạng.'
  },
  'བོད་ཀྱི་མཐོ་རིམ་སློབ་གཉེར་ཁང': {
    wylie: "bod-kyi mtho-rim slob-gnyer-khang",
    phonetic: 'pö-kyi tho-rim lob-nyer-khang',
    meaning: 'Học viện Cao đẳng Phật học Tây Tạng',
    pos: 'Cụm danh từ'
  },
  'མཐོ་རིམ': {
    wylie: 'mtho-rim',
    phonetic: 'tho-rim',
    meaning: 'Bậc cao / Cao cấp / Bậc đại học',
    pos: 'Tính từ'
  },
  'སློབ་གཉེར': {
    wylie: 'slob-gnyer',
    phonetic: 'lob-nyer',
    meaning: 'Tu học / Nghiên cứu Phật pháp / Học tập',
    pos: 'Động từ'
  },
  'སློབ་གཉེར་ཁང': {
    wylie: 'slob-gnyer-khang',
    phonetic: 'lob-nyer-khang',
    meaning: 'Học viện / Trung tâm đào tạo Phật học',
    pos: 'Danh từ'
  },
  'སློབ་དེབ': {
    wylie: 'slob-deb',
    phonetic: 'lob-dep',
    meaning: 'Sách giáo khoa / Giáo trình học tập',
    pos: 'Danh từ'
  },
  'སློབ་ཚན': {
    wylie: 'slob-tshan',
    phonetic: 'lob-tshen',
    meaning: 'Bài học / Tiết học / Đề mục',
    pos: 'Danh từ'
  },
  'དབྱངས་བཞི': {
    wylie: 'dbyangs-bzhi',
    phonetic: 'yang-zhi',
    meaning: '4 Nguyên Âm Gốc trong tiếng Tạng (i, u, e, o: ི ུ ེ ོ)',
    pos: 'Ngữ pháp',
    teachings: 'Nguyên âm kết hợp với 30 phụ âm tạo thành toàn bộ thanh âm vi diệu của ngôn ngữ Tạng.'
  },
  'གསལ་བྱེད་སུམ་ཅུ': {
    wylie: 'gsal-byed sum-cu',
    phonetic: 'sal-je sum-chu',
    meaning: 'Ba mươi phụ âm căn bản tiếng Tạng (từ Ka đến A)',
    pos: 'Ngữ pháp',
    teachings: '30 phụ âm do đại học giả Thonmi Sambhota sáng tạo dựa trên cổ ngữ Phạn ngữ.'
  },
  'སྦྱོར་ཀློག': {
    wylie: 'sbyor-klog',
    phonetic: 'jor-lok',
    meaning: 'Học đánh vần & Ghép vần tiếng Tạng',
    pos: 'Động từ / Ngữ pháp',
    teachings: 'Phương pháp đánh vần truyền thống của các tu viện giúp phát âm chuẩn xác từng nét chữ.'
  },
  'མགོ་ཅན': {
    wylie: 'mgo-can',
    phonetic: 'go-chen',
    meaning: 'Chữ đội đầu (Ra-mgo རྐ, La-mgo ལྐ, Sa-mgo སྐ)',
    pos: 'Ngữ pháp'
  },
  'འདོགས་ཅན': {
    wylie: "'dogs-can",
    phonetic: 'dok-chen',
    meaning: 'Chữ mang chân phụ (Ya-btags ཀྱ, Ra-btags ཀྲ, La-btags ཀླ, Wa-zur ཀྭ)',
    pos: 'Ngữ pháp'
  },
  'སྔོན་འཇུག': {
    wylie: "sngon-'jug",
    phonetic: 'ngon-juk',
    meaning: 'Tiền tự (5 chữ cái đứng trước căn tự: ག, ད, བ, མ, འ)',
    pos: 'Ngữ pháp'
  },
  'རྗེས་འཇུག': {
    wylie: "rjes-'jug",
    phonetic: 'je-juk',
    meaning: 'Hậu tự (10 chữ cái đứng sau căn tự: ག, ང, ད, ན, བ, མ, འ, ར, ལ, ས)',
    pos: 'Ngữ pháp'
  },
  'ཨ་འགྲེང་པོ': {
    wylie: "a 'greng-po",
    phonetic: 'a dreng-po',
    meaning: "Cách ghép nguyên âm E ( ེ) trên chữ A: 'A dreng-po E' (ཨ +  ེ = ཨེ)",
    pos: 'Ngữ pháp ghép vần',
    teachings: 'Nguyên âm thứ 3 trong 4 nguyên âm gốc tiếng Tạng.'
  },
  'ཨ་གི་གུ': {
    wylie: 'a gi-gu',
    phonetic: 'a gi-gu',
    meaning: "Cách ghép nguyên âm I ( ི) trên chữ A: 'A gi-gu I' (ཨ +  ི = ཨི)",
    pos: 'Ngữ pháp ghép vần',
    teachings: 'Nguyên âm thứ 1 trong 4 nguyên âm gốc tiếng Tạng.'
  },
  'ཨ་ཞབས་བཅུ': {
    wylie: 'a zhabs-kyu',
    phonetic: 'a shap-kyu',
    meaning: "Cách ghép nguyên âm U ( ུ) dưới chữ A: 'A zhabs-kyu U' (ཨ +  ུ = ཨུ)",
    pos: 'Ngữ pháp ghép vần',
    teachings: 'Nguyên âm thứ 2 trong 4 nguyên âm gốc tiếng Tạng.'
  },
  'ཨ་ན་རོ': {
    wylie: 'a na-ro',
    phonetic: 'a na-ro',
    meaning: "Cách ghép nguyên âm O ( ོ) trên chữ A: 'A na-ro O' (ཨ +  ོ = ཨོ)",
    pos: 'Ngữ pháp ghép vần',
    teachings: 'Nguyên âm thứ 4 trong 4 nguyên âm gốc tiếng Tạng.'
  },

  // ── Từ vựng, Căn tự & Âm tiết Đơn ──
  'སྐད': { wylie: 'skad', phonetic: 'ke', meaning: 'Tiếng nói / Ngôn ngữ / Lời nói / Âm thanh', pos: 'Danh từ' },
  'ཡིག': { wylie: 'yig', phonetic: 'yik', meaning: 'Chữ viết / Văn tự / Bức thư / Chữ Tạng', pos: 'Danh từ' },
  'འཛིན': { wylie: "'dzin", phonetic: 'dzin', meaning: 'Nắm giữ / Tiếp nhận / Quản lý / Tiếp thu', pos: 'Động từ' },
  'གྲྭ': { wylie: 'grwa', phonetic: 'dra', meaning: 'Lớp học / Trường học / Tăng xá / Hội chúng', pos: 'Danh từ' },
  'དབྱངས': { wylie: 'dbyangs', phonetic: 'yang', meaning: 'Nguyên âm / Giai điệu / Thanh âm vi diệu', pos: 'Danh từ / Ngữ pháp' },
  'བཞི': { wylie: 'bzhi', phonetic: 'zhi', meaning: 'Số 4 (Bốn)', pos: 'Số từ' },
  'གསལ་བྱེད': { wylie: 'gsal-byed', phonetic: 'sal-je', meaning: 'Phụ âm (Chữ cái làm sáng rõ âm thanh)', pos: 'Ngữ pháp' },
  'གསལ': { wylie: 'gsal', phonetic: 'sal', meaning: 'Sáng tỏ / Rõ ràng / Soi sáng', pos: 'Tính từ' },
  'བྱེད': { wylie: 'byed', phonetic: 'je', meaning: 'Làm / Thực hiện / Tạo tác', pos: 'Động từ' },
  'སྦྱོར': { wylie: 'sbyor', phonetic: 'jor', meaning: 'Ghép nối / Kết hợp / Liên kết', pos: 'Động từ' },
  'ཀློག': { wylie: 'klog', phonetic: 'lok', meaning: 'Đọc / Đọc kinh / Trì tụng', pos: 'Động từ' },
  'བོད': { wylie: 'bod', phonetic: 'pö', meaning: 'Tây Tạng (Xứ Tuyết)', pos: 'Danh từ riêng' },
  'བོད་ཡིག': { wylie: 'bod-yig', phonetic: 'pö-yik', meaning: 'Chữ Tạng / Tạng ngữ / Tiếng Tạng', pos: 'Danh từ' },
  'བོད་སྐད': { wylie: 'bod-skad', phonetic: 'pö-ke', meaning: 'Khẩu ngữ tiếng Tạng', pos: 'Danh từ' },
  'བོད་པ': { wylie: 'bod-pa', phonetic: 'pö-pa', meaning: 'Người Tây Tạng', pos: 'Danh từ' },
  'སློབ': { wylie: 'slob', phonetic: 'lob', meaning: 'Học tập / Huấn luyện / Rèn luyện', pos: 'Động từ' },
  'སློབ་མ': { wylie: 'slob-ma', phonetic: 'lob-ma', meaning: 'Học trò / Học viên / Đệ tử', pos: 'Danh từ' },
  'སློབ་ཕྲུག': { wylie: 'slob-phrug', phonetic: 'lob-thruk', meaning: 'Học sinh / Trẻ em đi học', pos: 'Danh từ' },
  'སློབ་དཔོན': { wylie: 'slob-dpon', phonetic: 'lob-pön', meaning: 'Giảng sư / Bậc thầy / A-xà-lê (Acarya)', pos: 'Danh từ (Kính ngữ)' },
  'དགེ་རྒན': { wylie: 'dge-rgan', phonetic: 'gen-gen', meaning: 'Giáo viên / Thầy giáo (Kính ngữ)', pos: 'Danh từ' },
  'དགེ་འདུན': { wylie: "dge-'dun", phonetic: 'gen-dun', meaning: 'Tăng đoàn / Chư Tăng Ni thanh tịnh', pos: 'Danh từ' },
  'དགེ་བ': { wylie: 'dge-ba', phonetic: 'ge-wa', meaning: 'Thiện lành / Đức hạnh / Phước đức', pos: 'Danh từ / Tính từ' },
  'བླ་མ': { wylie: 'bla-ma', phonetic: 'la-ma', meaning: 'Bậc Đạo Sư tối thượng (Guru / Thầy)', pos: 'Danh từ (Kính ngữ)' },
  'སངས་རྒྱས': { wylie: 'sangs-rgyas', phonetic: 'sang-gye', meaning: 'Đức Phật (Bậc Giác Ngộ hoàn toàn)', pos: 'Danh từ' },
  'ཆོས': { wylie: 'chos', phonetic: 'chö', meaning: 'Phật pháp / Giáo pháp / Chân lý (Dharma)', pos: 'Danh từ' },
  'བྱང་ཆུབ': { wylie: 'byang-chub', phonetic: 'jang-chub', meaning: 'Bồ-đề / Sự Giác Ngộ (Bodhi)', pos: 'Danh từ' },
  'སེམས': { wylie: 'sems', phonetic: 'sem', meaning: 'Tâm / Tâm thức / Ý nghĩ (Citta)', pos: 'Danh từ' },
  'བྱང་ཆུབ་སེམས': { wylie: 'byang-chub sems', phonetic: 'jang-chub sem', meaning: 'Bồ-đề tâm (Bodhicitta)', pos: 'Danh từ Phật học' },
  'སྙིང་རྗེ': { wylie: 'snying-rje', phonetic: 'nying-je', meaning: 'Lòng Đại Từ Bi (Karuna)', pos: 'Danh từ Phật học' },
  'ཤེས་རབ': { wylie: 'shes-rab', phonetic: 'she-rap', meaning: 'Trí tuệ Bát-nhã (Prajna)', pos: 'Danh từ Phật học' },
  'སྟོང་པ་ཉིད': { wylie: 'stong-pa nyid', phonetic: 'tong-pa nyi', meaning: 'Bản thể Tính Không (Sunyata)', pos: 'Danh từ Phật học' },

  // ── Các sự vật, hình ảnh minh họa bài học trong sách Sara ──
  'རི': { wylie: 'ri', phonetic: 'ri', meaning: 'Ngọn núi / Núi tuyết', pos: 'Danh từ' },
  'ཞི་མི': { wylie: 'zhi-mi', phonetic: 'zhi-mi', meaning: 'Con mèo', pos: 'Danh từ' },
  'ཉི་མ': { wylie: 'nyi-ma', phonetic: 'nyi-ma', meaning: 'Mặt trời / Ánh nắng ban ngày', pos: 'Danh từ' },
  'ཀུ་ཤུ': { wylie: 'ku-shu', phonetic: 'ku-shu', meaning: 'Quả táo', pos: 'Danh từ' },
  'ཆུ': { wylie: 'chu', phonetic: 'chu', meaning: 'Nước / Nước uống / Dòng suối', pos: 'Danh từ' },
  'མེ': { wylie: 'me', phonetic: 'me', meaning: 'Ngọn lửa / Lửa', pos: 'Danh từ' },
  'ས': { wylie: 'sa', phonetic: 'sa', meaning: 'Đất đai / Mặt đất / Cõi giới', pos: 'Danh từ' },
  'རླུང': { wylie: 'rlung', phonetic: 'lung', meaning: 'Gió / Khí / Sinh khí (Prana)', pos: 'Danh từ' },
  'མིག': { wylie: 'mig', phonetic: 'mik', meaning: 'Con mắt / Tuệ nhãn', pos: 'Danh từ' },
  'རྣ་བ': { wylie: 'rna-ba', phonetic: 'na-wa', meaning: 'Cái tai / Lỗ tai', pos: 'Danh từ' },
  'ལག་པ': { wylie: 'lag-pa', phonetic: 'lak-pa', meaning: 'Bàn tay / Tay', pos: 'Danh từ' },
  'རྐང་པ': { wylie: 'rkang-pa', phonetic: 'kang-pa', meaning: 'Bàn chân / Chân', pos: 'Danh từ' },
  'ཉ': { wylie: 'nya', phonetic: 'nya', meaning: 'Con cá / Ngày rằm trăng tròn', pos: 'Danh từ' },
  'ཉ་པ': { wylie: 'nya-pa', phonetic: 'nya-pa', meaning: 'Người đánh cá / Ngư phủ', pos: 'Danh từ' },
  'ཀ་བ': { wylie: 'ka-ba', phonetic: 'ka-ba', meaning: 'Cột trụ / Cột đình nhà', pos: 'Danh từ' },
  'ཁ་བ': { wylie: 'kha-ba', phonetic: 'kha-ba', meaning: 'Tuyết trắng / Vị đắng', pos: 'Danh từ / Tính từ' },
  'ཇ': { wylie: 'ja', phonetic: 'ja', meaning: 'Trà / Nước chè', pos: 'Danh từ' },
  'ཇ་པ': { wylie: 'ja-pa', phonetic: 'ja-pa', meaning: 'Người bán trà / Người pha trà', pos: 'Danh từ' },
  'ཕ': { wylie: 'pha', phonetic: 'pha', meaning: 'Cha / Thân phụ', pos: 'Danh từ' },
  'མ': { wylie: 'ma', phonetic: 'ma', meaning: 'Mẹ / Mẫu thân / Nguyên âm', pos: 'Danh từ' },
  'བུ': { wylie: 'bu', phonetic: 'bu', meaning: 'Con trai / Đứa trẻ', pos: 'Danh từ' },
  'བུ་མོ': { wylie: 'bu-mo', phonetic: 'pu-mo', meaning: 'Con gái / Cô gái', pos: 'Danh từ' },
  'ཁྱི': { wylie: 'khyi', phonetic: 'khyi', meaning: 'Con chó', pos: 'Danh từ' },
  'གླང': { wylie: 'glang', phonetic: 'lang', meaning: 'Con bò / Con voi', pos: 'Danh từ' },
  'རྟ': { wylie: 'rta', phonetic: 'ta', meaning: 'Con ngựa', pos: 'Danh từ' },
  'ལུག': { wylie: 'lug', phonetic: 'luk', meaning: 'Con cừu', pos: 'Danh từ' },
  'བྱ': { wylie: 'bya', phonetic: 'ja', meaning: 'Con chim', pos: 'Danh từ' },
  'ཤིང': { wylie: 'shing', phonetic: 'shing', meaning: 'Cây cối / Gỗ', pos: 'Danh từ' },
  'མེ་ཏོག': { wylie: 'me-tog', phonetic: 'me-tok', meaning: 'Bông hoa / Hoa tươi', pos: 'Danh từ' },
  'པདྨ': { wylie: 'pad-ma', phonetic: 'pe-ma', meaning: 'Hoa sen thanh tịnh', pos: 'Danh từ' },
  'དཔེ་ཆ': { wylie: 'dpe-cha', phonetic: 'pe-cha', meaning: 'Kinh sách / Sách học', pos: 'Danh từ' },
  'ཤག': { wylie: 'shag', phonetic: 'shak', meaning: 'Tăng phòng / Phòng ở trong tu viện', pos: 'Danh từ' },
  'མིང': { wylie: 'ming', phonetic: 'ming', meaning: 'Tên / Danh xưng / Tên gọi', pos: 'Danh từ' },
  'ཁྱེད': { wylie: 'khyed', phonetic: 'khye', meaning: 'Bạn / Ngài / Anh / Chị (Kính ngữ)', pos: 'Đại từ' },
  'ཁྱེད་རང': { wylie: 'khyed-rang', phonetic: 'khye-rang', meaning: 'Bạn / Anh / Chị (Lịch sự)', pos: 'Đại từ' },
  'ང': { wylie: 'nga', phonetic: 'nga', meaning: 'Tôi / Con / Bản thân tôi', pos: 'Đại từ' },
  'ཁོང': { wylie: 'khong', phonetic: 'khong', meaning: 'Ngài ấy / Vị ấy (Tôn kính)', pos: 'Đại từ' },
  'ཁོ': { wylie: 'kho', phonetic: 'kho', meaning: 'Anh ấy / Nó / Người ấy', pos: 'Đại từ' },
  'མོ': { wylie: 'mo', phonetic: 'mo', meaning: 'Cô ấy / Bà ấy', pos: 'Đại từ' },
  'འདི': { wylie: "'di", phonetic: 'di', meaning: 'Cái này / Đây / Điều này', pos: 'Đại từ chỉ định' },
  'དེ': { wylie: 'de', phonetic: 'de', meaning: 'Cái kia / Đó / Điều ấy', pos: 'Đại từ chỉ định' },
  'ཡིན': { wylie: 'yin', phonetic: 'yin', meaning: 'Là (Động từ to be - khẳng định ngôi 1)', pos: 'Trợ từ / Động từ' },
  'རེད': { wylie: 'red', phonetic: 're', meaning: 'Là (Động từ to be - ngôi 2, 3)', pos: 'Trợ từ / Động từ' },
  'ཡོད': { wylie: 'yod', phonetic: 'yö', meaning: 'Có / Hiện diện (ngôi 1)', pos: 'Động từ' },
  'འདུག': { wylie: "'dug", phonetic: 'duk', meaning: 'Có / Đang có (trực kiến)', pos: 'Động từ' },
  'མེད': { wylie: 'med', phonetic: 'me', meaning: 'Không có (Phủ định)', pos: 'Trợ từ phủ định' },
  'མིན': { wylie: 'min', phonetic: 'min', meaning: 'Không phải là (Phủ định)', pos: 'Trợ từ phủ định' },
  'ཀྱི': { wylie: 'kyi', phonetic: 'kyi', meaning: 'Của (Sở hữu cách đứng sau d, b, s)', pos: 'Hư từ sở hữu' },
  'གྱི': { wylie: 'gyi', phonetic: 'gyi', meaning: 'Của (Sở hữu cách đứng sau g, ng)', pos: 'Hư từ sở hữu' },
  'གྱིས': { wylie: 'gyis', phonetic: 'gyi', meaning: 'Bởi / Do (Tác cách đứng sau g, ng)', pos: 'Hư từ tác cách' },
  'ཀྱིས': { wylie: 'kyis', phonetic: 'kyi', meaning: 'Bởi / Do (Tác cách đứng sau d, b, s)', pos: 'Hư từ tác cách' },
  'ཀྱང': { wylie: 'kyang', phonetic: 'kyang', meaning: 'Cũng / Dẫu cho / Tuy nhiên', pos: 'Liên từ' },
  'ཡང': { wylie: 'yang', phonetic: 'yang', meaning: 'Cũng / Lại nữa', pos: 'Liên từ' },
  'དང་': { wylie: 'dang', phonetic: 'dang', meaning: 'Và / Cùng với / Kèm theo', pos: 'Liên từ' },
  'ནས': { wylie: 'nas', phonetic: 'ne', meaning: 'Từ (nơi chốn) / Sau khi (thời gian)', pos: 'Giới từ' },
  'ལ': { wylie: 'la', phonetic: 'la', meaning: 'Ở / Tại / Đến / Cho (Vị cách, hướng cách)', pos: 'Giới từ' },
  'དང་པོ': { wylie: 'dang-po', phonetic: 'dang-po', meaning: 'Đầu tiên / Thứ nhất / Bài 1', pos: 'Số thứ tự' },
  'གཉིས་པ': { wylie: 'gnyis-pa', phonetic: 'nyi-pa', meaning: 'Thứ hai / Bài 2', pos: 'Số thứ tự' },
  'གསུམ་པ': { wylie: 'gsum-pa', phonetic: 'sum-pa', meaning: 'Thứ ba / Bài 3', pos: 'Số thứ tự' },
  'བཞི་པ': { wylie: 'bzhi-pa', phonetic: 'zhi-pa', meaning: 'Thứ tư / Bài 4', pos: 'Số thứ tự' },
  'ལྔ་པ': { wylie: 'lnga-pa', phonetic: 'nga-pa', meaning: 'Thứ năm / Bài 5', pos: 'Số thứ tự' }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = (body.text || body.prompt || '').trim();

    if (!text) {
      return NextResponse.json({ status: 'error', message: 'Thiếu text' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      const fallbackAnalysis = generateFallbackAnalysis(text);
      return NextResponse.json({
        status: 'success',
        ...fallbackAnalysis,
        analysis: fallbackAnalysis,
      });
    }

    const prompt = `Bạn là chuyên gia ngôn ngữ học Cổ ngữ Tạng và Phật học Tây Tạng. Hãy phân tích đoạn chữ Tạng sau: "${text}".
LƯU Ý: Nếu đây là 1 chữ cái đơn lẻ (như ཁ, ང, ཇ...), hãy phân tích đúng chữ cái đó, nêu rõ là phụ âm thứ mấy, cách phát âm, căn tự và ý nghĩa Phật học.
Trả về DUY NHẤT một JSON hợp lệ với cấu trúc sau (không kèm markdown \`\`\`json, không kèm giải thích ngoài JSON):
{
  "wylie": "chuyển tự Wylie (EWTS) đầy đủ",
  "full_translation": "Dịch nghĩa hoàn chỉnh câu/từ sang tiếng Việt",
  "dictionary": {
    "vn": "Nghĩa tổng quát tiếng Việt",
    "usage": "Ngữ cảnh sử dụng trong đàm thoại hoặc tu tập"
  },
  "table_rows": [
    {
      "tibetan": "từ/cụm từ/chữ Tạng",
      "phonetic": "phiên âm đọc tiếng Việt/IPA",
      "wylie": "chuyển tự wylie của từ này",
      "meaning": "nghĩa tiếng Việt",
      "pos": "Căn tự / Danh từ / Động từ / Tính từ / Trợ từ..."
    }
  ],
  "syllables": [
    {
      "syllable": "từng âm tiết Tạng",
      "wylie": "wylie âm tiết",
      "root": "căn tự gốc",
      "prefix": "tiền tự (nếu có, không có ghi '-')",
      "suffix": "hậu tự (nếu có, không có ghi '-')",
      "vowel": "nguyên âm",
      "spelling_steps": ["bước ghép vần theo phương pháp tu viện"],
      "coach_guide": {
        "correction_tips": ["mẹo khẩu hình uốn lưỡi / bật hơi"]
      }
    }
  ],
  "usage_context": {
    "situation": "Tình huống giao tiếp thực tế",
    "cultural_notes": "Ghi chú văn hóa Phật giáo Tây Tạng",
    "dialogue_examples": [
      {
        "speaker": "Học viên",
        "tibetan": "câu tiếng Tạng mẫu",
        "wylie": "wylie câu mẫu",
        "vn": "nghĩa tiếng Việt câu mẫu"
      }
    ]
  },
  "buddhist_context": {
    "scripture_quote": "Trích dẫn kinh luận liên quan nếu có",
    "teachings": "Ý nghĩa giáo lý",
    "philosophy_reflection": "Ứng dụng trong quán chiếu tu tập thân tâm"
  }
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
        }),
      }
    );

    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          status: 'success',
          ...parsed,
          analysis: parsed,
        });
      }
    }

    const fallback = generateFallbackAnalysis(text);
    return NextResponse.json({
      status: 'success',
      ...fallback,
      analysis: fallback,
    });
  } catch (err: any) {
    console.error('[/api/analyze] Error:', err);
    const fallback = generateFallbackAnalysis('ཁ');
    return NextResponse.json({
      status: 'success',
      ...fallback,
      analysis: fallback,
    });
  }
}

function generateFallbackAnalysis(text: string) {
  const clean = text.trim();

  // 1. Nếu là 1 trong 30 phụ âm đơn lẻ
  if (TIBETAN_CONSONANTS_DICT[clean]) {
    const meta = TIBETAN_CONSONANTS_DICT[clean];
    return {
      wylie: meta.wylie,
      full_translation: `${meta.name} (Âm "${meta.wylie}"): ${meta.meaning}`,
      dictionary: {
        vn: meta.meaning,
        usage: meta.situation,
      },
      table_rows: [
        {
          tibetan: clean,
          phonetic: meta.phonetic,
          wylie: meta.wylie,
          meaning: meta.meaning,
          pos: meta.pos,
        },
      ],
      syllables: [
        {
          syllable: clean,
          wylie: meta.wylie,
          root: meta.root,
          prefix: '-',
          suffix: '-',
          vowel: meta.vowel,
          spelling_steps: meta.spelling,
          coach_guide: {
            correction_tips: meta.tips,
          },
        },
      ],
      usage_context: {
        situation: meta.situation,
        cultural_notes: `Phụ âm mang thanh điệu ${meta.tone} trong hệ thống cổ ngữ Tạng.`,
        dialogue_examples: [],
      },
      buddhist_context: {
        scripture_quote: clean,
        teachings: meta.teachings,
        philosophy_reflection: `Quán niệm âm thanh thanh tịnh của chữ "${clean}" để an định tâm thức.`,
      },
    };
  }

  const normalizedKey = clean.replace(/[་།\s]+/g, '').trim();

  // 1. Khớp từ ghép / Cụm từ lớn trong từ điển
  let matchedCompound: LexiconEntry | null = null;
  for (const [key, item] of Object.entries(TIBETAN_LEXICON_DATABASE)) {
    const cleanKey = key.replace(/[་།\s]+/g, '');
    if (normalizedKey === cleanKey || (normalizedKey.length > 2 && normalizedKey.includes(cleanKey))) {
      matchedCompound = item;
      break;
    }
  }

  // 2. Tách từng âm tiết / từ đơn
  const syllables = clean.split(/[་\s།➔\->+=|]+/).filter(Boolean);
  const table_rows = syllables.map(s => {
    const cleanS = s.replace(/[་།\s]/g, '');
    const found = TIBETAN_LEXICON_DATABASE[cleanS] || TIBETAN_LEXICON_DATABASE[s];
    const sWylie = toSimpleWylie(s);

    if (found) {
      return {
        tibetan: s,
        phonetic: found.phonetic || sWylie,
        wylie: found.wylie || sWylie,
        meaning: found.meaning,
        pos: found.pos
      };
    }

    // Tra cứu chữ cái gốc
    const rootChar = s.slice(0, 1);
    const rootMeta = TIBETAN_LEXICON_DATABASE[rootChar];
    return {
      tibetan: s,
      phonetic: sWylie,
      wylie: sWylie,
      meaning: rootMeta ? `Âm tiết gốc (${rootMeta.wylie}): ${rootMeta.meaning}` : `Âm tiết Tạng ngữ [${sWylie}]`,
      pos: rootMeta ? rootMeta.pos : 'Từ vựng'
    };
  });

  // 3. Xây dựng dịch nghĩa hoàn chỉnh
  let full_translation = '';
  if (matchedCompound) {
    full_translation = `${matchedCompound.meaning}`;
  } else if (table_rows.length === 1) {
    full_translation = `${table_rows[0].meaning}`;
  } else {
    const combinedMeanings = table_rows.map(r => r.meaning.split('/')[0].trim()).join(' — ');
    full_translation = `${combinedMeanings}`;
  }

  return {
    wylie: toSimpleWylie(clean) || clean,
    full_translation,
    dictionary: {
      vn: full_translation,
      usage: 'Giáo trình Tạng ngữ Phật học viện Sara (Dharamsala)'
    },
    table_rows,
    syllables: syllables.map(s => ({
      syllable: s,
      wylie: toSimpleWylie(s),
      root: s.slice(0, 1),
      prefix: '-',
      suffix: '-',
      vowel: s.includes('ེ') ? 'e' : (s.includes('ི') ? 'i' : (s.includes('ུ') ? 'u' : (s.includes('ོ') ? 'o' : 'a'))),
      spelling_steps: [`Đọc âm tiết: ${toSimpleWylie(s)}`],
      coach_guide: {
        correction_tips: ['Khẩu hình mở tự nhiên, phát âm giọng nam trầm ấm, tròn vành rõ chữ.']
      }
    })),
    usage_context: {
      situation: 'Luyện đọc, nhận diện mặt chữ và đàm thoại giáo trình Sara.',
      cultural_notes: matchedCompound?.teachings || 'Chữ Tạng mang âm ba thanh tịnh và trí tuệ giải thoát.',
      dialogue_examples: []
    },
    buddhist_context: {
      scripture_quote: clean,
      teachings: matchedCompound?.teachings || 'Mỗi câu chữ Tạng văn là phương tiện nuôi dưỡng tuệ giác và tâm từ bi.',
      philosophy_reflection: 'Thân - Khẩu - Ý thanh tịnh khi trì tụng và học tập giáo pháp.'
    }
  };
}

function toSimpleWylie(text: string): string {
  const map: Record<string, string> = {
    'ཀ':'ka','ཁ':'kha','ག':'ga','ང':'nga','ཅ':'ca','ཆ':'cha','ཇ':'ja','ཉ':'nya',
    'ཏ':'ta','ཐ':'tha','ད':'da','ན':'na','པ':'pa','ཕ':'pha','བ':'ba','མ':'ma',
    'ཙ':'tsa','ཚ':'tsha','ཛ':'dza','ཝ':'wa','ཞ':'zha','ཟ':'za','འ':"'a",'ཡ':'ya',
    'ར':'ra','ལ':'la','ཤ':'sha','ས':'sa','ཧ':'ha','ཨ':'a',
    'ི':'i','ུ':'u','ེ':'e','ོ':'o','་':' ','།':'|',
  };
  return text.split('').map(c => map[c] !== undefined ? map[c] : c).join('').replace(/\s+/g, ' ').trim();
}
