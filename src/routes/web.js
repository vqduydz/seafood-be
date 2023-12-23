import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import {
  cartItemController,
  catalogController,
  feedbackController,
  menuController,
  orderController,
  userController,
  tableController,
  bookingController,
} from '../controllers';
import { checkRole, verifyToken } from '../middlewares/middleware';

const sql = require('mssql');

const router = express.Router();
const app = express();
const port = 3000;

// Cấu hình , Khai báo middleware upload
const upload = multer({ storage: multer.memoryStorage() });

export const initWebRoutes = (app) => {
  //
  router.get('/', (req, res) => {
    return res.send(`Contact : Duy Vũ - vqduydz@gmail.com`);
  });
  // gettoken
  router.post('/gettoken', userController.getToken);
  // log in
  router.get('/login', verifyToken, userController.handleLogin);
  // forgot password
  router.post('/forgot-password', userController.forgotPassword);
  // reset password
  router.patch('/reset-password/:token', userController.resetPassword);
  // sign up - create user
  router.post('/user', userController.createUser);

  //________user______________________________________
  // get user
  router.get('/user', verifyToken, checkRole(['Root', 'Admin', 'UserManage', 'Customer']), userController.getUser);
  // update user data
  router.patch(
    '/user',
    verifyToken,
    checkRole(['Customer', 'Root', 'Admin', 'UserManage']),
    userController.updateUserById,
  );
  // delete user

  router.delete(
    '/user',
    verifyToken,
    checkRole(['Customer', 'Root', 'Admin', 'UserManage']),
    userController.deleteUserById,
  );
  // import user
  router.post(
    '/user/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    userController.importUsers,
  );

  //________menu______________________________________
  // get menu
  router.get('/menu', menuController.getMenu);
  // create menu
  router.post('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.createMenu);
  // update menu data
  router.patch('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.updateMenuById);
  // delete menu
  router.delete('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.deleteMenuById);
  // import menu
  router.post(
    '/menu/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    menuController.importMenus,
  );

  //________catalog______________________________________
  // get catalog
  router.get('/catalog', catalogController.getCatalog);
  // create catalog
  router.post('/catalog', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), catalogController.createCatalog);
  // update catalog data
  router.patch(
    '/catalog',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    catalogController.updateCatalogById,
  );
  // delete catalog
  router.delete(
    '/catalog',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    catalogController.deleteCatalogById,
  );
  // import catalog
  router.post(
    '/catalog/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    catalogController.importCatalogs,
  );

  //_______feedback_______________________________________
  // get feedback
  router.get('/feedback', feedbackController.getFeedback);
  // create feedback
  router.post('/feedback', verifyToken, checkRole(['Customer']), feedbackController.createFeedback);
  // update feedback data
  router.patch('/feedback', verifyToken, checkRole(['Customer']), feedbackController.updateFeedbackById);
  // delete feedback
  router.delete(
    '/feedback',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    feedbackController.deleteFeedbackById,
  );

  //_______cart item_______________________________________
  /// cart item
  // get
  router.get('/cartitem/:customer_id', cartItemController.getCartItemByCartId);
  // update
  router.patch('/cartitem', cartItemController.updateCartItemById);
  // delete
  router.delete('/cartitem', cartItemController.deleteCartItemById);
  // add
  router.post('/cartitem', cartItemController.addCartItem);

  //________order______________________________________
  // get
  router.get(
    '/orders/:customer_id?',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage', 'Customer']),
    orderController.getOrders,
  );
  router.get(
    '/order/:order_code',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage', 'Customer']),
    orderController.getOrderByOrderCode,
  );
  // // update
  router.patch('/order', verifyToken, orderController.updateOrderById);
  // // delete
  // router.delete('/order',    verifyToken, orderController.deleteOrderById);
  // add
  router.post(
    '/order',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage', 'Customer']),
    orderController.createNewOrder,
  );

  //________ table ______________________________________
  // get
  router.get('/table', verifyToken, tableController.getTable);
  // // update
  router.patch('/table', verifyToken, tableController.updateTable);
  // // delete
  router.delete('/table', verifyToken, tableController.deleteTable);
  // add
  router.post('/table', verifyToken, tableController.createTable);
  // import
  router.post(
    '/table/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    tableController.importTables,
  );

  //________ booking ______________________________________
  // get booking
  router.get('/booking', bookingController.getBooking);
  // create booking
  router.post(
    '/booking',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage', 'Customer']),
    bookingController.createNewBooking,
  );
  // update booking data
  router.patch(
    '/booking',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage', 'Customer']),
    bookingController.updateBooking,
  );

  // // import booking
  // router.post(
  //   '/booking/import',
  //   verifyToken,
  //   checkRole(['Root', 'Admin', 'UserManage']),
  //   upload.single('file'),
  //   bookingController.importMenus,
  // );

  //__________image____________________________________
  // upload image
  router.post('/upload', upload.single('image'), (req, res, next) => {
    const inputFile = req.file.buffer;
    const outputFile = 'uploads/' + req.file.originalname + '.png';
    sharp(inputFile)
      .resize(800, 600)
      .webp()
      .toFile(outputFile, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
        } else {
          res.status(200).json(req.file.originalname + '.png');
        }
      });
  });

  // upload image avartar
  router.post('/upload', upload.single('image'), (req, res, next) => {
    const inputFile = req.file.buffer;
    const outputFile = 'uploads/' + req.file.originalname + '.png';
    sharp(inputFile)
      .resize(500, 500)
      .webp()
      .toFile(outputFile, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
        } else {
          res.status(200).json(req.file.originalname + '.png');
        }
      });
  });

  // get image
  // API endpoint để truy cập hình ảnh
  router.get('/images/:filename', (req, res) => {
    // Khai báo đường dẫn tới thư mục chứa hình ảnh
    const imagePath = path.join(__dirname, '../../uploads');
    const { filename } = req.params;
    const filePath = path.join(imagePath, filename);
    res.sendFile(filePath);
  });

  //______________________________________________
  // Khởi chạy server
  app.listen(3001, () => {
    console.log('Server is running on port 3000');
  });

  return app.use('/v1/api', router);
};
