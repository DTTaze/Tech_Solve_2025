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
        reference_id:9,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901042/images/g-987250ab-0920-4498-b791-1108ec053f53_tzjsmc.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:10,
        reference_type: "item",
        url:"",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:11,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901250/images/960px-Tire_Sandals_vme1sp.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:12,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901329/images/Tha%CC%80nhpha%CC%82%CC%80ntu%CC%9B%CC%A3nhie%CC%82nla%CC%80nhti%CC%81nh-845x500_dz0tol.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:13,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901451/images/130001-mua-tinh-dau-cam-ngot-nguyen-chat-o-dau-uy-tin-chat-luong-tai-tp-ho-chi-minh-sweet-orange-essential-oil_lbcf8k.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:14,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901511/images/71zpVVph3mL_mzbw1o.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reference_id:15,
        reference_type: "item",
        url:"https://res.cloudinary.com/dygavzq8m/image/upload/v1746901561/images/cach-lam-sap-dau-nanh_c90bda45135b4d929c0760dbd53b7ac9_grande_aelnlt.webp",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("images", null, {});
  },
};
