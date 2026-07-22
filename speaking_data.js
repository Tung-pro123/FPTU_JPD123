/**
 * JPD123 - Speaking Exam Topics Data (SPR26)
 * 18 Exam Sets (Đề 1 - Đề 18) with Questions, Sample Answers, Meanings & Grammar Tips
 */

const SPEAKING_DATA = [
    {
        id: 1,
        title: "Đề 1: Sự kiện & Thói quen ăn uống",
        questions: [
            {
                qJp: "東京で なにが ありますか。",
                qVi: "Ở Tokyo có (sự kiện) gì vậy?",
                aJp: "コンサートが あります。",
                aVi: "Có buổi hòa nhạc.",
                tip: "💡 Cấu trúc: [Địa điểm] で なにが ありますか。 (Diễn ra sự kiện gì ở đâu, dùng trợ từ で)"
            },
            {
                qJp: "ベトナム人は フォークと ナイフで ごはんを 食べますか。",
                qVi: "Người Việt Nam có ăn cơm bằng nĩa và dao không?",
                aJp: "いいえ、はしで ごはんを 食べます。",
                aVi: "Không, (người Việt Nam) ăn cơm bằng đũa.",
                tip: "💡 Trợ từ で chỉ dụng cụ/phương tiện. Trả lời phủ định có thể dùng: いいえ、フォークと ナイフで 食べません。"
            },
            {
                qJp: "今、〜さんは なにが いちばん ほしいですか。",
                qVi: "Bây giờ bạn muốn có cái gì nhất?",
                aJp: "おかねが いちばん ほしいです。",
                aVi: "Tôi muốn có tiền nhất.",
                tip: "💡 Cấu trúc: [N] が いちばん ほしいです (Muốn có N nhất)"
            }
        ]
    },
    {
        id: 2,
        title: "Đề 2: Phương tiện & Ca sĩ nổi tiếng",
        questions: [
            {
                qJp: "さくらさんは なにで 学校へ 行きますか。",
                qVi: "Bạn Sakura đi đến trường bằng phương tiện gì?",
                aJp: "さくらさんは じてんしゃで 学校へ 行きます。",
                aVi: "Bạn Sakura đi đến trường bằng xe đạp.",
                tip: "💡 Trợ từ で chỉ phương tiện di chuyển. Nếu đi bộ dùng: あるいて 行きます (Không dùng trợ từ で)"
            },
            {
                qJp: "かしゅで だれが いちばん ゆうめいですか。",
                qVi: "Trong số các ca sĩ, ai là người nổi tiếng nhất?",
                aJp: "Sơn Tùng M-TPさんが いちばん ゆうめいです。",
                aVi: "Sơn Tùng M-TP là nổi tiếng nhất.",
                tip: "💡 Cấu trúc so sánh nhất: [Nhóm N] で だれが いちばん Tính từ ですか。"
            },
            {
                qJp: "〜さんの うちの ちかくに なにが ありますか。",
                qVi: "Ở gần nhà bạn có cái gì?",
                aJp: "こうえんが あります。",
                aVi: "Có công viên.",
                tip: "💡 Cấu trúc tồn tại vật: [Vị trí] に [Vật] が あります。"
            }
        ]
    },
    {
        id: 3,
        title: "Đề 3: Địa điểm đã đi & Đồ uống yêu thích",
        questions: [
            {
                qJp: "きのう、はなさんは どこへ いきましたか。",
                qVi: "Hôm qua bạn Hana đã đi đâu?",
                aJp: "ゆうびんきょくへ いきました。",
                aVi: "Đã đi đến bưu điện.",
                tip: "💡 Câu hỏi Yes/No: どこかへ いきましたか (Có đi đâu không?) ➔ Phủ định: いいえ、どこも いきませんでした (Không đi đâu cả)."
            },
            {
                qJp: "〜さんのまちに きょうかいが ありますか。",
                qVi: "Ở thành phố của bạn có nhà thờ không?",
                aJp: "はい、きょうかいが あります。",
                aVi: "Vâng, có nhà thờ ạ.",
                tip: "💡 きょうかい (教会 - nhà thờ)"
            },
            {
                qJp: "のみもので なにが いちばん すきですか。",
                qVi: "Trong các đồ uống, bạn thích cái gì nhất?",
                aJp: "コーヒーが いちばん すきです。",
                aVi: "Tôi thích cà phê nhất.",
                tip: "💡 Cấu trúc: [Nhóm N] で なにが いちばん すきですか。"
            }
        ]
    },
    {
        id: 4,
        title: "Đề 4: Thời gian di chuyển & Rủ rê",
        questions: [
            {
                qJp: "カントーから ホーチミン市まで どのくらいですか。",
                qVi: "Từ Cần Thơ đến TP.HCM mất bao lâu?",
                aJp: "カントーから ホーチミン市まで ３じかんはんです。",
                aVi: "Từ Cần Thơ đến TP.HCM mất khoảng 3 tiếng rưỡi.",
                tip: "💡 Cấu trúc: [A] から [B] まで どのくらいですか (Từ A đến B mất bao lâu)"
            },
            {
                qJp: "こんばん、いっしょに 食べに行きませんか。",
                qVi: "Tối nay cùng đi ăn với tôi không?",
                aJp: "いいですね。 食べに行きましょう。",
                aVi: "Hay quá nhỉ. Chúng ta cùng đi ăn nào.",
                tip: "💡 Mẫu rủ rê: ～ Vに 行きませんか ➔ Đồng ý: いいですね。～ Vに 行きましょう。"
            },
            {
                qJp: "今、おかねが たくさんあります。なにを かいたいですか。",
                qVi: "Bây giờ bạn có nhiều tiền. Bạn muốn mua gì?",
                aJp: "いえを かいたいです。",
                aVi: "Tôi muốn mua nhà.",
                tip: "💡 Cấu trúc muốn làm gì: V(bỏ ます) + たいたい (たいです)"
            }
        ]
    },
    {
        id: 5,
        title: "Đề 5: Thành phố & Dụng cụ ăn uống",
        questions: [
            {
                qJp: "このまちに なにが ありますか。",
                qVi: "Thành phố này có cái gì?",
                aJp: "このまちに やまが あります。",
                aVi: "Ở thành phố này có núi.",
                tip: "💡 やま (山 - núi)"
            },
            {
                qJp: "ベトナム人は なにで ごはんを 食べますか。",
                qVi: "Người Việt Nam ăn cơm bằng dụng cụ gì?",
                aJp: "ベトナム人は はしで ごはんを 食べます。",
                aVi: "Người Việt Nam ăn cơm bằng đũa.",
                tip: "💡 なにで (bằng cái gì / bằng phương tiện gì)"
            },
            {
                qJp: "今、〜さんは なにが いちばん すきですか。",
                qVi: "Bây giờ bạn thích cái gì nhất?",
                aJp: "えいがが いちばん すきです。",
                aVi: "Tôi thích xem phim nhất.",
                tip: "💡 えいが (映画 - phim ảnh)"
            }
        ]
    },
    {
        id: 6,
        title: "Đề 6: Hành động quá khứ & Trường học",
        questions: [
            {
                qJp: "きのう、ケンタさんは なにを しましたか。",
                qVi: "Hôm qua bạn Kenta đã làm gì?",
                aJp: "ケンタさんは ギターを ひきました。",
                aVi: "Bạn Kenta đã chơi đàn guitar.",
                tip: "💡 ギターを ひきます (Chơi đàn guitar) ➔ Quá khứ: ひきました"
            },
            {
                qJp: "FPTは どんな 大学ですか。",
                qVi: "FPT là trường đại học như thế nào?",
                aJp: "FPTは きれいな 大学です。",
                aVi: "FPT là trường đại học đẹp.",
                tip: "💡 どんな + N (N như thế nào?)"
            },
            {
                qJp: "ベトナムで どこが いちばん ゆうめいですか。",
                qVi: "Ở Việt Nam nơi nào là nổi tiếng nhất?",
                aJp: "ホーチミン市が いちばん ゆうめいです。",
                aVi: "Thành phố Hồ Chí Minh là nổi tiếng nhất.",
                tip: "💡 Cấu trúc so sánh nơi chốn: [Địa điểm] で どこが いちばん Tính từ ですか。"
            }
        ]
    },
    {
        id: 7,
        title: "Đề 7: Trạng thái hiện tại & Bữa sáng",
        questions: [
            {
                qJp: "はやとさんは なにを していますか。",
                qVi: "Anh Hayato đang làm gì vậy?",
                aJp: "りょうりを つくっています。",
                aVi: "Anh ấy đang nấu ăn.",
                tip: "💡 Thì hiện tại tiếp diễn: V-ています"
            },
            {
                qJp: "もう あさごはんを 食べましたか。",
                qVi: "Bạn đã ăn sáng chưa?",
                aJp: "いいえ、まだです。",
                aVi: "Chưa, tôi vẫn chưa ăn.",
                tip: "💡 Cấu trúc: もう Vましたか ➔ Chưa làm: いいえ、まだです。"
            },
            {
                qJp: "〜さんのまちは にぎやかですか。",
                qVi: "Thành phố của bạn có nhộn nhịp/sầm uất không?",
                aJp: "はい、私のまちは にぎやかです。",
                aVi: "Vâng, thành phố của tôi rất nhộn nhịp.",
                tip: "💡 にぎやか (sầm uất, nhộn nhịp)"
            }
        ]
    },
    {
        id: 8,
        title: "Đề 8: Biểu đồ thời tiết & Thời gian đi học",
        questions: [
            {
                qJp: "日本は いちねんで なんがつが いちばん さむいですか。",
                qVi: "Ở Nhật Bản trong 1 năm thì tháng mấy lạnh nhất?",
                aJp: "２がつが いちばん さむいです。",
                aVi: "Tháng 2 là lạnh nhất. (Hoặc tháng 6 nóng nhất: ６がつが いちばん あついです)",
                tip: "💡 Nhìn biểu đồ chọn tháng có cột thấp nhất (lạnh) hoặc cao nhất (nóng)"
            },
            {
                qJp: "うちから 学校まで どのくらいですか。",
                qVi: "Từ nhà đến trường mất khoảng bao lâu?",
                aJp: "うちから 学校まで １じかんです。",
                aVi: "Từ nhà đến trường mất khoảng 1 tiếng.",
                tip: "💡 じかん (tiếng / giờ đồng hồ)"
            },
            {
                qJp: "きのう、だれと 学校へ 行きましたか。",
                qVi: "Hôm qua bạn đi đến trường cùng với ai?",
                aJp: "ともだちと 学校へ 行きました。",
                aVi: "Tôi đã đi đến trường cùng với bạn.",
                tip: "💡 Trợ từ と (cùng với ai)"
            }
        ]
    },
    {
        id: 9,
        title: "Đề 9: Dụng cụ ăn & Thời tiết tháng 1",
        questions: [
            {
                qJp: "みさきさんは なにで 食べますか。",
                qVi: "Bạn Misaki ăn bằng cái gì?",
                aJp: "みさきさんは フォークと ナイフで 食べます。",
                aVi: "Bạn Misaki ăn bằng nĩa và dao.",
                tip: "💡 フォーク (nĩa), ナイフ (dao)"
            },
            {
                qJp: "ベトナムは 1月、さむいですか。",
                qVi: "Việt Nam vào tháng 1 có lạnh không?",
                aJp: "はい、ベトナムは 1月、さむいです。",
                aVi: "Vâng, Việt Nam vào tháng 1 lạnh.",
                tip: "💡 1月 (いちがつ - tháng 1)"
            },
            {
                qJp: "〜さんは おととい、どこへ 行きましたか。",
                qVi: "Hôm kia bạn đã đi đâu?",
                aJp: "学校へ 行きました。",
                aVi: "Tôi đã đi đến trường.",
                tip: "💡 おととい (hôm kia) ➔ Động từ chia quá khứ 行きました"
            }
        ]
    },
    {
        id: 10,
        title: "Đề 10: Vị trí hình ảnh & Thời tiết",
        questions: [
            {
                qJp: "なにで やさいを きりますか。",
                qVi: "Bạn cắt rau củ bằng cái gì?",
                aJp: "ナイフで やさいを きります。",
                aVi: "Tôi cắt rau củ bằng dao.",
                tip: "💡 やさい (野菜 - rau củ), きります (cắt)"
            },
            {
                qJp: "ベトナムで いつが いちばん あついですか。",
                qVi: "Ở Việt Nam khi nào là nóng nhất?",
                aJp: "ろくがつが いちばん あついです。",
                aVi: "Tháng 6 là nóng nhất.",
                tip: "💡 いつ (Khi nào)"
            },
            {
                qJp: "いぬは どこに いますか。",
                qVi: "Con chó đang ở đâu?",
                aJp: "いぬは いえのなかに います。",
                aVi: "Con chó đang ở trong nhà.",
                tip: "💡 いえのなか (bên trong nhà)"
            },
            {
                qJp: "タナカさんは どこに いますか。",
                qVi: "Bạn Tanaka đang ở đâu?",
                aJp: "たなかさんは きの となりに います。",
                aVi: "Bạn Tanaka đang ở bên cạnh cái cây.",
                tip: "💡 きの となり (bên cạnh cái cây)"
            }
        ]
    },
    {
        id: 11,
        title: "Đề 11: Mục đích đi lại & So sánh thích",
        questions: [
            {
                qJp: "あかねさんは あした なにを しに 行きますか。",
                qVi: "Ngày mai bạn Akane đi đâu làm gì?",
                aJp: "あかねさんは としょかんへ ほんを かりに 行きます。",
                aVi: "Bạn Akane đi đến thư viện để mượn sách.",
                tip: "💡 Cấu trúc chỉ mục đích di chuyển: [Địa điểm] へ [V(bỏ ます) / N] に 行きます"
            },
            {
                qJp: "にくと さかなと どちらが すきですか。",
                qVi: "Giữa thịt và cá bạn thích cái nào hơn?",
                aJp: "どちらも すきです。",
                aVi: "Cả hai tôi đều thích.",
                tip: "💡 Thích cả hai: どちらも すきです。Thích thịt hơn: にくのほうが すきです。"
            },
            {
                qJp: "〜さんのまちは どんな ところですか。",
                qVi: "Thành phố của bạn là nơi như thế nào?",
                aJp: "私のまちは きれいな ところです。",
                aVi: "Thành phố của tôi là một nơi đẹp.",
                tip: "💡 ところ (場所 - nơi chốn, địa điểm)"
            }
        ]
    },
    {
        id: 12,
        title: "Đề 12: Siêu thị & Người nổi tiếng",
        questions: [
            {
                qJp: "ハッピースーパーで なにが ありますか。",
                qVi: "Có sự kiện gì ở siêu thị Happy?",
                aJp: "セールが あります。",
                aVi: "Có chương trình giảm giá (Sale).",
                tip: "💡 セール (Sale / giảm giá)"
            },
            {
                qJp: "ホーチミンは どんな ひとですか。",
                qVi: "Bác Hồ Chí Minh là người như thế nào?",
                aJp: "ホーチミンは ゆうめいな ひとです。",
                aVi: "Bác Hồ Chí Minh là người nổi tiếng.",
                tip: "💡 ゆうめい (有名 - nổi tiếng)"
            },
            {
                qJp: "今、〜さんは なにが いちばん ほしいですか。",
                qVi: "Bây giờ bạn muốn có cái gì nhất?",
                aJp: "おかねが いちばん ほしいです。",
                aVi: "Tôi muốn có tiền nhất.",
                tip: "💡 ほしい (Muốn có)"
            }
        ]
    },
    {
        id: 13,
        title: "Đề 13: Cảm nhận bài test quá khứ",
        questions: [
            {
                qJp: "ベトナムは いちねんで なんがつが いちばん あついですか。",
                qVi: "Ở Việt Nam trong 1 năm tháng mấy nóng nhất?",
                aJp: "６がつが いちばん あついです。",
                aVi: "Tháng 6 là nóng nhất.",
                tip: "💡 ６がつ (ろくがつ - Tháng 6)"
            },
            {
                qJp: "せんしゅうの テストは どうでしたか。",
                qVi: "Bài kiểm tra tuần trước như thế nào?",
                aJp: "せんしゅうの テストは かんたんでした。",
                aVi: "Bài kiểm tra tuần trước đã rất dễ.",
                tip: "💡 Quá khứ của tính từ đuôi な (かんたん): かんたんでした"
            },
            {
                qJp: "FPT大学の ちかくに なにが ありますか。",
                qVi: "Ở gần trường Đại học FPT có cái gì?",
                aJp: "コンビニが あります。",
                aVi: "Có cửa hàng tiện lợi.",
                tip: "💡 コンビニ (Cửa hàng tiện lợi)"
            }
        ]
    },
    {
        id: 14,
        title: "Đề 14: Đang làm gì & Mô tả đất nước",
        questions: [
            {
                qJp: "だれが りょうりを つくっていますか。",
                qVi: "Ai đang nấu ăn vậy?",
                aJp: "たなかさんは りょうりを つくっています。",
                aVi: "Bạn Tanaka đang nấu ăn.",
                tip: "💡 Hỏi ai làm gì: だれが + V"
            },
            {
                qJp: "きのう、どこかへ 行きましたか。",
                qVi: "Hôm qua bạn có đi đâu không?",
                aJp: "はい、学校へ 行きました。",
                aVi: "Vâng, tôi đã đi đến trường.",
                tip: "💡 Câu hỏi Yes/No với どこかへ"
            },
            {
                qJp: "ベトナムは どんなくにですか。",
                qVi: "Việt Nam là đất nước như thế nào?",
                aJp: "ベトナムは きれいなくにです。",
                aVi: "Việt Nam là một đất nước đẹp.",
                tip: "💡 くに (国 - đất nước)"
            }
        ]
    },
    {
        id: 15,
        title: "Đề 15: Chơi nhạc cụ & Học cùng ai",
        questions: [
            {
                qJp: "まことさんは なにを していますか。",
                qVi: "Bạn Makoto đang làm gì vậy?",
                aJp: "まことさんは ギターを ひいています。",
                aVi: "Bạn Makoto đang chơi đàn guitar.",
                tip: "💡 ギターを ひきます ➔ ギターを ひいています"
            },
            {
                qJp: "せんしゅう、〜さんは だれと べんきょうしましたか。",
                qVi: "Tuần trước bạn đã học cùng với ai?",
                aJp: "ともだちと べんきょうしました。",
                aVi: "Tôi đã học cùng với bạn.",
                tip: "💡 ともだち (友達 - bạn bè)"
            },
            {
                qJp: "〜さんのまちは にぎやかですか。",
                qVi: "Thành phố của bạn có nhộn nhịp không?",
                aJp: "はい、にぎやかです。",
                aVi: "Vâng, rất nhộn nhịp.",
                tip: "💡 Trả lời ngắn: はい、にぎやかです。"
            }
        ]
    },
    {
        id: 16,
        title: "Đề 16: Đi sắm đồ & Nhà hàng ngon nhất",
        questions: [
            {
                qJp: "きのう、ゆかさんは なにをしに 行きましたか。",
                qVi: "Hôm qua bạn Yuka đã đi đâu làm gì?",
                aJp: "スーパーへ かいものに 行きました。",
                aVi: "Bạn ấy đã đi siêu thị để mua sắm.",
                tip: "💡 かいもの (買い物 - mua sắm)"
            },
            {
                qJp: "Đà Nẵngで どのレストランが いちばん おいしいですか。",
                qVi: "Ở Đà Nẵng nhà hàng nào là ngon nhất?",
                aJp: "Trúc Lâm Viênレストランが いちばん おいしいです。",
                aVi: "Nhà hàng Trúc Lâm Viên là ngon nhất.",
                tip: "💡 どの + N (Cái N nào trong số nhiều cái)"
            },
            {
                qJp: "〜さんは いま、どこに いますか。",
                qVi: "Bây giờ bạn đang ở đâu?",
                aJp: "ホーチミン市に います。",
                aVi: "Tôi đang ở Thành phố Hồ Chí Minh.",
                tip: "💡 Trả lời vị trí bản thân: [Địa điểm] に います"
            }
        ]
    },
    {
        id: 17,
        title: "Đề 17: Lễ hội Asakusa & Vị trí trường FPT",
        questions: [
            {
                qJp: "あさくさで なにが ありますか。",
                qVi: "Ở Asakusa có sự kiện gì?",
                aJp: "おまつりが あります。",
                aVi: "Có lễ hội.",
                tip: "💡 おまつり (お祭り - lễ hội)"
            },
            {
                qJp: "FPT大学は どこに ありますか。",
                qVi: "Trường Đại học FPT ở đâu?",
                aJp: "FPT大学は ホーチミン市に あります。",
                aVi: "Trường Đại học FPT ở TP. Hồ Chí Minh.",
                tip: "💡 Vị trí trường học / tòa nhà: dùng あります"
            },
            {
                qJp: "日本人は フォークとナイフで ごはんを食べますか。",
                qVi: "Người Nhật có ăn cơm bằng nĩa và dao không?",
                aJp: "いいえ、はしで ごはんを 食べます。",
                aVi: "Không, người Nhật ăn cơm bằng đũa.",
                tip: "💡 はし (箸 - đôi đũa)"
            }
        ]
    },
    {
        id: 18,
        title: "Đề 18: Hành động đang uống & So sánh tốc độ",
        questions: [
            {
                qJp: "あかねさんは なにを していますか。",
                qVi: "Bạn Akane đang làm gì vậy?",
                aJp: "あかねさんは みずを のんでいます。",
                aVi: "Bạn Akane đang uống nước.",
                tip: "💡 のみます ➔ のんでいます"
            },
            {
                qJp: "バスと じてんしゃと どちらが はやいですか。",
                qVi: "Giữa xe buýt và xe đạp cái nào nhanh hơn?",
                aJp: "バスのほうが はやいです。",
                aVi: "Xe buýt nhanh hơn.",
                tip: "💡 Cấu trúc so sánh 2 vật: [A] と [B] と どちらが Tính từ ですか ➔ [A] のほうが Tính từ です。"
            },
            {
                qJp: "日本語は どうですか。",
                qVi: "Tiếng Nhật thì như thế nào?",
                aJp: "日本語は むずかしいです。",
                aVi: "Tiếng Nhật thì khó.",
                tip: "💡 むずかしい (難し - khó)"
            }
        ]
    }
];
