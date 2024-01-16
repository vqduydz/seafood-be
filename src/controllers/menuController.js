import dotenv from 'dotenv';
import path from 'path';
import { renameImg } from '../feature/renameImg';
import db from '../models';
const { Op } = require('sequelize');
const fs = require('fs');
const xlsx = require('xlsx');
dotenv.config();
const Menu = db.Menu;
const CartItem = db.CartItem;

const createMenu = async (req, res) => {
  try {
    const { name, slug, catalog, catalogSlug, price, unit, image, max_order } = req.body;
    const menu = await Menu.findOne({ where: { slug } });
    if (menu) {
      return res.status(200).json({ error: 'Menu already exists' });
    }
    await Menu.create({
      name,
      slug,
      catalog,
      catalogSlug,
      price,
      unit,
      image,
      max_order,
    });
    return res.status(200).json('Menu created successfully');
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
      return res.status(200).json({ error: 'Menu does not exist' });
    }
    const oldSlug = menu.slug;
    const oldImage = menu.image;
    const { id, ...data } = dataUpdate;
    const newSlug = data.slug;
    const imagePath = path.join(__dirname, '../../uploads', oldImage);
    await menu.set({ ...data, image: `${newSlug}.png` });
    await menu.save();

    if (!dataUpdate.image && oldSlug !== data.slug) {
      fs.access(imagePath, fs.constants.F_OK, async (err) => {
        if (err) {
          return res.status(200).json('Không có hình ảnh, menu updated successfully.');
        } else {
          const result = await renameImg(oldImage, `${newSlug}.png`);
          if (!result) {
            return res.status(200).json('Không thể đổi tên hình ảnh, menu updated successfully');
          }
          return res.status(200).json('imageName, menu updated successfully');
        }
      });
    } else if (dataUpdate.image && oldSlug !== data.slug) {
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(200).json('Không có hình cũ, menu updated successfully.');
        } else {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              return res.status(200).json('Không thể xóa hình ảnh, menu updated successfully');
            } else {
              return res.status(200).json('image, menu updated successfully');
            }
          });
        }
      });
    } else return res.status(200).json('image, menu updated successfully');
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
      return res.status(200).json({ error: 'Menu does not exist' });
    }

    const cartItems = await CartItem.findAll({
      where: { menu_id: id },
    });

    cartItems.forEach(async (cartItem) => {
      await cartItem.destroy();
    });

    const imagePath = path.join(__dirname, '../../uploads', menu.image);
    await menu.destroy();

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(200).json('Không có hình ảnh, xóa menu thành công.');
      } else {
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            return res.status(200).json('Không thể xóa hình ảnh, xóa menu thành công');
          } else {
            return res.status(200).json('Xóa hình ảnh, xóa menu thành công');
          }
        });
      }
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
