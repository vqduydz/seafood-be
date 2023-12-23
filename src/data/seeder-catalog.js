module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkInsert('catalogs', [
        {
          image: 'https://chefdzung.com.vn/uploads/images/bai-viet/img-7134.jpg',
          name: 'Món đặc biệt',
          slug: 'mon-dac-biet',
        },
        {
          image: 'https://images2.thanhnien.vn/Uploaded/2014/Pictures201211/MinhNguyet/Thang11/haisan2.jpg',
          name: 'Các món mới',
          slug: 'cac-mon-moi',
        },
        {
          image: 'https://bucket.nhanh.vn/033a84-66619/album/albumCT/20200309_7ecutTT43nDaW56PNTdh8AQd.jpg',
          name: 'Các món Khai Vị',
          slug: 'cac-mon-khai-vi',
        },
        {
          image:
            'https://cdn.tgdd.vn/Files/2022/04/04/1423782/goi-y-8-mon-nguoi-khai-vi-cho-nhung-buoi-tiec-hoi-hop-voi-gia-dinh-202204040912057499.jpg',
          name: 'Các món gỏi',
          slug: 'cac-mon-goi',
        },
        {
          image: 'https://cdn.daynauan.info.vn/wp-content/uploads/2020/08/sup-tom.jpg',
          name: 'Các món súp',
          slug: 'cac-mon-sup',
        },
        {
          image: 'https://www.hoidaubepaau.com/wp-content/uploads/2019/06/cach-nau-chao-hai-san.jpg',
          name: 'Các món cháo',
          slug: 'cac-mon-chao',
        },
        {
          image: 'https://nauantainha.com/wp-content/uploads/cooked/images/recipes/recipe_1501.jpg',
          name: 'Cơm chiên',
          slug: 'com-chien',
        },
        {
          image: 'https://cdn.beptruong.edu.vn/wp-content/uploads/2013/08/mon-mi-xao-hai-san.jpg',
          name: 'Mì-miến xào',
          slug: 'mi-mien-xao',
        },
        {
          image:
            'https://www.unileverfoodsolutions.com.vn/dam/global-ufs/mcos/phvn/vietnam/calcmenu/recipes/VN-recipes/fish-&-other-seafood-dishes/seafood-hotpot/main-header.jpg',
          name: 'Các món lẩu',
          slug: 'cac-mon-lau',
        },
        {
          image: 'https://cdn.jamja.vn/blog/wp-content/uploads/2018/01/mon-ngon-tu-tom-su.jpg',
          name: 'Tôm sú',
          slug: 'tom-su',
        },
        {
          image:
            'http://cdn.tgdd.vn/Files/2020/02/28/1239091/cac-cach-hap-tom-hum-cuc-ky-ngon-ma-don-gian-tai-nha-202112310954112612.jpg',
          name: 'Tôm hùm',
          slug: 'tom-hum',
        },
        {
          image:
            'https://cdn.tgdd.vn/Products/Images/8782/234548/bhx/muc-la-dai-duong-lam-sach-tui-500g-202101231424451462.jpg',
          name: 'Mực lá',
          slug: 'muc-la',
        },
        {
          image: 'https://cdn.tgdd.vn/Products/Images/8782/245067/bhx/muc-ong-tui-300g-202110011419217330.jpg',
          name: 'Mực ống',
          slug: 'muc-ong',
        },
        {
          image: 'https://vuacamuc.com/wp-content/uploads/2018/07/muc-sua-nuong-muoi-ot.jpg',
          name: 'Mực sữa',
          slug: 'muc-sua',
        },
        {
          image: 'https://haisananhlan.com/wp-content/uploads/2020/08/muc-1-nang-1.jpg',
          name: 'Mực 1 nắng',
          slug: 'muc-1-nang',
        },
        {
          image:
            'https://file.hstatic.net/1000030244/file/ngheu-trang-song_fdd02e9a9ee24de286891db382bc5f85_grande.jpg',
          name: 'Các món nghêu',
          slug: 'cac-mon-ngheu',
        },
        {
          image: 'https://vinmec-prod.s3.amazonaws.com/images/20210405_191958_048329_an-so-huyet.max-1800x1800.jpg',
          name: 'Sò huyết',
          slug: 'so-huyet',
        },
        {
          image: 'https://crabseafood.vn/wp-content/uploads/2021/04/48-17-510x510.png',
          name: 'Sò lông',
          slug: 'so-long',
        },
        {
          image:
            'https://www.noichienkhongdau.com/wp-content/uploads/2022/03/so-diep-nuong-bang-noi-chien-khong-dau-3.jpg',
          name: 'Sò điệp',
          slug: 'so-diep',
        },
        {
          image: 'https://kenh14cdn.com/2018/2/11/a4-1518337830498294304068.jpg',
          name: 'Sò mai',
          slug: 'so-mai',
        },
        {
          image:
            'https://product.hstatic.net/200000419887/product/oc_huong_6c6258fca4ca407bbd47db749105d9ee_master.png',
          name: 'Ốc hương',
          slug: 'oc-huong',
        },
        {
          image: 'http://monngondongian.com/wp-content/uploads/2022/11/oc-mong-tay-xao-me.jpg',
          name: 'Ốc móng tay',
          slug: 'oc-mong-tay',
        },
        {
          image: 'https://cdn.daynauan.info.vn/wp-content/uploads/2018/07/oc-mo-xao-toi.jpg',
          name: 'Ốc mỡ',
          slug: 'oc-mo',
        },
        {
          image: 'https://cdn.tgdd.vn/2020/08/CookProduct/Untitled-1-1200x676-27.jpg',
          name: 'Các món cua',
          slug: 'cac-mon-cua',
        },
        {
          image: 'https://bepxua.vn/wp-content/uploads/2021/03/ghe.jpg',
          name: 'Các món ghẹ',
          slug: 'cac-mon-ghe',
        },
        {
          image:
            'https://vinmec-prod.s3.amazonaws.com/images/20210305_040333_519982_hau-la-thuc-pham-gi.max-1800x1800.jpg',
          name: 'Các món hàu',
          slug: 'cac-mon-hau',
        },
        {
          image: 'https://newfreshfoods.com.vn/datafiles/3/2020-12-16/thumb_16389531198792_23.jpg',
          name: 'Cá sapa',
          slug: 'ca-sapa',
        },
        {
          image:
            'https://thebazan.vn/wp-content/uploads/2020/05/c%C3%A1ch-l%C3%A0m-rau-c%C3%A2u-c%C3%A0-ph%C3%AA-s%E1%BB%AFa.jpg',
          name: 'Món tráng miệng',
          slug: 'mon-trang-mieng',
        },
        {
          image: 'http://www.vppthegia.com/thumbs/540x540x2/upload/product/nuoc-ngot-dong-lon-3058.jpg',
          name: 'Nước ngọt',
          slug: 'nuoc-ngọt',
        },
        {
          image: 'https://vinabeco.com.vn/wp-content/uploads/2019/07/1.png',
          name: 'Bia',
          slug: 'bia',
        },
        {
          image: 'https://www.hoteljob.vn/uploads/images/2021/02/18-09/vodka-la-gi-01.jpg',
          name: 'Rượu',
          slug: 'ruou',
        },
      ]);
    } catch (error) {
      console.error('Error in Seeder "up":', error.name, error.message, error.parent);

      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      console.log('Success in Seeder "down"');
      return await queryInterface.bulkDelete('catalogs', null, {});
    } catch (error) {
      console.error('Error in Seeder "down":', error);
      throw error;
    }
  },
};
