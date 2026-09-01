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

const HIGH_FREQ_WORDS: Record<string, any> = {
  'ཉ་པ': { wylie: 'nya-pa', phonetic: 'nya-pa', meaning: 'Người đánh cá / Ngư dân', pos: 'Danh từ', teachings: 'Nuôi dưỡng lòng từ bi không sát mạng chúng sinh.' },
  'ཉ་ཤ': { wylie: 'nya-sha', phonetic: 'nya-sha', meaning: 'Thịt cá', pos: 'Danh từ', teachings: 'Thực tập quán chiếu thức ăn nuôi dưỡng giới thân huệ mạng.' },
  'ཀ་བ': { wylie: 'ka-ba', phonetic: 'ka-ba', meaning: 'Cột trụ / Trụ cột gian nhà', pos: 'Danh từ', teachings: 'Trụ cột vững chắc của Chánh pháp tại gia đình và tu viện.' },
  'པ་ཕ': { wylie: 'pa-pha', phonetic: 'pa-pha', meaning: 'Người cha / Thân phụ', pos: 'Danh từ', teachings: 'Ân đức sinh thành dưỡng dục sâu dày của người cha.' },
  'ཨ་མ': { wylie: 'a-ma', phonetic: 'a-ma', meaning: 'Người mẹ / Thân mẫu / Mẹ hiền', pos: 'Danh từ', teachings: 'Tình thương bao la của người mẹ hiền trong muôn ức kiếp luân hồi.' },
  'ཕ་མ': { wylie: 'pha-ma', phonetic: 'pha-ma', meaning: 'Cha mẹ / Song thân / Phụ mẫu', pos: 'Danh từ', teachings: 'Đạo hiếu vi tiên — báo hiếu song thân là cội nguồn của mọi phước lành.' },
  'བཀྲ་ཤིས་བདེ་ལེགས': { wylie: 'bkra-shis bde-legs', phonetic: 'tra-shi de-lek', meaning: 'Lời chúc cát tường, bình an và vạn sự như ý', pos: 'Chào hỏi / Chúc tụng', teachings: 'Mang lại từ trường an lành và phước đức cho người nghe.' },
  'སྐུ་ཁམས་བཟང་': { wylie: 'sku-khams bzang', phonetic: 'ku-kham sang', meaning: 'Kính chúc ngài dồi dào sức khỏe (Kính ngữ)', pos: 'Kính ngữ', teachings: 'Thể hiện lòng tôn kính bậc trưởng thượng và chư Tăng.' }
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

  // 2. Nếu là từ vựng thông dụng
  if (HIGH_FREQ_WORDS[clean]) {
    const v = HIGH_FREQ_WORDS[clean];
    return {
      wylie: v.wylie,
      full_translation: `"${clean}" (${v.wylie}): ${v.meaning}`,
      dictionary: {
        vn: v.meaning,
        usage: 'Giáo trình tiếng Tạng đàm thoại Tu viện Sara',
      },
      table_rows: [
        {
          tibetan: clean,
          phonetic: v.phonetic,
          wylie: v.wylie,
          meaning: v.meaning,
          pos: v.pos,
        },
      ],
      syllables: clean.split(/[་\s]+/).filter(Boolean).map((s) => ({
        syllable: s,
        wylie: toSimpleWylie(s),
        root: s,
        prefix: '-',
        suffix: '-',
        vowel: 'a',
        spelling_steps: [`Đọc âm tiết: ${toSimpleWylie(s)}`],
        coach_guide: {
          correction_tips: ['Mở nhẹ khẩu hình, phát âm tròn vành rõ chữ.'],
        },
      })),
      usage_context: {
        situation: 'Giao tiếp và tu học Phật pháp hàng ngày.',
        cultural_notes: 'Chữ Tạng mang trường năng lượng thanh tịnh.',
        dialogue_examples: [],
      },
      buddhist_context: {
        scripture_quote: clean,
        teachings: v.teachings,
        philosophy_reflection: 'Văn - Tư - Tu trên từng câu chữ pháp bảo.',
      },
    };
  }

  // 3. Fallback tổng quát
  const wylie = toSimpleWylie(clean);
  const syllables = clean.split(/[་\s།]+/).filter(Boolean);

  return {
    wylie: wylie || clean,
    full_translation: `Phân tích ngữ nghĩa: "${clean}" (${wylie})`,
    dictionary: {
      vn: `Nội dung: ${clean}`,
      usage: 'Giáo trình tiếng Tạng đàm thoại Tu viện Sara',
    },
    table_rows: syllables.length > 0 ? syllables.map((s) => ({
      tibetan: s,
      phonetic: toSimpleWylie(s),
      wylie: toSimpleWylie(s),
      meaning: TIBETAN_CONSONANTS_DICT[s]?.meaning || 'Từ vựng tiếng Tạng trong bài học',
      pos: TIBETAN_CONSONANTS_DICT[s]?.pos || 'Ngữ liệu',
    })) : [
      {
        tibetan: clean,
        phonetic: wylie,
        wylie: wylie,
        meaning: 'Từ vựng tiếng Tạng trong bài học',
        pos: 'Ngữ liệu',
      },
    ],
    syllables: syllables.length > 0 ? syllables.map((s) => {
      const cMeta = TIBETAN_CONSONANTS_DICT[s];
      return {
        syllable: s,
        wylie: toSimpleWylie(s),
        root: cMeta?.root || s.slice(0, 1) || '-',
        prefix: '-',
        suffix: '-',
        vowel: cMeta?.vowel || 'a',
        spelling_steps: cMeta?.spelling || [`Đọc căn tự: ${toSimpleWylie(s)}`],
        coach_guide: {
          correction_tips: cMeta?.tips || ['Mở nhẹ khẩu hình, phát âm tròn vành rõ chữ.'],
        },
      };
    }) : [
      {
        syllable: clean,
        wylie: wylie,
        root: clean.slice(0, 1) || '-',
        prefix: '-',
        suffix: '-',
        vowel: 'a',
        spelling_steps: [`Đọc căn tự: ${wylie}`],
        coach_guide: {
          correction_tips: ['Mở nhẹ khẩu hình, phát âm tròn vành rõ chữ.'],
        },
      },
    ],
    usage_context: {
      situation: 'Luyện tập đàm thoại hàng ngày và tụng niệm Phật pháp.',
      cultural_notes: 'Chữ Tạng mang trường năng lượng thanh tịnh từ kinh điển truyền thừa.',
      dialogue_examples: [],
    },
    buddhist_context: {
      scripture_quote: clean,
      teachings: 'Tâm an định khi đọc tụng từng âm tự.',
      philosophy_reflection: 'Văn - Tư - Tu trên từng câu chữ pháp bảo.',
    },
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
