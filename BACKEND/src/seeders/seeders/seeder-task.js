"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tasks", [
      {
        id: 1,
        title: "Nhặt rác tại công viên",
        description: "Thu gom và phân loại rác thải trong khu vực công viên.",
        coins: 15,
        difficulty: "easy",
        total: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        title: "Trồng cây xanh",
        description: "Trồng ít nhất một cây xanh trong khu vực được chỉ định.",
        coins: 25,
        difficulty: "medium",
        total: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        title: "Tiết kiệm điện",
        description: "Tắt các thiết bị điện khi không sử dụng trong một tuần.",
        coins: 10,
        difficulty: "easy",
        total: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        title: "Tái chế rác thải",
        description:
          "Thu gom ít nhất 5kg rác thải tái chế và đem đến điểm thu gom.",
        coins: 30,
        difficulty: "hard",
        total: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        title: "Hạn chế sử dụng túi ni lông",
        description: "Không sử dụng túi ni lông trong vòng một tuần.",
        coins: 20,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        title: "Task 1",
        description: "Description for Task 1",
        coins: 10,
        difficulty: "easy",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        title: "Task 2",
        description: "Description for Task 2",
        coins: 20,
        difficulty: "medium",
        total: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        title: "Đi xe đạp thay vì xe máy",
        description: "Đi xe đạp ít nhất 3 ngày trong tuần để giảm khí thải.",
        coins: 20,
        difficulty: "medium",
        total: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        title: "Tắt đèn khi ra khỏi phòng",
        description: "Tắt đèn và các thiết bị điện mỗi khi ra khỏi phòng.",
        coins: 10,
        difficulty: "easy",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        title: "Sử dụng bình nước cá nhân",
        description:
          "Mang theo bình nước cá nhân thay vì mua chai nhựa dùng một lần.",
        coins: 15,
        difficulty: "easy",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        title: "Gom pin đã qua sử dụng",
        description: "Thu gom ít nhất 10 viên pin cũ và đem đến điểm thu hồi.",
        coins: 25,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        title: "Tham gia chiến dịch trồng rừng",
        description: "Tham gia ít nhất một buổi trồng rừng tại địa phương.",
        coins: 35,
        difficulty: "hard",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
        title: "Chia sẻ kiến thức môi trường",
        description:
          "Viết bài chia sẻ hoặc đăng video tuyên truyền bảo vệ môi trường.",
        coins: 30,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 14,
        title: "Không dùng ống hút nhựa",
        description: "Không sử dụng ống hút nhựa trong vòng 1 tuần.",
        coins: 15,
        difficulty: "easy",
        total: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 15,
        title: "Tham gia dọn rác bãi biển",
        description: "Tham gia một buổi dọn rác tại bãi biển gần bạn.",
        coins: 40,
        difficulty: "hard",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 16,
        title: "Sử dụng đồ tái chế",
        description: "Mua và sử dụng ít nhất 3 sản phẩm tái chế.",
        coins: 20,
        difficulty: "medium",
        total: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 17,
        title: "Tự làm compost",
        description: "Bắt đầu ủ rác hữu cơ trong hộp compost tại nhà.",
        coins: 30,
        difficulty: "hard",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 18,
        title: "Tắm trong 5 phút",
        description: "Giới hạn thời gian tắm trong 5 phút trong một tuần.",
        coins: 10,
        difficulty: "easy",
        total: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 19,
        title: "Giảm sử dụng giấy",
        description: "Chuyển sang lưu trữ tài liệu số thay vì in ra giấy.",
        coins: 15,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 20,
        title: "Tham gia workshop môi trường",
        description:
          "Tham gia một buổi hội thảo hoặc lớp học liên quan đến môi trường.",
        coins: 25,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 21,
        title: "Tiết kiệm nước khi rửa bát",
        description:
          "Dùng chậu hoặc vòi tiết kiệm nước khi rửa bát trong một tuần.",
        coins: 10,
        difficulty: "easy",
        total: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 22,
        title: "Dọn sạch khu phố",
        description: "Tổ chức hoặc tham gia một buổi tổng vệ sinh khu phố.",
        coins: 30,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 23,
        title: "Tham gia thử thách sống xanh",
        description:
          "Hoàn thành thử thách sống xanh trong một tuần (không nhựa, tiết kiệm nước, v.v.).",
        coins: 40,
        difficulty: "hard",
        total: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 24,
        title: "Sửa chữa đồ dùng thay vì vứt đi",
        description: "Sửa chữa ít nhất một món đồ thay vì mua mới.",
        coins: 20,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 25,
        title: "Ủng hộ tổ chức môi trường",
        description:
          "Quyên góp hoặc hỗ trợ truyền thông cho một tổ chức bảo vệ môi trường.",
        coins: 35,
        difficulty: "medium",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 26,
        title: "Trồng cây tại nhà",
        description: "Trồng ít nhất 3 chậu cây xanh trong khu vực sinh sống.",
        coins: 25,
        difficulty: "easy",
        total: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 27,
        title: "Sử dụng năng lượng tái tạo",
        description:
          "Cài đặt hoặc sử dụng thiết bị dùng năng lượng mặt trời (ví dụ: đèn năng lượng mặt trời).",
        coins: 50,
        difficulty: "hard",
        total: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  },
};
