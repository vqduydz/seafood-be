import dotenv from 'dotenv';
import db from '../models';
const { Op } = require('sequelize');

dotenv.config();
const Booking = db.Booking;

const createNewBooking = async (req, res) => {
  try {
    const { booking_code } = req.body;

    const booking = await Booking.findOne({ where: { booking_code } });

    if (booking) {
      return res.status(442).json({ errorMessage: 'Booking already exists' });
    }

    await Booking.create(req.body);
    return res.status(200).json({ message: 'Booking added successfully' });
  } catch (error) {
    console.log('21---', error);
    return res.status(500).json({ errorMessage: 'Server error', error });
  }
};

const getBooking = async (req, res) => {
  try {
    const { customer_id, booking_code, status, page, limit_per_page } = req.query;
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
      const bookings = await Booking.findAndCountAll({
        limit,
        offset,
        where: { customer_id },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = bookings.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res.status(200).json({ bookings: bookings.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    const allBooking = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    if (booking_code && !status) {
      const bookings = await Booking.findAndCountAll({
        limit,
        offset,
        where: {
          booking_code: {
            [Op.like]: `%${booking_code}%`,
          },
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = bookings.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allBooking, bookings: bookings.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (booking_code && status) {
      const bookings = await Booking.findAndCountAll({
        limit,
        offset,
        where: {
          status,
          booking_code: {
            [Op.like]: `%${booking_code}%`,
          },
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = bookings.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allBooking, bookings: bookings.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (!booking_code && status) {
      const bookings = await Booking.findAndCountAll({
        limit,
        offset,
        where: {
          status,
        },
        order: [['createdAt', 'DESC']],
      });
      const totalCount = bookings.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allBooking, bookings: bookings.rows, totalCount, totalPages, currentPage, limit_per_page });
    }

    if (!booking_code && !status) {
      const bookings = await Booking.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
      const totalCount = bookings.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ allBooking, bookings: bookings.rows, totalCount, totalPages, currentPage, limit_per_page });
    }
  } catch (error) {
    console.log('58---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateBooking = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const booking = await Booking.findOne({ where: { booking_code: dataUpdate.booking_code } });
    if (!booking) {
      return res.status(404).json({ errorMessage: 'Booking does not exist' });
    }
    const { id, booking_code, ...data } = dataUpdate;
    await booking.set(data);
    await booking.save();
    return res.status(200).json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.log('137-- error --', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { createNewBooking, getBooking, updateBooking };
