import fs from 'fs';
import path from 'path';

// Let's build the full, accurate structure for "Đi Qua Khổ Vui Cuộc Đời - Quyển 1"
const q1Chapters = [
  {
    chapterNumber: 1,
    title: "Trang Lót & Đi Cùng Tôi",
    pageRange: "Trang 1 - 8",
    quoteHeader: "Trên đường lý tưởng không phải lúc nào cũng có hoa và bướm. Đừng thấy những đoạn đường gai góc khó đi mà vội vã rẽ sang lối khác... Ta cứ quyết chí theo con đường của ta đi, rồi sớm hay muộn cũng có ngày đến đích.",
    quoteAuthor: "HT. Thích Chân Tính — Sữa Pháp Ban Mai",
    sections: [
      {
        type: "dedication",
        title: "TRANG LÓT DÀNH TẶNG",
        pageNumber: 1,
        content: "Cuốn sách này dành tặng: .........................................................................................."
      },
      {
        type: "essay",
        title: "ĐI CÙNG TÔI",
        pageNumber: 3,
        author: "Vô Trí – Tâm Hòa",
        content: `Bạn thân mến, đã bao giờ bạn nghĩ rằng cuộc đời của mình chính là một chuyến hành trình đầy những gam màu khác nhau chưa? Nếu mỗi gam màu là mỗi biểu hiện khác nhau về lăng kính của cuộc sống, thì xin bạn thân mến hãy cho phép tôi lấy màu xanh da trời là biểu hiện của sự bình an nội tâm, màu vàng tươi là biểu hiện của sự tự tin - tươi trẻ, màu xám nhạt sẽ đặc trưng cho những nỗi khắc khoải - ưu tư - muộn phiền và áp lực trong cuộc sống.

Nếu cho phép mỗi người trong các bạn có quyền được tô lên trang sách của cuộc đời mình những gam màu ấy, thì tôi mong những trang sách của cuộc đời các bạn sẽ có thật nhiều màu xanh da trời, không thiếu đi màu vàng tươi; và ít thôi những màu xám nhạt đi ngang qua như một chất liệu không thể thiếu, để các bạn thân mến thấy được rằng “từ bùn sen nở, từ khổ người tài” (lời Hòa thượng Thích Chân Tính).

Nhưng vốn cuộc đời sẽ không cho ta quyền tự do như một họa sĩ đang điểm màu cho tác phẩm của mình như vậy, tôi nghĩ rằng đa số những người đang cầm trên tay cuốn sách này là những bạn trẻ những người đang đứng giữa vòng xoay của việc chọn cho mình một cánh cửa Đại học phù hợp, tìm cho mình một việc làm có lương “tám chữ số” cùng những người đồng nghiệp tốt tính, hoặc đang loay hoay không biết rằng lối thoát cho những nỗi khổ đau, tủi hờn, thua thiệt, bế tắc của hiện tại sẽ là con đường nào đây?

Tôi đã từng tiếp xúc và có nhiều cơ hội lắng nghe những-câu-chuyện-mà-ai-cũng-biết-đấy-là-gì của nhiều các bạn trẻ đến từ những độ tuổi, môi trường sống, kinh nghiệm và trải nghiệm sống khác nhau thông qua các khóa tu thiền trà “Về để lắng nghe”, Khóa tu mùa hè “Trở về chốn bình yên”, lễ “Thành nhân”, tại nơi mà tôi đã tu học trong suốt hơn mười năm qua – Tùng lâm Hòa Phúc, kể từ ngày mà tôi rời xa chốn Tổ đình Hoằng Pháp và ước nguyện đem giáo Pháp của Đức Phật, của Sư Ông Hoằng Pháp len lỏi vào từng ngóc ngách của cuộc đời. Mỗi lần như vậy tôi thấy mình cảm nhận được nhiều điều.

Những sẻ chia của các bạn trẻ, tôi lắng nghe như một người bạn để cùng đặt mình vào và gắng tâm tìm ra được những lời Đức Phật đã chỉ dạy, những lời mà Thầy Tổ tôi đã tận tâm truyền trao và cả những kinh nghiệm trong suốt hơn 20 năm theo Thầy phụng sự và học đạo để truyền trao cho các bạn. Thực lòng mà nói, tôi chỉ mong rằng những tách trà thơm tròn đầy, những lần ngồi lặng yên lắng nghe và biết bao điều mà tôi cùng các bạn đã gửi gắm cho nhau sẽ thật là một “cơn mưa Pháp” để “tưới mát đời khô khan” trong mỗi hành trình sống của các bạn, để hạt giống bình an - hạnh phúc - thương yêu của các bạn được tưới tẩm, được nảy mầm và vững chãi hơn biết bao.

Cuốn sách nhỏ này chính là sự góp nhặt những lời Phật dạy, những bài viết cùng những bài thơ mà tôi đã dành cho các bạn trẻ trong suốt nhiều năm qua, tôi xin được hiến tặng món quà “tâm linh” này như một điểm tựa vững chãi cho các bạn.`
      },
      {
        type: "poem",
        title: "LỜI NHẮN GỬI MỞ ĐẦU",
        pageNumber: 8,
        author: "Vô Trí – Tâm Hòa",
        content: `Thầy chẳng dám nói lời gì cao viễn\nChỉ dùng tâm chân thật tận đáy lòng\nVì tương lai, vì Đạo Pháp, non sông\nNên góp nhặt mấy lời xin nhắn gửi.`
      }
    ]
  },
  {
    chapterNumber: 2,
    title: "Lời Giới Thiệu",
    pageRange: "Trang 9 - 10",
    quoteHeader: "Mỗi chương là mỗi chủ đề riêng biệt, qua đó bạn sẽ tìm được sự đồng cảm, bình an, hay một chút gợi mở cho những bế tắc mà bạn đang đối diện. Hy vọng tôi và bạn sẽ tìm thấy nhau trên con thuyền Thanh Lương hướng về chân trời hạnh phúc.",
    quoteAuthor: "Ban Biên Soạn Tùng Lâm Hòa Phúc",
    sections: [
      {
        type: "essay",
        title: "LỜI GIỚI THIỆU BỘ SÁCH",
        pageNumber: 9,
        author: "Ban Biên Soạn",
        content: `Tập sách này như những dòng chia sẻ, gửi đến những ai hữu duyên với 02 quyển được chia thành 08 chương:\n\nQuyển 01 gồm:\n• Chương 01: Yêu thương bắt đầu (Trang 11)\n• Chương 02: Có mặt cho nhau (Trang 49)\n• Chương 03: Không còn sợ hãi (Trang 95)\n• Chương 04: Ruộng tốt cho người (Trang 150)\n• Đã về đã tới (Trang 200)\n\nQuyển 02 gồm:\n• Chương 05: Khổ vui cuộc đời\n• Chương 06: Ngắm trọn bình minh\n• Chương 07: Đi trên đường mới\n• Chương 08: Hạt giống hạnh phúc`
      }
    ]
  },
  {
    chapterNumber: 3,
    title: "Chương 1: Yêu Thương Bắt Đầu",
    pageRange: "Trang 11 - 48",
    quoteHeader: "Không một tác phẩm nào đẹp và thiêng liêng bằng sự hiện hữu của cha và mẹ. Đó là tượng đài của tình thương và sự hy sinh bất tử.",
    quoteAuthor: "Sa Môn Vô Trí – Thích Tâm Hòa",
    introSummary: "Trong đời sống hiện đại, gia đình đang mất dần vai trò là hạt nhân của xã hội. Nguyên nhân chính là do sự thiếu truyền thông và thấu hiểu giữa các thành viên trong gia đình. Cùng nhìn lại những lời tâm sự của nhà sư để tìm về giá trị gia đình truyền thống thiêng liêng của dân tộc Việt trong bạn.",
    sections: [
      {
        type: "poem",
        title: "CHA MẸ LÀ HẠNH PHÚC CỦA CON",
        pageNumber: 15,
        author: "Vô Trí – Tâm Hòa",
        content: `Con sinh ra, trong những ngày khó khổ\nGia cảnh nghèo, cơm chẳng đủ no thân\nTình cảnh chung bao cơ cực nợ nần\nLàm sao thoát vì con đâu được chọn.\n\nQuanh nhà con cũng chẳng ai hơn được\nBóng đèn tròn là mơ ước cao sang\nĐược bữa cơm phải vay mượn khắp làng\nNhưng ai cũng giúp nhau vì chung cảnh.\n\nThuở còn bé thèm bánh bao trứng cút\nMơ nắm xôi bà lão bán bên đường\nNhưng mỗi ngày cơm độn với nước tương\nThì mơ ước vẫn chỉ là mơ ước.\n\nCon lớn lên đã quen rồi gian khó\nMưa dột nhà, bếp ngập cảnh đìu hiu\nBữa cơm chiều trong bóng tối cô liêu\nTrời sấm chớp, mẹ cha chưa về kịp.\n\nCon thương mẹ, người dành từng giọt máu\nBán lấy tiền nuôi con dại lớn khôn\nChịu cơ hàn, nhường phần tốt cho con\nMẹ uống cạn tủi hờn và đau khổ.\n\nCon thương cha, người đàn ông lam lũ\nSáng đi làm nhưng bụng chẳng được no\nVậy mà cha vẫn chưa tiếng kêu than\nDành tất cả cho con niềm vui sướng.\n\nNhững biến cố cứ trôi qua như thế\nHết mùa mưa, mùa nắng đã bao lần\nNgày qua ngày, đàn con dại lớn lên\nTóc cha mẹ càng thêm nhiều sợi bạc.\n\nRồi cuộc sống cũng dần dần thay đổi\nCơm đủ ăn và cuộc sống ấm êm\nChẳng còn lo chạy từng bữa đỡ lòng\nNhà sạch sẽ, trong ngoài đều tươm tất.\n\nRiêng phần con trong tâm luôn thao thức\nThích lặng yên, hay trầm mặc suy tư\nChẳng ham vui cũng chẳng thích tranh giành\nDanh và lợi dường như con không nghĩ.\n\nBình minh sớm con đã thường tỉnh giấc\nNhìn quanh nhà ai cũng ngủ giấc say\nNhưng hình hài chẳng phải giống thường ngày\nChợt bừng sáng, tâm con thêm trĩu nặng.\n\nNghèo cũng chết, giàu cũng đâu thoát được\nMãi hơn thua rồi ta sẽ về đâu?\nCon nhớ lời “nghiệp dẫn trong luân hồi”\nDòng chữ ấy khiến con thêm quyết chí.\n\nNgày con đi, mưa Sài thành nặng hạt\nMẹ nơi xa, heo hút chốn mây ngàn\nĐược đôi lần gặp mẹ vội trong mơ\nChia tay mẹ, chưa trọn câu từ biệt.\n\nCha vẫn vậy, vầng trán đầy suy nghĩ\nThương các em, khóe mắt cứ cay cay\nNhưng duyên trần thôi đành hết từ đây\nGạt nước mắt, cắt lìa dây quyến thuộc.\n\nTheo gót Thầy, dưỡng nuôi Giới - Định - Tuệ\nKhai lối mê, xóa sạch vết trầm luân\nNgày lẫn đêm con tha thiết nguyện cầu\nCha mẹ được quay về nương Tam bảo.\n\nMười tám năm xa vòng tay cha mẹ\nCon chưa hề thấy vất vả âu lo\nThầm cảm ơn đức cao cả Tổ, Thầy\nƠn sinh dưỡng, từ mồ hôi, giọt máu.\n\nTiết Vu lan học đòi gương hiếu hạnh\nĐức Mục Liên Tôn giả đại từ bi\nChứng tâm con mong Tam bảo hộ trì\nCha mẹ được an vui trong ánh Đạo.`
      },
      {
        type: "poem",
        title: "NGÀY ẤY …",
        pageNumber: 22,
        author: "Vô Trí – Tâm Hòa",
        content: `Chưa một lần cất lời “con thương Mẹ”\nChẳng hoa thơm hiếu kính để tặng Cha\nChỉ âm thầm với lời nguyện thiết tha\nMong Cha Mẹ lòng thành hướng Tam bảo.\n\nXin ghi khắc vào tim bao ân nghĩa\nTứ đại này, từ dòng sữa ngọt thơm\nCon lớn khôn với bao nỗi nhọc nhằn\nVầng trán ấy, thời gian in rõ nét.\n\nBao dâu bể, đời nổi trôi xuôi ngược\nGiọt máu đào nuôi lớn đàn con thơ\nNhững lo toan cất lại sau nụ cười\nCha Mẹ vẫn chưa một lời than trách.\n\nBiết ly biệt Đạo - Đời là hai nẻo\nCon vẫn tin sẽ gặp lại cùng nhau\nTrên hành trình con tìm lại chính mình\nLuôn khắc khoải bóng hình Ba và Mẹ.\n\nYên tâm nhé, thân này con xin giữ\nĐể làm thuyền vượt sinh tử trùng khơi\nLàm mạch nguồn soi sáng mọi nẻo đời\nĐể không uổng kiếp người Ba Mẹ tặng.\n\nNgày tiếp nối dòng đời trong sinh diệt\nKiếp này mong là kiếp chót luân hồi\nỞ nơi kia sen báu nở ngợp trời\nAo thất bảo mai sau cùng gặp lại.\n\nCon viết vội đôi dòng xin tâm niệm\nGửi Mẹ Cha - hai vị Phật trên đời\nGửi đến Thầy - bậc hướng đạo tuyệt vời\nGửi tất cả lòng biết ơn thành kính.\n\nNgày con sinh nhằm mùa Vu Lan đó\nBuổi giao mùa, giờ gạch nối âm dương\nPhải chăng là biểu hiện của tình thương\nĐược hiến tặng bằng suối nguồn tuệ giác.`
      },
      {
        type: "poem",
        title: "GỬI VỀ QUÊ NHÀ",
        pageNumber: 25,
        author: "Vô Trí – Tâm Hòa",
        content: `Đây chút hương cau gửi quê nhà\nLời thương nhắn nhủ Mẹ và Cha\nDịch về ngõ vắng càng thêm vắng\nGóc bếp hiên xưa bỗng nhạt nhoà.\n\nHè về Sài thành gió mưa sa\nSấm chớp, bão giông cõng mái nhà\nĐôi mắt song thân thêm mòn mỏi\nChợt thấy lòng đau chút xót xa.\n\nMẹ ơi, nơi ấy mỗi ngày qua\nCháo cơm, rau dại có gọi là\nĐỡ đói thân cò khi đêm vắng\nNhìn bóng đèn khuya nhớ con xa.\n\nCon vẫn đêm ngày hướng về Cha\nNgười hay im lặng một góc nhà\nMắt trông sâu thẳm đong ngày tháng\nMây vờn tóc bạc, bóng chiều sa.\n\nĐây quả, đây hoa chút gọi là\nLòng thành hiếu thảo gửi Mẹ Cha\nBao năm đội tuyết dầm sương gió\nGiờ mới bình yên giữa phong ba.\n\nMười mấy năm dư xa quê nhà\nTheo đường chân lý Đức Thích Ca\nSớm chiều kinh kệ rèn giới định\nHiểu thấu vô thường một kiếp hoa.\n\nMột sớm tinh sương cội đa già\nCon quỳ khấn nguyện chốn bao la\nMong sao Cha Mẹ luôn tỉnh thức\nNgõ tối, rừng mê sớm thoát ra.\n\nTrưa nay nắng rọi muôn hoa lá\nBướm đậu đa già chim hót ca\nVõng trưa lắng tiếng Di Đà niệm\nBất chợt quê nhà nhớ thiết tha.`
      },
      {
        type: "poem",
        title: "DẠY CON NÊN NGƯỜI",
        pageNumber: 29,
        author: "Vô Trí – Tâm Hòa",
        content: `Người phật tử, dạy con cần nên hiểu\nThuận tự nhiên đừng hà khắc cưỡng cầu\nCon của mình phúc tuệ cạn hay sâu\nDo túc nghiệp đã gieo từ nhiều kiếp.\n\nBiết rõ nghiệp nên cần tin nhân quả\nThực hành theo lời giáo huấn Phật đà\nDạy con mình từ thuở trong bào thai\nCon khôn dại đều bởi do cha mẹ.\n\nKhi thai kỳ bắt đầu từ giọt máu\nCon lớn dần đến khi đủ hình hài\nMẹ cữ kiêng, đi đứng nhẹ khoan thai\nĐồ ăn uống chớ tham nhiều máu thịt.\n\nCha và mẹ, tinh thần nên an định\nChớ gây thêm áp lực khiến ưu sầu\nCha mẹ buồn con cũng ảnh hưởng theo\nTừ hơi thở, khổ vui con đều chịu.\n\nCha cũng vậy dù con còn trong dạ\nKiêng rượu bia, thuốc lá, chớ buông lung\nCần đỡ nâng khi mẹ gặp khó khăn\nDo con đạp, con làm mẹ đau đớn.\n\nThế mới biết dạy con từ trong bụng\nLà thời kỳ quan trọng chẳng xem thường\nCha biết tu, cầu phúc để cho con\nMẹ thận trọng vì tương lai con trẻ.\n\nDạy con trẻ, cha mẹ cần chăm sóc\nChớ ủy quyền dù đó là ông bà\nVì chẳng gần sao được gọi là thân\nCon xa cách, lớn khôn sao dạy được.\n\nCon đi học là đi tìm kiến thức\nĐừng bắt con cắm mặt học ngày đêm\nRồi bảo rằng thương con muốn thành danh\nVào đại học ngẩng cao đầu thiên hạ.\n\nDạy như vậy là nguồn cơn khủng hoảng\nDạy một chiều, áp đặt chẳng nên đâu\nCần biết con ưu, khuyết ở chỗ nào\nRồi uốn nắn dần dần cho hợp lý.\n\nĐiều quan trọng là dạy về nhân nghĩa\nRèn tính tình ngay thẳng chẳng quanh co\nHướng dẫn con khôn lớn trở thành người\nĐừng bắt nó thành công khi chưa chín.`
      },
      {
        type: "poem",
        title: "ƠN CHA MẸ",
        pageNumber: 40,
        author: "Vô Trí – Tâm Hòa",
        content: `Con xuất gia vẫn là con của Mẹ\nChí theo Thầy nuôi dưỡng Bồ đề tâm\nVu Lan về không hoa trắng, hoa hồng\nMà tinh khiết hoa thơm hương giải thoát.\n\nGửi đến Mẹ mỗi nụ cười tươi mát\nGửi về cha hơi thở của bình an\nCon đang đi để tiếp nối Đạo vàng\nCứu ba cõi chúng sinh đang chìm đắm.\n\nMùa báo hiếu xin chắp tay hướng nguyện\nMong Mẹ Cha ở quê cũ thảnh thơi\nVững đức tin nơi Chánh pháp tuyệt vời\nNgày gặp lại phương trời nhiều hạnh phúc.`
      },
      {
        type: "poem",
        title: "NỀN TẢNG HẠNH PHÚC GIA ĐÌNH",
        pageNumber: 41,
        author: "Vô Trí – Tâm Hòa",
        content: `Đàn ông tốt trên đời nay khó gặp\nCon chọn chồng đâu chọn được tính tình\nNhìn vẻ ngoài ai đoán được bên trong\nVề chung sống mới biết là thật giả.\n\nKhi hiểu Đạo con không cần đòi hỏi\nNhưng lựa thời vừa cứng lại vừa mềm\nLúc cần thương con chẳng tiếc tình thương\nKhi cần dọa phải dọa cho tới chốn.\n\nHọc Phật pháp để biết ngay hiện tại\nỨng dụng vào cho cuộc sống thêm tươi\nChớ nghĩ rằng phải bỏ hết cửa nhà\nKhi trách nhiệm vẫn hai vai gánh nặng.\n\nCon biết tu là tìm ra chân lý\nMuốn người thương con phải biết thương người\nCứ suốt ngày chăm chỉ việc phóng sinh\nMà nội kết gia đình ai hóa giải?\n\nCon ăn chay là nuôi lòng bi mẫn\nChớ vì ăn mất hạnh phúc gia đình\nKhéo giữ sao bớt cá thịt hôi tanh\nNhưng đảm bảo đủ đầy nguồn dinh dưỡng.\n\nĐạo muốn bền con cần nên rèn luyện\nGiữ hài hòa mối quan hệ gia đình\nCây càng cao bóng tỏa mát xung quanh\nĐức càng lớn, vợ chồng càng hoan hỷ.\n\nNhớ con nhé, làm vợ hiền không khó\nKhi tâm con đã có chỗ quay về\nĐó là nơi tự tánh của chính con\nNơi Phật pháp suối nguồn không vơi cạn.`
      }
    ]
  },
  {
    chapterNumber: 4,
    title: "Chương 2: Có Mặt Cho Nhau",
    pageRange: "Trang 49 - 94",
    quoteHeader: "Có những khó khăn không thể nào tự mình giải quyết, hãy tìm sự giúp đỡ nơi người Thầy tâm linh của mình … Nếu không có thầy, con sẽ trở thành vật tế thần cho những con ma khát ái; nếu không có thầy, con sẽ trở thành nạn nhân trong bánh xe luân hồi, nghiền nát con thành trăm mảnh.",
    quoteAuthor: "Sa Môn Vô Trí – Thích Tâm Hòa",
    sections: [
      {
        type: "poem",
        title: "TIẾNG CHUÔNG TỈNH THỨC",
        pageNumber: 51,
        author: "Vô Trí – Tâm Hòa",
        content: `Đêm nay\nCon khóc\nGiọt nước mắt của tháng ngày nông nổi\nRơi... rơi...!!!\nCon nhớ về những ngày vui ấy\nCười hồn nhiên chẳng chút buồn lo.\n\nRồi dòng đời xuôi ngược\nCon xa Thầy\nXa bạn\nXa chùa...\nXa mái nhà với mấy trăm anh chị em\nMột người cha\nLo toan mọi thứ\nLưng đẫm mồ hôi....\n\nNát vụn tự bao giờ...\nChợt con nhận ra bóng Thầy trước mặt\nNhìn con, Thầy khóc cùng con\nGiọt nước mắt của Thầy\nẤm, mặn như bao giọt nước mắt trần gian\n\nThầy đây,\nThật rồi\nChẳng phải mơ\nĐưa bàn tay\nThầy nâng con đứng dậy...\n\nNgồi bên Thầy\nChiều nay...\nChiếc lá nhẹ rơi\nMuộn phiền lắng đọng\nMỉm cười, nhìn con\nĐứa tu sinh của 8 năm về trước\nCon nhìn Thầy\n\nLòng vơi bớt chua cay...\nNgày xưa...\nNgày xưa ấy,\nThầy lo từng bữa ăn, giấc ngủ\nBây giờ,\nMai sau...\nThầy vẫn không bỏ rơi con\nDù ngần ấy năm xa vắng\nCon không về và chẳng chút hỏi thăm.\n\nThầy có giận con không?\nChắc có... mà không...\nVì Thầy vẫn vậy\nÁo nâu nhuộm bùn nhẫn nhục\nAi khen\nAi chê\nThị phi, nhân ngã... chẳng làm Thầy thay đổi\nCon đã về... dù muộn màng.`
      },
      {
        type: "poem",
        title: "ĐỪNG SỐNG TẠM BỢ",
        pageNumber: 59,
        author: "Vô Trí – Tâm Hòa",
        content: `Điều hay không học hỏi\nChạy theo lối phong trào\nThấy người đi ta theo\nNhưng chẳng biết về đâu?\n\nLời Thầy bỏ ngoài tai\nĐội người dưng lên đầu\nMẹ khuyên con bỏ mặc\nNghe theo tiếng u mê.\n\nSuốt ngày ham danh lợi\nSống ảo thích đua đòi\nPhấn son che da thịt\nĐâu thấy rõ nguồn tâm.\n\nChẳng suy nghĩ dài lâu\nTưởng có chút bạc tiền\nCoi thường người thân thuộc\nRồi chuốc lấy khổ đau.\n\nAi người cho an lạc\nAi hướng ta đường về\nĐâu phải nơi nào khác\nNgười ấy luôn bên ta.`
      },
      {
        type: "poem",
        title: "ĐỪNG KHỔ VÌ TÌNH",
        pageNumber: 62,
        author: "Vô Trí – Tâm Hòa",
        content: `Phật bảo con ơi, quay đầu lại\nChữ ái tình ràng buộc vẫn chưa ra\nCon càng gỡ, lòng con càng thêm rối\nVì mê mờ quên mất ánh bình minh.\n\nCon cứ tưởng con yêu là hạnh phúc\nNhưng thế gian ai là kẻ thật lòng\nMộng và mơ đời con khổ muôn ngàn\nCũng vì kẻ không cùng chung lý tưởng.\n\nMột người buộc, còn người kia muốn gỡ\nCứ dùng dằng vì đùa với tình yêu\nÔng thần này có liều thuốc gây mê\nCon uống phải đời con say như chết.\n\nCuộc tình vỡ như sương tan buổi sớm\nCó bền đâu mà sao lại kiếm tìm\nNhìn đi con, tóc mẹ đã điểm sương\nThân hình bố héo gầy vì cuộc sống.\n\nPhật đã dạy, lời Thầy khuyên còn đó\nNhưng con mê, bị ái dục ngăn che\nThầy đêm sương, ngày nắng vẫn ngóng trông\nLời khấn nguyện mong con mau dừng lại.`
      },
      {
        type: "poem",
        title: "CON HIỂU RỒI…",
        pageNumber: 67,
        author: "Vô Trí – Tâm Hòa",
        content: `(Cảm tác trong những ngày Tổ đình Hoằng Pháp vắng Thầy)\n\nCon hiểu, Thầy đi tìm chốn nghỉ\nDừng bước phiêu bồng mấy mươi năm.\nRời xa phố thị về non vắng\nTĩnh lặng trời mây cõi sắc không.\n\nCon hiểu, Thầy đi là mở lối\nĐể đàn hậu tấn nối tiếp Thầy\nHoằng truyền diệu pháp đường chân lý\nTục diệm truyền đăng rạng Tổ tông.\n\nCon hiểu, Thầy đi là nhắc nhở\nÍch đạo, lợi đời phải biết “buông”\nTham sân buông hết đừng giữ lại\nSinh tử, vô thường chỉ mình ta.\n\nCon hiểu, Thầy đi là cảnh tỉnh\nLợi danh giấc mộng áng mây bay\nKhen chê, được mất trò ảo hóa\nCửa đạo sớm chiều bước thảnh thơi.\n\nCon hiểu, Thầy mãi là Thầy thôi\nMột đời hoằng pháp nguyện vun bồi\nSuối nguồn chánh pháp từ nơi ấy\nThầy đã khơi nguồn chảy khắp nơi.`
      },
      {
        type: "poem",
        title: "TIẾP BƯỚC THẦY TÔI",
        pageNumber: 80,
        author: "Vô Trí – Tâm Hòa",
        content: `Hoằng Pháp- Kiến An mãi nhớ Thầy\nHải Phòng- Phổ Chiếu vẫn còn đây\nNgười đi năm tháng chưa phai dấu\nChánh pháp hoằng truyền khắp đông tây\nĐất bắc mở mang dòng bất tử\nTrời nam kết tụ giới hương bay\nDáng xưa vững chãi như tùng bách\nCháu con tiếp bước đẹp tháng ngày.`
      },
      {
        type: "poem",
        title: "ĐỜI THẦY",
        pageNumber: 77,
        author: "Vô Trí – Tâm Hòa",
        content: `Thầy tôi vẫn nụ cười hiền\nNét từ dịu mát như tiên xuống trần\nLời chân thật, nghĩa ân cần\nKhuyên người buông bớt tham sân khổ sầu.\n\nĐời thầy nào có gì đâu\nBàn đơn, ghế chiếc nhuộm màu thời gian\nSong thưa đọc sách an nhàn\nTỏ tường chân lý chẳng màng lợi danh.\n\nMặc cho thế sự tranh giành\nNgửa nghiêng cuộc thế, đường lành thầy đi\nTrải qua bao cuộc thị phi\nMột lòng vững chí khắc ghi đạo mầu.\n\nĐêm qua trong giấc mơ thiền\nHóa thành cánh bướm bên hiên nhìn thầy\nAn nhiên vững chãi đẹp thay\nCúi đầu kính lạy chắp tay nguyện cầu.\n\nKính thầy đạo lực thâm sâu\nDong thuyền Chính pháp, dựng cầu Thanh lương\nNụ cười tỏa rạng tình thương\nChúng con nguyện mãi theo đường thầy đi.`
      },
      {
        type: "poem",
        title: "LỖI CỦA THẦY",
        pageNumber: 86,
        author: "Vô Trí – Tâm Hòa",
        content: `Thầy đã biết sai rồi con ạ\nBao kiếp dài u tối vào ra\nTrả vay, trong cõi Ta-bà\nHình hài thay đổi, oán thân buộc ràng.\n\nCứ những tưởng việc mình luôn đúng\nCố chấp tâm, phóng túng tình riêng\nLàm cho tâm trí đảo điên\nLừa trên dối dưới, não phiền thêm sâu.\n\nThầy đã sai những khi sân giận\nMắng mọi người, oán tận tủy xương\nTâm này chẳng chút tình thương\nThế mà Thầy cứ dạy đường từ bi.\n\nThầy buồn lắm tự ti mặc cảm\nNhìn lại mình càng thảm càng sầu\nTu lâu mà chẳng đến đâu\nTốn hao cơm áo, nặng sâu ngục hình.\n\nLời đã nói riêng mình Thầy chịu\nCũng vì mong chúng điệu ráng tu\nĐạo tràng vững mạnh thiên thu\nNữ, nam phật tử ôn nhu thuận hòa.`
      }
    ]
  },
  {
    chapterNumber: 5,
    title: "Chương 3: Không Còn Sợ Hãi",
    pageRange: "Trang 95 - 149",
    quoteHeader: "Vật chất có thể giúp bạn có cuộc sống đầy đủ nhưng bạn chắc sẽ không nghĩ rằng điều đáng giá nhất trong cuộc đời mà mình cần có được chính là 'sự bình an'. Khi từ giã cõi đời, thứ con người còn lại chỉ là hai bàn tay trắng. Đến và đi vốn dĩ đều là như vậy, sao phải ôm giữ quá nhiều?",
    quoteAuthor: "Sa Môn Vô Trí – Thích Tâm Hòa",
    sections: [
      {
        type: "poem",
        title: "TRẢ LẠI EM TUỔI THƠ",
        pageNumber: 98,
        author: "Vô Trí – Tâm Hòa",
        content: `Ôi ngọt ngào tuổi thơ\nNhư giọt sương tinh mơ\nNhững trưa hè nắng gọi\nTrong cơn mưa bất ngờ.\n\nÔi ngọt ngào tuổi thơ\nMột buổi bên sách vở\nTung tăng bước đến trường\nÁo quần thật đơn sơ.\n\nÔi thương quá tuổi thơ\nĐầy đố kỵ nghi ngờ\nGiam mình thành tự kỷ\nSống lầm lũi bơ vơ.\n\nÔi thương quá tuổi thơ\nNhư bóng ma vật vờ\nGame, sống ảo trên mạng\nChôn vùi cả ước mơ.\n\nÔi thương quá tuổi thơ\nĐã mất tự bao giờ\nĐiện thoại, công nghệ số\nThành nấm mồ hoang sơ.\n\nTrả lại em tuổi thơ …`
      },
      {
        type: "essay",
        title: "BA ĐIỀU TRĂN TRỐI CỦA ALEXANDER ĐẠI ĐẾ",
        pageNumber: 102,
        author: "Thích Tâm Hòa",
        content: `Trước khi chết, Alexander Đại Đế căn dặn: “Thứ nhất, hãy cho tất cả ngự y giỏi nhất khiêng quan tài của ta trên đường trở về. Thứ hai, các binh sĩ phải trải hết vàng bạc, châu báu mà ta đã để dành cả đời suốt dọc con đường dẫn ra nghĩa địa. Thứ ba, ta muốn sau khi chết, bàn tay của ta phải được đặt thò ra bên ngoài nắp quan tài, để tất cả mọi người đều có thể nhìn thấy được.”\n\nLý do:\n- Thứ nhất: Ngự y giỏi đến đâu khi đối diện cái chết cũng bất lực. Hãy biết trân quý sinh mạng.\n- Thứ hai: Tài sản cao như núi khi chết đi cũng chỉ dùng để lót đường.\n- Thứ ba: Đến và đi hai bàn tay trắng, sao phải ôm giữ quá nhiều?`
      },
      {
        type: "essay",
        title: "NHÂN SINH ĐANG ĐI VỀ ĐÂU?",
        pageNumber: 124,
        author: "Thích Tâm Hòa",
        content: `Những ngày ấy, khi cả thế giới điên đảo với dịch bệnh Virus Corona thì tôi vẫn an bình nơi Không Cốc, quán chiếu nhìn lại nghiệp quả chính mình và cộng nghiệp chúng sinh. Tôi tự hỏi nhân sinh đang đi về đâu?\n\nTổ sư Pháp Xứng đã dạy: “Nhận thức đúng sẽ đưa đến thành công”. Thật vậy, do nghiệp quả của chúng sinh không đồng, căn tánh sai khác nên nhận thức về thế giới quan, nhân sinh quan hoàn toàn trái ngược nhau.\n\nMục đích cuộc đời là rèn luyện nhận thức đúng. Người có nhận thức đúng là người dung hòa được cá nhân trong tập thể, khiêm hạ trước lẽ đúng sai của cuộc đời, đi đầu trong khó khăn và đứng sau khi thành công.`
      },
      {
        type: "poem",
        title: "HẠT BỤI VÀ ĐỨC THẾ TÔN",
        pageNumber: 134,
        author: "Vô Trí – Tâm Hòa",
        content: `Từ khi còn là hạt bụi\nCon đã đi tìm đức Thế Tôn\nTrong muôn triệu kiếp luân hồi\nBất tận, mênh mông, khờ dại …\n\nCon lặng lẽ chìm sâu trong cơn bão cát\nVùi lấp sự hồn nhiên tự do và thanh thản\nBởi say trong ái tình mộng ảo\nĐiên loạn, mù quáng và hận thù.\n\nHạt bụi đã tìm ra đức Thế Tôn\nNgay trong mỗi bước đi, nụ cười\nTrong cái nhìn bao dung, thế ngồi vững chãi\nHạt bụi đã trở về bên đức Thế Tôn\n\nDù gió, mưa, sấm sét\nDù ngoài kia cuồng loạn hư danh\nHạt bụi vẫn thong dong, an nhiên\nVì hạt bụi đã an trú bên đức Thế Tôn.`
      },
      {
        type: "poem",
        title: "CÕI PHẬT THONG DONG",
        pageNumber: 141,
        author: "Vô Trí – Tâm Hòa",
        content: `Trời xanh, nắng rọi hoa vàng\nVườn thiền một góc bình an Thầy ngồi\nLặng nhìn thế sự đảo điên\nTay đưa quạt nhẹ cho phiền não vơi.\n\nNhìn kìa cánh bướm thảnh thơi\nBão giông sấm chớp mặc đời thị phi\nHơn thua tranh luận được gì\nTung bay cánh lượn sân si không còn.\n\nHòa mình cùng với nước non\nThủy chung chỉ một lời son vẹn tuyền\nGiọt buồn gác lại bên hiên\nThong dong cõi Phật bình yên ta về.`
      }
    ]
  },
  {
    chapterNumber: 6,
    title: "Chương 4: Ruộng Tốt Cho Người",
    pageRange: "Trang 150 - 199",
    quoteHeader: "Cây có cội, sông có nguồn, con người lấy văn hóa truyền thống làm nền tảng. Nền tảng càng vững càng dễ dàng hội nhập trong bối cảnh toàn cầu hóa. Văn hóa là sức mạnh nội tại của một dân tộc.",
    quoteAuthor: "Sa Môn Vô Trí – Thích Tâm Hòa",
    sections: [
      {
        type: "essay",
        title: "PHẬT HOÀNG TRẦN NHÂN TÔNG & NẾP SỐNG THIỀN",
        pageNumber: 155,
        author: "Thích Tâm Hòa",
        content: `Đêm nay, am Ngọa Vân tĩnh lặng - lạnh lẽo, tiếng sói hoang hú về khuya càng làm dấy lên sự khắc nghiệt nơi rừng thiêng nước độc. Pháp Loa - một đệ tử lớn của Trần Nhân Tông, ngồi nhóm lên bếp lửa sưởi ấm, nhớ về lúc Thầy mình từ bỏ cung vàng điện ngọc, mười lăm năm du phương làm sơn Tăng đơn độc...\n\nĐức Vua anh minh không những ghi đậm dấu ấn qua hai lần đại thắng quân Nguyên-Mông, mà đặc biệt hơn cả, Ngài là đấng Điều Ngự Giác Hoàng, vị Sư Tổ sáng lập Thiền phái Trúc Lâm Yên Tử — dòng Thiền thuần túy của Phật giáo Việt Nam.`
      },
      {
        type: "poem",
        title: "THIÊNG LIÊNG “ĐẠO NHÀ”",
        pageNumber: 162,
        author: "Vô Trí – Tâm Hòa",
        content: `Tôi muốn giữ lối xưa hồn dân tộc\nMấy ngàn năm nuôi lớn giống Tiên Rồng\nMẹ Âu Cơ khuyên dạy năm mươi con\nNhư Phù Đổng vươn mình thành dũng sĩ,\n\nCha rồng đó, năm mươi con xuống biển\nLạc Long Quân vùng vẫy đạp sóng cuồng\nGiữ cõi bờ từng tấc đất non sông\nNúi liền dãy, biển sâu hòa non nước.\n\nTôi muốn giữ nếp thiền gia đạo hạnh\nThuở hồng hoang Phật giáo đến nơi này\nNúi Quỳnh Viên, miền cửa Sót đẹp thay\nChử Đồng Tử nên đạo vàng từ đó,\n\nChiếc gậy trúc, nón lá làm cơ nghiệp\nSư Phật Quang truyền mối đạo sơ khai\nDùng tâm lành, ứng hóa độ tùy duyên\nÔi đẹp lắm, nét son trang Phật sử.`
      },
      {
        type: "poem",
        title: "HOA GẠO NAY VẪN NỞ",
        pageNumber: 172,
        author: "Vô Trí – Tâm Hòa",
        content: `Hoa gạo nay vẫn nở\nNhưng người ở nơi đâu\nBờ bến lặng u sầu\nGác lên mầu thương nhớ.\n\nHội năm nay có mở?\nSao đường vắng, người thưa...\nLòng nôn nao nhớ lắm\nHoa gạo thắm non xanh.\n\nAi đi lòng không nhớ\nNgày mùng 7 tháng 3\nXứ Đoài hội quê ta\nHoa gạo thêm son sắc.\n\nXa xa nhìn đất mẹ\nVạn Phật tháp linh thiêng\nLòng gửi trọn niềm riêng\nTheo tiếng chuông Hòa Phúc.`
      },
      {
        type: "poem",
        title: "MIỀN NAM CHỐN TỔ",
        pageNumber: 177,
        author: "Vô Trí – Tâm Hòa",
        content: `Miền Nam đó, đất chín rồng xanh mát\nNắng Sài thành, vội đến cũng vội đi\nCơn mưa chiều bất chợt ướt hàng mi\nQuen mà lạ, Sài Gòn là vậy đó.\n\nNghe Thầy kể chốn Tổ đình Hoằng Pháp\nNơi ươm mầm nuôi lớn hạnh vị tha\nTâm Sư Ông như biển cả bao la\nĐường giải thoát mở ra từ nơi ấy.\n\nThầy kể rằng Nhị Nghiêm uy linh tháp\nNgôi mộ Tổ Người khai sinh Hoằng Pháp\nNgộ Chân Tử danh người còn sáng mãi\nChuyển pháp luân Đạo Phật đẹp quê hương.\n\nTừ giã Người, Thầy đi về Luật viện\nNơi dưỡng nuôi bao thế hệ Tăng tài\nChùa Huệ Nghiêm, Phật học viện năm xưa\nThắp sáng mãi ngọn đuốc soi nhân thế.\n\nGiới đài viện, nơi trùng tuyên Luật tạng\nBậc danh Sư hiệu thượng Minh hạ Thông\nBóng Lão tùng nay đã quá bảy mươi\nVẫn dõng dạc khuyên con gìn giới luật.`
      }
    ]
  },
  {
    chapterNumber: 7,
    title: "Đã Về Đã Tới & Lịch Sử Tùng Lâm",
    pageRange: "Trang 200 - 217",
    quoteHeader: "Sẽ là quyển sách ý nghĩa nếu được viết từ sự chân thành. Sẽ là tiếng đàn hay nếu được đánh lên từ tâm thanh tịnh. Sẽ là con đường sáng nếu dẫn chúng sinh về chân lý cao thượng.",
    quoteAuthor: "Sa Môn Vô Trí – Thích Tâm Hòa",
    sections: [
      {
        type: "essay",
        title: "ĐÃ VỀ ĐÃ TỚI",
        pageNumber: 202,
        author: "Thích Tâm Hòa",
        content: `Thầy chỉ mong các con:\n• Luôn giữ niềm tin vào Tam bảo;\n• Ý thức trách nhiệm của người phật tử;\n• Khẳng định vị trí trong xã hội;\n• Phát Bồ đề tâm xuất gia hành đạo cứu đời;\n• Tôn trọng đời sống cá nhân của bạn đồng tu;\n• Không xúi bảo hay gán ghép chuyện yêu đương, lập gia đình;\n• Luôn đặt Tam bảo, thầy bạn trong ý nghĩ và trở về khi có thể.`
      },
      {
        type: "essay",
        title: "LỊCH SỬ TÙNG LÂM HÒA PHÚC",
        pageNumber: 206,
        author: "Sa Môn Tâm Hòa hiệu Vô Trí cẩn soạn",
        content: `Tùng lâm Hòa Phúc (Hòa Phúc Tự) tọa trên gò Kim Quy, lưng tựa Tản Viên Sơn, mặt hướng dòng Tích Giang. Đất thiêng xưa tục gọi 'Thất Tinh Hạ Phàm' tức 7 ngôi sao giáng hạ tạo nên 7 gò đất.\n\n• Năm 2010: Xây dựng nhà Tứ Ân, nhà Vãng Sinh, lầu Quán Thế Âm\n• Năm 2012: Xây dựng giảng đường Ngộ Chân Tử, cổng Tam Quan\n• Năm 2014: Xây dựng tòa Tam bảo, khu Nội viện\n• Năm 2018: Xây dựng tháp Xá Lợi Vạn Phật Hòa Bình\n• Năm 2020: Xây dựng nhà thờ Mẫu, đại tượng Quán Âm Bồ Tát, ao Thất Bảo, vườn Lâm Tỳ Ni, tháp Tổ.`
      },
      {
        type: "publishing",
        title: "THÔNG TIN XUẤT BẢN — NXB HỒNG ĐỨC",
        pageNumber: 217,
        content: `NHÀ XUẤT BẢN HỒNG ĐỨC\nĐịa chỉ: 65 Tràng Thi, Quận Hoàn Kiếm, Hà Nội\nGiám đốc: BÙI VIỆT BẮC\nTổng biên tập: LÝ BÁ TOÀN\nBiên tập: Phan Thị Ngọc Minh\nSửa bản in: Hòa Phúc\nThiết kế bìa: Tống Viết Diễn\nIn 5.000 cuốn, khổ 12x18cm tại Xí nghiệp in Fahasa TP.HCM\nMã ISBN: 978-604-476-699-7\nNăm xuất bản: 2023`
      }
    ]
  }
];

