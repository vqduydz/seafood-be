import dotenv from 'dotenv';
import db, { sequelize } from '../models';

dotenv.config();
const Cart = db.Cart;
const CartItem = db.CartItem;
const Menu = db.Menu;

const getCart = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const cart = await Cart.findOne({
      where: { customer_id },
      include: {
        model: CartItem,
        include: {
          model: Menu,
          // where: sequelize.where(sequelize.col('CartItem.menu_id'), sequelize.col('id')),
          attributes: ['name', 'price', 'image'], // lấy các thuộc tính name và price của food
        },

        where: sequelize.where(sequelize.col('Cart.id'), sequelize.col('cart_id')),
        attributes: ['id', 'cart_id', 'menu_id', 'quantity'],
        order: [['createdAt', 'ASC']],
      },
      order: [['createdAt', 'ASC']],
    });

    return res.status(200).json({ cart });
  } catch (error) {
    console.log('32----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};
export default { getCart };
