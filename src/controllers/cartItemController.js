import dotenv from 'dotenv';
import db from '../models';

dotenv.config();
const CartItem = db.CartItem;
const Menu = db.Menu;

const getCartItemByCustomerId = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const cartItems = await CartItem.findAll({
      where: { customer_id },
      attributes: ['id', 'customer_id', 'menu_id', 'quantity'],
      order: [['createdAt', 'ASC']],
      raw: true,
    });

    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';

    // Lấy danh sách slug của các cartItems
    const cartItem_menu_id = cartItems.map((cartItem) => cartItem.menu_id);

    // Lấy danh sách menu theo các slug của cartItems
    const menus = await Menu.findAll({
      where: {
        id: cartItem_menu_id,
      },
      raw: true,
      attributes: ['id', 'name', 'slug', 'catalog', 'catalogSlug', 'price', 'unit', 'image', 'max_order'],
      order: [['id', 'ASC']],
    });

    const cartItemsWithMenu = cartItems.map((cartItem) => {
      const catalogMenus = menus.filter((menu) => menu.id === cartItem.menu_id);
      const { image, ...catalogMenu } = catalogMenus[0];

      const cartItems = {
        id: cartItem.id,
        customer_id: cartItem.customer_id,
        menu_id: cartItem.menu_id,
        quantity: cartItem.quantity,
        name: catalogMenu.name,
        slug: catalogMenu.slug,
        catalog: catalogMenu.catalog,
        catalogSlug: catalogMenu.catalogSlug,
        price: catalogMenu.price,
        unit: catalogMenu.unit,
        max_order: catalogMenu.max_order,
        image: imagePath + image,
      };

      return { ...cartItems };
    });

    return res.status(200).json(cartItemsWithMenu);
  } catch (error) {
    console.log('19--error:', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateCartItemById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const cartItem = await CartItem.findOne({
      where: { id: dataUpdate.id },
    });
    if (!cartItem) {
      return res.status(404).json({ errorMessage: 'CartItem does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await cartItem.set(data);
    await cartItem.save();

    return res.status(200).json({ cartItem, message: 'CartItem updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteCartItemById = async (req, res) => {
  const { id } = req.body;
  try {
    const cartItem = await CartItem.findOne({
      where: { id },
    });
    if (!cartItem) {
      return res.status(404).json({ errorMessage: 'CartItem does not exist' });
    }
    await cartItem.destroy();
    return res.status(200).json({ cartItem, message: 'CartItem deleted successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const addCartItem = async (req, res) => {
  const { customer_id, menu_id, quantity } = req.body;
  try {
    const cartItem = await CartItem.findOne({
      where: { menu_id, customer_id },
    });
    if (cartItem) {
      return res.status(200).json({ error: 'CartItem already exists' });
    }
    await CartItem.create({
      customer_id,
      menu_id,
      quantity: quantity ? quantity : 1,
    });
    return res.status(200).json({ message: 'CartItem added successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { updateCartItemById, getCartItemByCustomerId, deleteCartItemById, addCartItem };
