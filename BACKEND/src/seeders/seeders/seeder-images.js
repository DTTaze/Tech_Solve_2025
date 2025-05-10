"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("images", [
      {
        reference_id:1,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746897437/images/binh-nuoc-inox-sport-xanh_ttsias.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:2,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746897546/images/ong-hut-tre-jungle-straws-bamboo-xs-05_y2kbw1.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:3,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746898775/images/tui-vai-trust-and-love_ozq5vx.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:4,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746898827/images/3a80f0a2-8a28-4fb4-a0e1-278534f467ef_dpek76.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:5,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746898896/images/b%C3%A1_c-%C3%A1%C2%BA_nh-hi%C3%A1__n-th%C3%A1__-x%C3%83_-ph%C3%83_ng-t%C3%A1_-nhi%C3%83%C2%AAn-v%C3%83_-h%C3%A1%C2%BA_t-mu%C3%A1__i-t%C3%A1%C2%BA_m-tr%C3%83%C2%AAn-b%C3%A1__-m%C3%A1%C2%BA_t-g%C3%A1__._asoq1e.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:6,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746898961/images/20231227_kdaj9PlpqF_u5jdtb.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:7,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746899044/images/papaya-reusable-paper-towels-1c593b2088384796a1559230c982af26_vbtd7x.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:8,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746899117/images/Set-Vai-Sap-Ong-Boc-Thuc-Pham-Nhieu-Size-Limart-1-scaled_ozevpy.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:1,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("images", null, {});
  },
};
