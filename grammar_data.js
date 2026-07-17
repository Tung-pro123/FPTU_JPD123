/**
 * JPD123 - Grammar Data (Ngữ pháp Unit 4 ~ Unit 7)
 * Dữ liệu ngữ pháp được tổng hợp từ ghi chép bài học.
 */

const GRAMMAR_DATA = [
    // =====================================================================
    // UNIT 4: Phương hướng, Thời gian và Tính từ
    // =====================================================================
    {
        unit: "Unit 4",
        title: "Phương hướng, Thời gian và Tính từ",
        icon: "fa-compass",
        sections: [
            {
                title: "Hỏi về phương hướng, địa điểm",
                structures: [
                    {
                        formula: "S + は + N(địa điểm/quốc gia) + の + どこ / どちら ですか。",
                        explanation: "Hỏi ai/cái gì ở vùng nào, phía nào của một quốc gia hoặc địa điểm."
                    }
                ],
                examples: [
                    { jp: "ホーチミン市はベトナムのみなみです。", vi: "Thành phố Hồ Chí Minh ở phía nam Việt Nam." }
                ],
                notes: []
            },
            {
                title: "Di chuyển bằng phương tiện gì, mất bao lâu",
                structures: [
                    {
                        formula: "N(phương tiện) + で + N(địa điểm) + へ + いきます。",
                        explanation: "Đi đến địa điểm bằng phương tiện gì. Từ để hỏi: なにで"
                    },
                    {
                        formula: "[Địa điểm 1] + から + [Địa điểm 2] + まで + (phương tiện で) + どのくらいですか。",
                        explanation: "Hỏi từ nơi A đến nơi B mất bao lâu."
                    }
                ],
                examples: [
                    { jp: "バスでがっこうへいきます。", vi: "Đi đến trường bằng xe buýt." },
                    { jp: "うちからがっこうまで バスで 30ぷんぐらいです。", vi: "Từ nhà đến trường bằng xe buýt mất khoảng 30 phút." }
                ],
                notes: [
                    "Trả lời: ～じかん / じかんはん くらいです。(Mất khoảng ~ tiếng / tiếng rưỡi)"
                ]
            },
            {
                title: "Ngữ pháp về Tính từ (Adj)",
                structures: [
                    {
                        formula: "Tính từ đuôi い: Tận cùng là い (たかい, ちいさい)",
                        explanation: "Nhóm tính từ kết thúc bằng い"
                    },
                    {
                        formula: "Tính từ đuôi な: Các từ còn lại",
                        explanation: "Nhóm tính từ không kết thúc bằng い. Lưu ý ngoại lệ: きれい, ゆうめい, きらい thuộc nhóm な."
                    }
                ],
                examples: [],
                tables: [
                    {
                        caption: "Bảng chia Tính từ — Thì hiện tại",
                        headers: ["Thể", "Tính từ đuôi い", "Tính từ đuôi な"],
                        rows: [
                            ["Khẳng định", "S + は + Adj-い + です。", "S + は + Adj-な + です。"],
                            ["Phủ định", "S + は + Adj (bỏ い) + くないです。", "S + は + Adj-な + じゃありません。"],
                            ["Bổ nghĩa cho N", "Adj-い + N", "Adj-な + な + N"]
                        ]
                    }
                ],
                notes: [
                    "⚠️ Ngoại lệ: いいです (tốt) → Phủ định là よくないです (không phải いくないです).",
                    "⚠️ きれい, ゆうめい, きらい tuy kết thúc bằng い nhưng thuộc nhóm な."
                ]
            },
            {
                title: "Hỏi tính chất & Mức độ của tính từ",
                structures: [
                    {
                        formula: "S + は + どうですか。 / どんな + N + ですか。",
                        explanation: "Hỏi tính chất \"như thế nào?\""
                    }
                ],
                examples: [
                    { jp: "にほんごのべんきょうはどうですか。", vi: "Việc học tiếng Nhật như thế nào?" }
                ],
                tables: [
                    {
                        caption: "Mức độ của tính từ",
                        headers: ["Mức độ", "Cấu trúc", "Ví dụ"],
                        rows: [
                            ["Rất (+)", "とても + Adj", "とても たかいです (Rất đắt)"],
                            ["Hơi / Một chút (+)", "すこし + Adj", "すこし さむいです (Hơi lạnh)"],
                            ["Không ... lắm (−)", "あまり + Adj(phủ định)", "あまり おおきくないです (Không lớn lắm)"]
                        ]
                    }
                ],
                notes: []
            },
            {
                title: "Nối 2 tính từ & Trợ từ cuối câu",
                structures: [
                    {
                        formula: "S は Adj1 です。そして、Adj2 です。",
                        explanation: "Nối 2 tính từ đồng tình (Và)"
                    },
                    {
                        formula: "S は Adj1 ですが、Adj2 です。",
                        explanation: "Nối 2 tính từ tương phản (Nhưng)"
                    },
                    {
                        formula: "[Nơi chốn] に [N] が あります。",
                        explanation: "Chỉ sự tồn tại của đồ vật tại một nơi"
                    }
                ],
                examples: [
                    { jp: "このへやはひろいです。そして、あかるいです。", vi: "Căn phòng này rộng. Và, sáng sủa." },
                    { jp: "このへやはひろいですが、ちょっとくらいです。", vi: "Căn phòng này rộng, nhưng hơi tối." }
                ],
                tables: [
                    {
                        caption: "Trợ từ cuối câu",
                        headers: ["Trợ từ", "Ý nghĩa", "Ví dụ"],
                        rows: [
                            ["ね", "Khẳng định, đồng tình, khen ngợi", "いいてんきですね。(Thời tiết đẹp nhỉ.)"],
                            ["よ", "Nhấn mạnh, thông báo thông tin mới", "あしたテストがありますよ。(Ngày mai có bài kiểm tra đấy.)"]
                        ]
                    }
                ],
                notes: []
            },
            {
                title: "Miêu tả chi tiết & Hỏi thời tiết",
                structures: [
                    {
                        formula: "S は [N2] が + Adj です。",
                        explanation: "Miêu tả một đặc điểm cụ thể (N2) của chủ đề lớn (S)."
                    },
                    {
                        formula: "[Địa điểm] は [Thời gian]、どうですか。",
                        explanation: "Hỏi thời tiết vào một thời điểm cụ thể."
                    }
                ],
                examples: [
                    { jp: "わたしのまちはみどりがおおいです。", vi: "Thành phố của tôi có nhiều cây xanh." },
                    { jp: "ベトナムはごがつ、どうですか。", vi: "Thời tiết Việt Nam tháng 5 như thế nào?" }
                ],
                notes: []
            }
        ]
    },
    // =====================================================================
    // UNIT 5: Quá khứ, Mong muốn và Mục đích
    // =====================================================================
    {
        unit: "Unit 5",
        title: "Quá khứ, Mong muốn và Mục đích",
        icon: "fa-clock-rotate-left",
        sections: [
            {
                title: "Thì quá khứ của Danh từ và Động từ",
                structures: [],
                examples: [],
                tables: [
                    {
                        caption: "Bảng chia Thì quá khứ — Danh từ & Động từ",
                        headers: ["Từ loại", "KĐ (Hiện tại)", "PĐ (Hiện tại)", "KĐ (Quá khứ)", "PĐ (Quá khứ)"],
                        rows: [
                            ["Danh từ", "N です", "N じゃありません", "N でした", "N じゃありませんでした"],
                            ["Động từ", "V ます", "V ません", "V ました", "V ませんでした"]
                        ]
                    }
                ],
                notes: []
            },
            {
                title: "Thì quá khứ của Tính từ",
                structures: [],
                examples: [],
                tables: [
                    {
                        caption: "Bảng chia Thì quá khứ — Tính từ",
                        headers: ["Loại Adj", "KĐ (Quá khứ)", "PĐ (Quá khứ)"],
                        rows: [
                            ["Adj な", "Adj-な + でした", "Adj-な + じゃありませんでした"],
                            ["Adj い", "Adj (bỏ い) + かったです", "Adj (bỏ い) + くなかったです"]
                        ]
                    }
                ],
                notes: [
                    "⚠️ Ngoại lệ: いいです → QK: よかったです → QK PĐ: よくなかったです."
                ]
            },
            {
                title: "Bày tỏ mong muốn, sở thích",
                structures: [
                    {
                        formula: "N が すき / きらい です。",
                        explanation: "Thích / Ghét cái gì đó."
                    },
                    {
                        formula: "N が ほしい です。",
                        explanation: "Muốn có (đồ vật). Phủ định: ほしくないです."
                    },
                    {
                        formula: "なにも ほしくないです。",
                        explanation: "Cái gì cũng KHÔNG muốn."
                    },
                    {
                        formula: "N を/が + V(bỏ ます) + たいです / たくないです。",
                        explanation: "Muốn làm / Không muốn làm hành động gì đó."
                    }
                ],
                examples: [
                    { jp: "わたしはにほんごがすきです。", vi: "Tôi thích tiếng Nhật." },
                    { jp: "あたらしいかばんがほしいです。", vi: "Tôi muốn có cái cặp mới." },
                    { jp: "にほんへいきたいです。", vi: "Tôi muốn đi Nhật Bản." }
                ],
                notes: [
                    "⚠️ Phủ định của ほしい là ほしくないです (KHÔNG phải ほしいくない).",
                    "💡 Mẹo thi: Trong mẫu Vたい, trợ từ を có thể thay bằng が. Hay gặp trong bài thi trắc nghiệm!"
                ]
            },
            {
                title: "Câu hỏi lý do & Đại từ nghi vấn",
                structures: [
                    {
                        formula: "どうして ～ Vましたか。 → Trả lời: [Lý do] から。",
                        explanation: "Hỏi \"Tại sao?\""
                    },
                    {
                        formula: "だれと ～ Vますか。",
                        explanation: "Hỏi \"Làm gì với ai?\""
                    }
                ],
                examples: [
                    { jp: "どうしてにほんごをべんきょうしましたか。", vi: "Tại sao bạn học tiếng Nhật?" },
                    { jp: "にほんのぶんかがすきですから。", vi: "Vì tôi thích văn hóa Nhật Bản." }
                ],
                tables: [
                    {
                        caption: "Câu hỏi Yes/No với đại từ nghi vấn",
                        headers: ["Hỏi", "Trả lời (Có)", "Trả lời (Không)"],
                        rows: [
                            ["どこか(へ) Vますか。", "はい、～Vます。", "いいえ、どこも(へも) Vません。"],
                            ["なにか(を) Vますか。", "はい、～Vます。", "いいえ、なにも Vません。"]
                        ]
                    }
                ],
                notes: []
            },
            {
                title: "Mục đích của sự di chuyển",
                structures: [
                    {
                        formula: "[Địa điểm] へ + V(bỏ ます) / N(nhóm 3) + に + 行きます / 来ます / 帰ります。",
                        explanation: "Đi đến đâu đó để làm gì."
                    }
                ],
                examples: [
                    { jp: "レストランへ たべに いきます。", vi: "Đi đến nhà hàng để ăn." },
                    { jp: "としょかんへ べんきょうしに いきます。", vi: "Đi đến thư viện để học." }
                ],
                notes: []
            },
            {
                title: "Nối hành động theo trình tự thời gian",
                structures: [
                    {
                        formula: "S は ～ V1ます。それから、V2ます。",
                        explanation: "Làm V1. Sau đó, làm V2."
                    }
                ],
                examples: [
                    { jp: "ひるごはんをたべます。それから、コーヒーをのみます。", vi: "Ăn trưa. Sau đó, uống cà phê." }
                ],
                notes: []
            }
        ]
    },
    // =====================================================================
    // UNIT 6: So sánh, Lời mời và Sự kiện
    // =====================================================================
    {
        unit: "Unit 6",
        title: "So sánh, Lời mời và Sự kiện",
        icon: "fa-scale-balanced",
        sections: [
            {
                title: "So sánh hơn",
                structures: [
                    {
                        formula: "A は B より Adj です。",
                        explanation: "A thì Adj hơn B."
                    }
                ],
                examples: [
                    { jp: "にほんはベトナムよりさむいです。", vi: "Nhật Bản thì lạnh hơn Việt Nam." }
                ],
                notes: []
            },
            {
                title: "Lựa chọn giữa 2 vật",
                structures: [
                    {
                        formula: "A と B と どちらが Adj ですか。",
                        explanation: "Giữa A và B, cái nào Adj hơn?"
                    },
                    {
                        formula: "A (hoặc B) のほうが Adj です。 / どちらも Adj です。",
                        explanation: "A thì Adj hơn. / Cả hai đều Adj."
                    }
                ],
                examples: [
                    { jp: "にくとさかなとどちらがすきですか。", vi: "Thịt và cá, bạn thích cái nào hơn?" },
                    { jp: "さかなのほうがすきです。", vi: "Tôi thích cá hơn." }
                ],
                notes: []
            },
            {
                title: "So sánh nhất",
                structures: [
                    {
                        formula: "[Phạm vi] で [N] が いちばん + Adj です。",
                        explanation: "Trong phạm vi, N là Adj nhất."
                    }
                ],
                examples: [
                    { jp: "くだもので りんごが いちばん すきです。", vi: "Trong các loại quả, tôi thích táo nhất." },
                    { jp: "にほんでどこがいちばんきれいですか。", vi: "Ở Nhật, nơi nào đẹp nhất?" }
                ],
                tables: [
                    {
                        caption: "Từ để hỏi trong So sánh nhất",
                        headers: ["Hỏi về", "Từ để hỏi", "Ví dụ"],
                        rows: [
                            ["Đồ vật", "なに", "なにがいちばんすきですか。"],
                            ["Địa điểm", "どこ", "どこがいちばんきれいですか。"],
                            ["Người", "だれ", "だれがいちばんじょうずですか。"],
                            ["Thời gian", "いつ / なんがつ", "なんがつがいちばんさむいですか。"]
                        ]
                    }
                ],
                notes: []
            },
            {
                title: "Rủ rê, mời mọc",
                structures: [
                    {
                        formula: "(いっしょに) ～ Vませんか。",
                        explanation: "Cùng làm ～ không? (Lời mời lịch sự)"
                    }
                ],
                examples: [
                    { jp: "いっしょに えいがを みませんか。", vi: "Cùng xem phim không?" },
                    { jp: "いいですね。みましょう。", vi: "Hay đấy. Cùng xem nhé." }
                ],
                tables: [
                    {
                        caption: "Cách đáp lại lời mời",
                        headers: ["Phản hồi", "Cấu trúc"],
                        rows: [
                            ["Đồng ý", "いいですね。～ Vましょう。"],
                            ["Từ chối khéo", "すみません。ちょっと。。。[Lý do] から。"]
                        ]
                    }
                ],
                notes: [
                    "💡 どうですか cũng dùng để đưa ra đề xuất, ý kiến cho người khác (ngoài nghĩa hỏi \"như thế nào?\")."
                ]
            },
            {
                title: "Diễn đạt trạng thái hành động",
                structures: [
                    {
                        formula: "[Địa điểm] で [Sự kiện] が あります。",
                        explanation: "Sự kiện diễn ra ở đâu đó."
                    },
                    {
                        formula: "もう ～ Vましたか。",
                        explanation: "Đã ～ chưa? (Hỏi đã hoàn thành hành động chưa)"
                    }
                ],
                examples: [
                    { jp: "としょかんで コンサートが あります。", vi: "Có buổi hòa nhạc ở thư viện." },
                    { jp: "もう ひるごはんを たべましたか。", vi: "Bạn đã ăn trưa chưa?" }
                ],
                tables: [
                    {
                        caption: "Trả lời câu hỏi \"もう...ましたか\"",
                        headers: ["Trả lời", "Cấu trúc"],
                        rows: [
                            ["Rồi", "はい、もう ～ Vました。"],
                            ["Vẫn chưa", "いいえ、まだです。"]
                        ]
                    }
                ],
                notes: [
                    "⚠️ Phân biệt: Đồ vật tồn tại dùng に あります, sự kiện diễn ra dùng で あります."
                ]
            }
        ]
    },
    // =====================================================================
    // UNIT 7: Sự tồn tại, Thể て (Te) và Cầu khiến
    // =====================================================================
    {
        unit: "Unit 7",
        title: "Sự tồn tại, Thể て (Te) và Cầu khiến",
        icon: "fa-spell-check",
        sections: [
            {
                title: "Chỉ sự tồn tại (Người vs Vật)",
                structures: [
                    {
                        formula: "[Địa điểm] に [N] が あります。",
                        explanation: "Sự vật (vô tri vô giác) tồn tại ở đâu. Hỏi: 何が ありますか。"
                    },
                    {
                        formula: "[Địa điểm] に [N] が います。",
                        explanation: "Người / Động vật (hữu sinh) tồn tại ở đâu. Hỏi: 何が / だれが いますか。"
                    },
                    {
                        formula: "[N] は [Địa điểm] に あります / います。",
                        explanation: "Xác định vị trí: N thì ở (địa điểm)."
                    }
                ],
                examples: [
                    { jp: "つくえのうえにほんがあります。", vi: "Trên bàn có quyển sách." },
                    { jp: "にわにねこがいます。", vi: "Trong vườn có con mèo." }
                ],
                notes: []
            },
            {
                title: "Các mẫu câu hành động & Giao tiếp",
                structures: [
                    {
                        formula: "[Địa điểm] へ [N] をもって 行きます / 来ます。",
                        explanation: "Mang đi / Mang đến."
                    },
                    {
                        formula: "[Nơi chốn] に [N] を いれます / [Nơi chốn] から [N] を だします。",
                        explanation: "Cho vào / Lấy ra."
                    },
                    {
                        formula: "[Dụng cụ] で ～ Vます。",
                        explanation: "Làm bằng công cụ gì. Hỏi: なにで。"
                    },
                    {
                        formula: "～ Vましょうか。",
                        explanation: "Đề nghị giúp đỡ (Để tôi làm ~ nhé?)"
                    },
                    {
                        formula: "[N] が わかります / わかりません。",
                        explanation: "Hiểu / Không hiểu."
                    },
                    {
                        formula: "V(bỏ ます) + かた",
                        explanation: "Cách làm gì đó. VD: 書きかた (cách viết)"
                    }
                ],
                examples: [
                    { jp: "がっこうへ おべんとうを もって いきます。", vi: "Mang cơm hộp đến trường." },
                    { jp: "はしで たべます。", vi: "Ăn bằng đũa." },
                    { jp: "にもつを もちましょうか。", vi: "Để tôi mang hành lý cho nhé?" }
                ],
                tables: [
                    {
                        caption: "Cách đáp lại lời đề nghị giúp đỡ",
                        headers: ["Phản hồi", "Cấu trúc"],
                        rows: [
                            ["Chấp nhận", "ありがとうございます。"],
                            ["Từ chối", "いいえ、だいじょうぶです。"]
                        ]
                    }
                ],
                notes: [
                    "💡 Gọi điện thoại: [Người/Địa điểm] に 電話をかけます。Trợ từ に chỉ đối tượng nhận cuộc gọi."
                ]
            },
            {
                title: "Động từ Thể て (Te-form)",
                structures: [
                    {
                        formula: "Nhóm 1: Chia theo đuôi ます (xem bảng bên dưới)",
                        explanation: "Động từ nhóm 1 có nhiều quy tắc chia thể て."
                    },
                    {
                        formula: "Nhóm 2 và 3: V(bỏ ます) → て",
                        explanation: "Chỉ cần bỏ ます rồi thêm て."
                    }
                ],
                examples: [],
                tables: [
                    {
                        caption: "Quy tắc chia Thể て — Nhóm 1",
                        headers: ["Đuôi trước ます", "Chuyển thành", "Ví dụ"],
                        rows: [
                            ["い、ち、り", "って", "買います → 買って"],
                            ["に、み、び", "んで", "飲みます → 飲んで"],
                            ["き", "いて", "聞きます → 聞いて"],
                            ["ぎ", "いで", "泳ぎます → 泳いで"],
                            ["し", "して", "話します → 話して"]
                        ]
                    }
                ],
                notes: [
                    "⚠️ Ngoại lệ quan trọng: 行きます → 行って (KHÔNG phải 行いて). Đây là ngoại lệ duy nhất của nhóm き!",
                    "💡 Nhóm 2: たべます→たべて, みます→みて. Nhóm 3: きます→きて, します→して."
                ]
            },
            {
                title: "Cấu trúc đi cùng Thể て",
                structures: [
                    {
                        formula: "～ Vています / Vていません。",
                        explanation: "Đang làm gì (Hiện tại tiếp diễn)."
                    },
                    {
                        formula: "～ Vてください。",
                        explanation: "Hãy / Xin hãy làm gì (Mệnh lệnh / Yêu cầu lịch sự)."
                    }
                ],
                examples: [
                    { jp: "いま べんきょうしています。", vi: "Bây giờ đang học." },
                    { jp: "ここにすわってください。", vi: "Xin hãy ngồi ở đây." }
                ],
                notes: []
            },
            {
                title: "Tổng hợp Trợ từ quan trọng đi với Động từ",
                structures: [],
                examples: [],
                tables: [
                    {
                        caption: "Bảng trợ từ đi kèm động từ",
                        headers: ["Trợ từ", "Các động từ đi kèm"],
                        rows: [
                            ["～に", "会います (gặp), のぼります (leo), はいります (vào), あります/います (tồn tại), 電話をかけます (gọi điện cho ai)"],
                            ["～へ", "行きます (đi), 来ます (đến), 帰ります (về)"],
                            ["～が", "あります/います (có), わかります (hiểu), すき/きらい (thích/ghét), ほしい (muốn có)"],
                            ["～を", "Các động từ tác động trực tiếp (ăn, uống, xem, viết...)"]
                        ]
                    }
                ],
                notes: [
                    "💡 Bảng trợ từ này rất quan trọng cho bài thi! Nên thuộc lòng để chọn đúng trợ từ trong trắc nghiệm."
                ]
            }
        ]
    }
];
