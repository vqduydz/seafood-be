import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import db, { sequelize } from '../models';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
const xlsx = require('xlsx');
dotenv.config();
const Feedback = db.Feedback;
const Menu = db.Menu;
const User = db.User;

const createFeedback = async (req, res) => {
  try {
    const { point, feedback_content, feedback_code, menu_id, customer_id } = req.body;
    // Tìm kiếm Menu trong database
    const feedback = await Feedback.findOne({ where: { feedback_code } });

    // Kiểm tra xem email của Feedback có tồn tại không
    if (feedback) {
      return res.status(422).json({ errorMessage: 'Feedback already exists' });
    }

    await Feedback.create({ point, feedback_content, feedback_code, menu_id, customer_id });

    return res.status(200).json({ message: 'Feedback created successfully' });
  } catch (error) {
    console.log('28----', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { feedback_code, menu_id } = req.query;
    if (feedback_code) {
      const feedback = await Feedback.findOne({ where: { feedback_code } });
      if (!feedback) return res.status(200).json({ feedbacked: false });
      return res.status(200).json({ feedbacked: true });
    }
    if (menu_id) {
      const feedbacks = await Feedback.findAll({ where: { menu_id }, order: [['id', 'DESC']] });
      if (!feedbacks) return res.status(200).json([]);
      // Lấy danh sách customer_id của các feedbacks
      const feedbacksUserID = feedbacks.map((feedback) => feedback.customer_id);

      const users = await User.findAll({
        where: { id: feedbacksUserID },
        order: [['id', 'ASC']],
        attributes: ['id', 'firstName', 'lastName', 'avatar'],
        raw: true,
      });

      const feedbacksWithUser = feedbacks.map((feedback) => {
        const feedbackUsers = users.filter((user) => user.id === feedback.customer_id);
        const data = { ...feedback.toJSON(), ...feedbackUsers[0] };
        return data;
      });

      return res.status(200).json([...feedbacksWithUser]);
    }
  } catch (error) {
    console.log('58----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateFeedbackById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const feedback = await Feedback.findOne({ where: { id: dataUpdate.id } });
    if (!feedback) {
      return res.status(404).json({ errorMessage: 'Feedback does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await feedback.set(data);
    await feedback.save();
    return res.status(200).json({ message: 'Feedback updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteFeedbackById = async (req, res) => {
  try {
    const { id } = req.body;
    const feedback = await Feedback.findOne({ where: { id } });
    if (!feedback) {
      return res.status(404).json({ errorMessage: 'Feedback does not exist' });
    }

    const imageNames = [feedback.image_url]; // Danh sách tên các file cần xóa được gửi trong body của request
    // Duyệt qua danh sách các tên file và xóa từng file
    let delIamgeNoti = [];
    imageNames.map((imageName) => {
      const imagePath = path.join(__dirname, '../../uploads', imageName);
      unlink(imagePath)
        .then(() => {
          delIamgeNoti.push(true);
        })
        .catch(() => {
          delIamgeNoti.push(false);
        });
    });
    await feedback.destroy();
    return res.status(200).json({
      message: delIamgeNoti
        ? 'images deleted, Feedback deleted successfully'
        : 'Failed to delete image, Feedback deleted successfully',
    });
  } catch (error) {
    console.log('107---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

export default { createFeedback, getFeedback, updateFeedbackById, deleteFeedbackById };