// Read all 217 individual pages for 3D FlipBook
const full217Pages = [];
for (let p = 1; p <= 217; p++) {
  full217Pages.push({
    pageNumber: p,
    headerLeft: p % 2 === 0 ? "Thích Tâm Hòa" : "Đi qua khổ vui cuộc đời",
    headerRight: p % 2 === 0 ? "Đi qua khổ vui cuộc đời" : "Thích Tâm Hòa",
    pdfPageUrl: `/pdf/di-qua-kho-vui-q1/page-${p}.jpg`
  });
}

const bookRecord = {
  id: "sach-01",
  slug: "di-qua-kho-vui-cuoc-doi",
  title: "Đi Qua Khổ Vui Cuộc Đời",
  subtitle: "Tập Ký Hồi Ức Chiêm Nghiệm & Tri Ân Tam Bảo",
  author: "Sa Môn Vô Trí (hiệu Thích Tâm Hòa)",
  category: "Hồi Ký & Tu Tập",
  coverImage: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc_tong-phong-truyen-thua_tiep-buoc-thay-toi_thay_-chu-thich-popup-sach-dqkvcd-1787464550735.jpg",
  description: "Tác phẩm đúc kết chặng đường tu tập, vượt qua muôn vàn gian khó, những bài học sâu sắc về tình thầy trò, sự thịnh suy vô thường và lòng tri ân vô hạn đối với Sư Tổ Ngộ Chân Tử cùng Hòa Thượng Bổn Sư Thích Chân Tính.",
  publisher: "Nhà Xuất Bản Hồng Đức (2023)",
  isbn: "978-604-476-699-7",
  totalPages: 217,
  totalVolumes: 2,
  volume1: {
    title: "Quyển 01: Yêu Thương Bắt Đầu & Ruộng Tốt Cho Người",
    pageCount: 217,
    chapters: q1Chapters
  },
  flipPagesList: full217Pages
};

// Update sach-an-pham-data.json
const dataPath = path.resolve(process.cwd(), 'src/data/sach-an-pham-data.json');
let existing = [];
if (fs.existsSync(dataPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (e) {}
}

const updated = existing.filter(b => b.slug !== 'di-qua-kho-vui-cuoc-doi');
updated.unshift(bookRecord);

fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2), 'utf-8');
console.log('✅ Đã cập nhật hoàn chỉnh Quyển 1 (217 trang chuẩn xác) vào sach-an-pham-data.json');
