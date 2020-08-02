module.exports = [
  {
    tag: "discount",
    patterns: [
      "Bạn có mã giảm giá nào không?",
      "Trang mình giảm giá các khoá học bao nhiêu tối đa bao nhiêu phần trăm %?",
      "Có khoá học nào miễn phí không?",
      "Những khoá học nào đang được giảm giá trên trang vậy?",
      "Tôi cần các khoá học miễn phí",
      "các khoá học miễn phí",
      "các khoá học giá thấp",
    ],
    responses: [
      "Tất nhiên, Hacademy có mã giảm giá cho đa dạng các khoá học!",
      "Hacademy sẽ giảm giá các khoá học lên đến 100% vào một số dịp đặc biệt!",
      "Hiện tại đang có một số khoá học miễn phí trên trang!",
      "Hiện tại đang có một số các mã giảm giá cho các khoá học ở trên trang!",
    ],
  },

  {
    tag: "course",
    patterns: [
      "Hacademy hiện tại đang có những khoá học nào vậy?",
      "Tôi cần một số khoá học có trên trang",
      "Tôi muốn một khoá học",
      "Đề xuất cho tôi một vài khoá học trên trang được không?",
      "Có bao nhiêu khoá học trên Hacademy vậy?",
      "khoá học",
      "khoá học tiếng Anh",
      "khoá học nhạc",
      "khoá học javascript",
    ],
    responses: [
      "Hacademy cung cấp đa dạng về các môn học mà bạn có thể tìm trên trang!",
      "Hiện tại Hacademy có các khoá học của gần 10 môn học trên trang!",
      "Hacademy hiện tại có hơn 100 khoá học đáng để bạn tham khảo và đăng ký học!",
    ],
  },

  {
    tag: "payment",
    patterns: [
      "Làm sao tôi có thể thanh toán cho một khoá học?",
      "Làm sao để tôi mua được khoá học?",
      "thanh toán trưc tuyến",
      "Trang hỗ trợ các loại thẻ nào để thanh toán?",
      "Tôi có thẻ VISA",
      "Tôi có thể trả tiền bằng thẻ VISA được không?",
      "Tôi có thẻ Master",
      "Tôi có thể  thanh toán bằng thẻ Master được không?",
      "Tôi có thẻ Discover",
      "Tôi có thể  thanh toán bằng thẻ Discover được không?",
      "Tôi có thẻ Discover American Express",
      "Tôi có thể trả tiền bằng thẻ American Express được không?",
      "trả tiền với Paypal",
      "Tôi có PayPal",
      "Tôi thanh toán với PayPal được không?",
    ],
    responses: [
      "Hacademy hỗ trợ thanh toán qua nhiều loại thẻ (VISA / MASTER / DISCOVER / AMERICAN EXPRESS)!",
      "Hacademy tích hợp thanh toán trực tuyến cho các thẻ VISA / MASTER / DISCOVER / AMERICAN EXPRESS!",
      "Hacademy chưa hỗ tợ thanh toán Paypal, hãy thanh toán với VISA / MASTER / DISCOVER / AMERICAN EXPRESS!",
    ],
  },

  {
    tag: "subject",
    patterns: [
      "Hacademy có những môn học nào vậy?",
      "môn học",
      "Có tổng cộng bao nhiêu môn học trên Hacademy?",
      "Có môn học design nào ở trên trang không?",
      "Có khoảng bao nhiêu khoá học trong một môn học?",
    ],
    responses: [
      "Hacademy có gần 10 môn học bao phủ các cấp độ của người học!",
      "Hiện tại có gần 10 môn học và hơn 100 khoá học trên trang Hacademy!",
      "Có các môn học như Toán, Lý, Hoá, Âm Nhạc, Tiếng Anh,...",
    ],
  },

  {
    tag: "lecturer",
    patterns: [
      "Làm thế nào để trở thành giảng viên trên Hacademy?",
      "Làm thế nào để đăng tải khoá học lên Hacademy?",
      "Tôi có thể làm giảng viên trên Hacademy không?",
      "Tôi có thể giảng dạy các khoá học của tôi trên Hacademy không?",
      "Tôi muốn làm người dạy học trên Hacademy",
      "làm giảng viên trên Hacademy",
      "Làm thế nào để có tài khoản giảng viên?",
      "Làm thế nào để đăng nhập là một người dạy học?",
      "Hacademy tuyển dụng giảng viên như thế nào vậy?",
    ],
    responses: [
      "1. Bạn có thể tạo tài khoản ở đường dẫn: https://cafocc.web.app/auth/register \n\n\
        2. Ngay sau khi bạn đăng ký tài khoản, đội ngủ kiểm duyệt của Hacademy sẽ kiểm tra và quyết định xem bạn có đủ tiêu chuẩn để trở thành giảng viên và đăng bài hay không!\n\n\
        3. Hiện tại đang có Quy Định về Đối Tác, bạn có thể tham khảo trên Hacademy!",
    ],
  },

  {
    tag: "hacademy",
    patterns: [
      "Hacademy là gì??",
      "Trang web này để làm gì?",
      "Định nghĩa của Hacademy",
      "Tại sao lại là Hacademy?",
      "giải thích từ Hacademy",
      "1 chút về Hacademy",
    ],
    responses: [
      "Hacademy là một trang web cung cấp các khoá học trực tuyến và hiện tại đang có 10 môn học với hơn 100 khoá học trên trang! \nhttps://cafocc.web.app",
      "Hacademt giúp bạn có thể học ngay tại nhà! Nội dung của một khoá học bao  \nhttps://cafocc.web.app",
      "Hacademy không chỉ dành cho người học, bạn có thể đăng ký để trở thành giảng viên và từ đó đăng tải các khoá học của ban trên trang! \nhttps://cafocc.web.app",
    ],
  },

  {
    tag: "contact",
    patterns: [
      "Làm sao để liên lạc?",
      "liên hệ với ai khi tôi gặp khó khăn trong lúc sử dụng trang web",
      "tôi đang gặp một số vấn đề khi sử dụng website",
      "mục liên hệ ở đâu?",
      "liên hệ Hacademy",
    ],
    responses: [
      "Nếu bạn muốn liên hệ tới Hacademy, bạn có thể truy cập ở đây: \nhttps://cafocc.web.app/contact",
      "Thông tin liên hệ của Hacademy được đặt trên trang Contact, bạn có thể truy cập ở đây: \nhttps://cafocc.web.app/contact",
      "Bạn có thể liên hệ qua email (dhtc.kltn@gmail.com) hoặc truy cập ở đây! \nhttps://cafocc.web.app/contact",
    ],
  },

  {
    tag: "comment",
    patterns: [
      "Làm thế nào để tôi bình luận?",
      "Làm thế nào để tôi đặt câu hỏi khi học bài giảng?",
      "đặt câu hỏi trong quá trình học",
      "bình luận ở một bài giảng",
    ],
    responses: [
      "Bạn có thể đặt câu hỏi ở mỗi bài giảng trên khu vực bình luận và bạn cũng sẽ thấy những người đang học khoá học đó với bạn!",
      "Mỗi bài giảng trên Hacademy đều có một khu vực bình luận dành cho các người học có thể đặt câu hỏi để được giải đáp các khó khăn đang gặp phải!",
      "Nếu bạn đang gặp khó khăn nào đó trong quá trình học, bạn có thể bình luận để mọi người trong cộng đồng có thể giúp bạn nhé!",
    ],
  },

  {
    tag: "lesson",
    patterns: [
      "Một khoá học thường có bao nhiêu bài giảng?",
      "Một bài giảng bao gồm những gì?",
      "những thứ có trong một bài giảng?",
    ],
    responses: [
      "Mỗi bài giảng bao gồm phần mô tả bài giảng, video của bài giảng, các tập tin đính kèm liên  và khu vực bình luận cho cộng đồng người học!",
      "Số lượng các bài giảng trong một khoá học không nhất định, các giảng viên sẽ cấu trúc khoá học một cách tối ưu để phù hợp với lộ trình học của bạn!",
    ],
  },

  {
    tag: "feedback",
    patterns: [
      "phản hồi đánh giá",
      "Làm thế nào để gửi phản hồi đánh giá về 1 khoá học?",
      "khu vực phản hồi đánh giá ở đâu?",
      "tôi muốn gửi phản hồi đánh giá về khoá học này",
      "tôi có thể xem các phản hồi đánh giá ở đâu?",
    ],
    responses: [
      "Bạn có thể gửi phản hồi đánh giá sau khi học xong một khoá học!",
      "Mỗi khoá học bạn học sẽ hiển thị mục phản hồi đánh giá trong quá trình học!",
      "Tất cả các phản hồi đánh giá của những người học trược được hiển thị hết ở trang chi tiết khoá học, bạn có thể xem qua và đưa ra quyết định đúng đắn!",
    ],
  },

  {
    tag: "register",
    patterns: [
      "Làm thế nào để đăng ký tài khoản?",
      "Tôi đăng nhập bằng facebook được không?",
      "Tôi đăng nhập bằng google được không?",
      "Tôi cần một tài khoản?",
      "tạo một tài khoản trên Hacademy",
      "tạo một tài khoản người học trên Hacademy",
      "tạo tài khoản",
      "đăng ký",
      "tôi muốn đăng ký",
      "tạo người dùng",
    ],
    responses: [
      "• Rất đơn giản, bạn có thể vào Hacademy và nhấn vào nút Register để đăng ký (https://cafocc.web.app/auth/register)! Bạn có thể dùng tài khoản Facebook / Google để đăng nhập vào hệ thống! \n• Việc đăng ký yêu cầu bạn phải có một email đang tồn tại và một mật khẩu của riêng bạn!",
    ],
  },

  {
    tag: "login",
    patterns: [
      "Làm sao để tôi có thể đăng nhập?",
      "Làm sao để đăng nhập?",
      "học viên đăng nhập?",
      "Làm cách nào để đăng nhập?",
      "đăng nhập",
      "đăng nhập",
      "kết nối với facebook",
      "Làm cách nào để tôi có thể kết nối với facebook / google?",
    ],
    responses: [
      "• Truy cập vào trăng đăng nhập: https://cafocc.web.app/auth/login \n• Nếu bạn chưa có tài khoản, truy cập vào trang đăng ký: https://cafocc.web.app/auth/register to sign up.",
    ],
  },

  {
    tag: "forgot_password",
    patterns: [
      "tôi quên mật khẩu rồi",
      "Làm sao để tôi lấy lại mật khẩu đây?",
      "không nhớ mật khẩu",
      "tôi không nhớ mật khẩu của mình",
      "lấy lại mật khẩu",
      "tôi cần lấy mật khẩu lại!",
    ],
    responses: [
      "Truy cập vào trang quên mật khẩu: https://cafocc.web.app/auth/forgot-password sau đó điền vào email, hệ thống Hacademy sẽ gửi đến email của bạn một trang để thay đổi mật khẩu!",
    ],
  },
  {
    tag: "verification",
    patterns: [
      "tôi chưa nhận được email xác nhận",
      "làm thế nào để xác nhận tài kh tài khoản?",
      "xác thực tài khoản",
      "gửi lại email xác thực",
      "tài khoản đã được xác thực",
    ],
    responses: [
      "• Sau khi hoàn tất đăng ký, bạn sẽ phải xác thực tài khoản của mình qua email mà bạn dùng để đăng ký! \n\n• Hacademy sẽ gửi bạn 1 email xác thực, nếu bạn không thất nó ở trong mục chính thì nhớ kiểm tra mục spam nhé! \n\n• Sau đó, nhấn vào đường link trong mail và Hacademy sẽ chuyển hướng bạn tới trang thay đổi mật khẩu!",
    ],
  },
  {
    tag: "report",
    patterns: [
      "Làm thế nào để tôi báo cáo một khoá học?",
      "làm đơn báo cáo",
      "đệ đơn báo cáo khoá học",
      "làm thế nào để báo cáo?",
      "tôi cần báo cáo khoá học này!",
      "các báo cáo sẽ nằm ở chỗ nào?",
    ],
    responses: [
      "Bạn có thể gởi báo cáo thông qua quá trình phản hồi và đánh giá! Đội ngũ chuyên gia của Hacademy sẽ kiểm tra và đưa ra những giải pháp hợp lý nhất có thể!",
      "Để báo cáo khoá học, bạn phải chấp thuận khi có pop-up của phẩn hồi đánh giá! Sau đó, đội ngũ chuyên gia của Hacademy sẽ kiểm tra và đưa ra những giải pháp cụ thể và phù hợp!",
    ],
  },
  {
    tag: "popular_course",
    patterns: [
      "popular courses",
      "Có thể gợi ý cho tôi một số khoá học nổi tiếng ở trên trang không?",
      "Tôi cần một số các khoá học thường xuyên được mua ở trên trang",
      "các khoá học thường xuyên được học",
      "Có thể cho tôi các khoá học được đánh đánh giá cao được không?",
      "tôi cần các khoá học có đánh giá của người dùng cao nhất",
      "Những khoá học nào mà người dùng thường xuyên chọn trên trang vậy?",
      "gợi ý cho tôi những khoá học được đánh giá cao trên trang?",
    ],
    responses: [],
  },
  {
    tag: "latest_course",
    patterns: [
      "những khoá học mới nhất",
      "Có thể cho tôi những khoá học được đăng tải gần đây được không?",
      "tôi cần một số khoá học mới nhất trên trang",
      "gợi ý cho tôi một số khoá học mới nhất trên Hacademy",
    ],
    responses: [],
  },
  {
    tag: "check_cart",
    patterns: [
      "tôi muốn kiểm tra giỏ hàng",
      "Có những khoá học nào đang trong giỏ hàng của tôi vậy?",
      "Có bao nhiêu khoá học trong giỏ hàng của tôi vậy?",
      "Tổng cộng giá tiền trong giỏ hàng hiện tại của tôi là bao nhiêu?",
      "tôi muốn kiểm tra số lượng khoá học đang có trong giỏ hàng của tôi",
      "chi tiết giỏ hàng của tôi",
      "các khoá học trong giỏ hàng",
      "kiểm tra giỏ hàng",
    ],
    responses: [],
  },
  {
    tag: "add_coupon",
    patterns: [
      "làm sao tôi có thể áp dụng mã giảm giá?",
      "làm sao tôi có thể thêm mã giảm giá vào khoá học?",
      "giảm giá khoá học",
      "mã giảm giá",
      "phiếu giảm giá",
      "mã hạ giá",
      "khoá học hạ giá",
    ],
    responses: [],
  },
  {
    tag: "payment",
    patterns: [
      "Tôi có thể thanh toán bằng thẻ VISA/MASTER/DISCOVER không?",
      "thanh toán trực tuyến",
      "làm cách nào để tôi trả tiền cho khoá học?",
      "thanh toán",
    ],
    responses: [],
  },
  {
    tag: "update_profile",
    patterns: [
      "Tôi muốn đổi mật khẩu",
      "Tôi muốn đổi tên hiển thị của mình",
      "tôi muốn đổi tên của mình (first name)",
      "tôi muốn đổi tên họ của mình (last name)",
      "thay đổi profile",
      "cập nhật thông tin cá nhân",
    ],
    responses: [],
  },
  {
    tag: "schedule",
    patterns: [
      "tôi muôn có thông báo về khoá học của tôi vào lúc 3 giờ chiều thứ hai hằng tuần",
      "nhắc nhở tôi mỗi ngày vào lúc 8:30 tối",
      "bật chế độ nhắc nhở của tôi",
      "công cụ nhắc nhở hẹn giờ",
      "thông báo",
      "thông báo cho tôi",
      "tôi muốn cài đặt một đồng hồ hẹn giờ vào mỗi 7 giờ tối thứ tư và thứ năm hàng tuần",
      "khởi động bộ đếm giờ vào mỗi thứ sáu hàng tuần lúc bảy giờ tối",
    ],
    responses: [],
  },
  {
    tag: "survey",
    patterns: [
      "tôi muốn thực hiện cuộc khảo sát",
      "khảo sát",
      "làm thế nào để thực hiện khảo sát?",
      "tôi muốn đánh giá Chatbot",
    ],
    responses: [],
  },
  {
    tag: "help",
    patterns: [
      "trợ giúp",
      "tôi cần sự trợ giúp",
      "làm sao để sử dụng được Chatbotg?",
      "luồng hoạt động của chatbot",
      "làm thế nào để nhắn tin với bot?",
      "trợ giúp cho tôi với",
      "tôi cần những hướng dẫn sử dụng cho Chatbot",
      "hướng dẫn cho tôi",
    ],
    responses: [],
  },
];
