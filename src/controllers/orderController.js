import dotenv from 'dotenv';
import db from '../models';
const { Op } = require('sequelize');

dotenv.config();
const Order = db.Order;
const User = db.User;

const createNewOrder = async (req, res) => {
  try {
    const { order_code } = req.body;
    const order = await Order.findOne({
      where: { order_code },
    });

    if (order) {
      return res.status(442).json({ errorMessage: 'Order already exists' });
    }

    await Order.create(req.body);
    return res.status(200).json({ message: 'Order added successfully' });
  } catch (error) {
    console.log('112---', error);
    return res.status(500).json({ errorMessage: 'Server error', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const { customer_id, order_code, status, page, limit_per_page } = req.query;

    let currentPage = 1,
      limit,
      offset;

    if (limit_per_page) {
      limit = Number(limit_per_page);
    } else {
      limit = 20;
    }
    if (page) {
      currentPage = page;
      offset = (currentPage - 1) * limit;
    } else {
      offset = 0;
    }

    if (customer_id) {
      const orders = await Order.findAndCountAll({
        limit,
        offset,
        where: { customer_id },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = orders.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res.status(200).json({ orders: orders.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    const allOrder = await Order.findAll({ order: [['createdAt', 'DESC']] });
    if (order_code && !status) {
      const orders = await Order.findAndCountAll({
        limit,
        offset,
        where: {
          order_code: {
            [Op.like]: `%${order_code}%`,
          },
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = orders.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allOrder, orders: orders.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (order_code && status) {
      const orders = await Order.findAndCountAll({
        limit,
        offset,
        where: {
          status,
          order_code: {
            [Op.like]: `%${order_code}%`,
          },
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = orders.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allOrder, orders: orders.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (!order_code && status) {
      const orders = await Order.findAndCountAll({
        limit,
        offset,
        where: {
          status,
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = orders.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allOrder, orders: orders.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (!order_code && !status) {
      const orders = await Order.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
      const totalCount = orders.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allOrder, orders: orders.rows, totalCount, totalPages, currentPage, limit_per_page });
    }
  } catch (error) {
    console.log('58---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const getOrderByOrderCode = async (req, res) => {
  try {
    const { order_code } = req.params;
    const order = await Order.findOne({
      where: { order_code },
      raw: true,
    });

    let deliver = {},
      handler = {};
    if (order) {
      const { deliver_id, handler_id } = order;
      handler = await User.findOne({
        where: { id: handler_id },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'phoneNumber'],
        raw: true,
      });
      deliver = await User.findOne({
        where: { id: deliver_id },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'phoneNumber'],
        raw: true,
      });
    }

    return res.status(200).json({ ...order, deliver, handler });
  } catch (error) {
    console.log('78----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateOrderById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const order = await Order.findOne({ where: { order_code: dataUpdate.order_code } });
    if (!order) {
      return res.status(404).json({ errorMessage: 'Order does not exist' });
    }
    const { id, order_code, ...data } = dataUpdate;
    await order.set(data);
    await order.save();
    return res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { createNewOrder, getOrders, getOrderByOrderCode, updateOrderById };
