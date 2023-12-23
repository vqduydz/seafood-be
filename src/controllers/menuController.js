import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import path from 'path';
import { renameImg } from '../feature/renameImg';
import db from '../models';
const { Op } = require('sequelize');
const fs = require('fs');
const xlsx = require('xlsx');
dotenv.config();
const Menu = db.Menu;

const createMenu = async (req, res) => {
  try {
    const { name, slug, catalog, catalogSlug, price, unit, image_url, desc } = req.body;
    const menu = await Menu.findOne({ where: { slug } });
    if (menu) {
      return res.status(422).json({ errorMessage: 'Menu already exists' });
    }
    await Menu.create({
      name,
      slug,
      catalog,
      catalogSlug,
      price,
      unit,
      image_url,
      desc,
    });
    return res.status(200).json({ message: 'Menu created successfully' });
  } catch (error) {
    console.log('37----,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const getMenu = async (req, res) => {
  try {
    const { name, slug, page, limit_per_page } = req.query;
    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';

    const allMenu = await Menu.findAll({ order: [['createdAt', 'DESC']] });

    if (slug) {
      const menu = await Menu.findOne({ where: { slug }, raw: true });
      if (!menu) {
        return res.status(404).json({ errorMessage: 'Menu does not exist' });
      }
      return res.status(200).json({ ...menu, imagePath });
    }

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

    if (name) {
      const menus = await Menu.findAndCountAll({
        where: {
          slug: {
            [Op.like]: `%${name}%`,
          },
        },
        limit,
        offset,
      });
      const totalCount = menus.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ menus: menus.rows, totalCount, totalPages, currentPage, imagePath, limit_per_page });
    }

    const menus = await Menu.findAndCountAll({ limit, offset });
    const totalCount = menus.count;
    const totalPages = Math.ceil(totalCount / limit);
    return res
      .status(200)
      .json({ allMenu, menus: menus.rows, totalCount, totalPages, currentPage, imagePath, limit_per_page });
  } catch (error) {
    console.log('71--', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateMenuById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const menu = await Menu.findOne({ where: { id: dataUpdate.id } });
    if (!menu) {
      return res.status(404).json({ errorMessage: 'Menu does not exist' });
    }
    const { id, ...data } = dataUpdate;
    if (menu.slug !== data.slug) {
      renameImg(menu.image_url, data.image_url).then(async (result) => {
        if (!result) {
          return res.status(500).json({ message: 'Error renaming' });
        }
        await menu.set(data);
        await menu.save();
        return res.status(200).json({ message: 'Menu updated successfully', menu });
      });
    } else {
      await menu.set(data);
      await menu.save();
      return res.status(200).json({ message: 'Menu updated successfully', menu });
    }
  } catch (error) {
    console.log('100---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteMenuById = async (req, res) => {
  try {
    const { id } = req.body;
    const menu = await Menu.findOne({ where: { id } });
    if (!menu) {
      return res.status(404).json({ errorMessage: 'Menu does not exist' });
    }
    const imagePath = path.join(__dirname, '../../uploads', menu.image_url);
    await unlink(imagePath);
    await menu.destroy();
    return res.status(200).json({
      message: 'images deleted, Menu deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importMenus = async (req, res) => {
  try {
    const file = req.file;
    // Kiểm tra nếu không có file hoặc file không đúng định dạng
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }
    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    // kiểm tra trùng dữ liệu
    const existingSlugs = await Menu.findAll({ attributes: ['slug'] });
    const existingSlugSet = new Set(existingSlugs.map((menu) => menu.slug));
    // lọc dữ liệu trùng lặp
    const newData = data.filter((row) => !existingSlugSet.has(row.slug));
    // Lưu vào database
    Menu.bulkCreate(newData)
      .then(() => {
        res.status(200).json({ message: 'Import successful' });
      })
      .catch((error) => {
        console.error('Import failed:', error);
        res.status(500).json({ error: 'Import failed' });
      });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data.' });
  }
};

export default { createMenu, getMenu, updateMenuById, deleteMenuById, importMenus };
