import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
const fs = require('fs');
import path from 'path';
import { renameImg } from '../feature/renameImg';
import db from '../models';
const { Op } = require('sequelize');
const xlsx = require('xlsx');
dotenv.config();
const Catalog = db.Catalog;
const Menu = db.Menu;

const createCatalog = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const catalog = await Catalog.findOne({ where: { slug } });
    if (catalog) {
      return res.status(200).json({ error: 'Catalog already exists' });
    }
    await Catalog.create({
      name,
      slug,
      image,
    });
    return res.status(200).json('Catalog created successfully');
  } catch (error) {
    console.log('33___', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const getCatalog = async (req, res) => {
  try {
    const { name, page, limit_per_page } = req.query;
    const allCatalog = await Catalog.findAll({ order: [['createdAt', 'DESC']] });
    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
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
      const catalogs = await Catalog.findAndCountAll({
        where: {
          slug: {
            [Op.like]: `%${name}%`,
          },
        },
        limit,
        offset,
      });
      const totalCount = catalogs.count;
      const totalPages = Math.ceil(totalCount / limit);
      return res
        .status(200)
        .json({ catalogs: catalogs.rows, totalCount, totalPages, currentPage, imagePath, limit_per_page });
    }

    const catalogs = await Catalog.findAndCountAll({ limit, offset, order: [['id', 'ASC']] });
    const totalCount = catalogs.count;
    const totalPages = Math.ceil(totalCount / limit);
    const catalogSlugs = allCatalog.map((catalog) => catalog.slug);
    const menus = await Menu.findAll({
      where: {
        catalogSlug: catalogSlugs,
      },
      order: [['id', 'ASC']],
    });
    const catalogsWithMenus = allCatalog.map((catalog) => {
      const catalogMenus = menus.filter((menu) => menu.catalogSlug === catalog.slug);
      return { ...catalog.toJSON(), menus: catalogMenus };
    });

    return res.status(200).json({
      catalogsWithMenus,
      catalogs: catalogs.rows,
      totalCount,
      totalPages,
      currentPage,
      imagePath,
      limit_per_page,
    });
  } catch (error) {
    console.log('63---,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateCatalogById = async (req, res) => {
  try {
    const dataUpdate = req.body;
    const catalog = await Catalog.findOne({ where: { id: dataUpdate.id } });
    if (!catalog) {
      return res.status(404).json({ errorMessage: 'Catalog does not exist' });
    }

    console.log(107, dataUpdate);
    const { id, ...data } = dataUpdate;
    if (dataUpdate.name !== catalog.name) {
      const menus = await Menu.findAll({ where: { catalog: catalog.name } });
      menus.forEach(async (m) => {
        const { id, data } = m;
        const menu = await Menu.findOne({ where: { id } });
        const newMenuData = { ...data, catalog: dataUpdate.name, catalogSlug: dataUpdate.slug };
        await menu.set(newMenuData);
        await menu.save();
      });
      if (dataUpdate.image) {
        const result = await renameImg(catalog.image, dataUpdate.image);
        if (!result) {
          return res.status(200).json({ error: 'Error renaming' });
        }
        await catalog.set(data);
        await catalog.save();
        return res.status(200).json('images updated, Catalog updated successfully');
      }

      await catalog.set(data);
      await catalog.save();
      return res.status(200).json('Catalog updated successfully');
    } else {
      await catalog.set(data);
      await catalog.save();
      return res.status(200).json('Catalog updated successfully');
    }
  } catch (error) {
    console.log(131, error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteCatalogById = async (req, res) => {
  try {
    const { id } = req.body;
    const catalog = await Catalog.findOne({ where: { id } });
    if (!catalog) {
      return res.status(200).json({ error: 'Catalog does not exist' });
    }
    const imagePath = path.join(__dirname, '../../uploads', catalog.image);
    await catalog.destroy();

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(200).json('Không có hình ảnh, xóa catalog thành công.');
      } else {
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            return res.status(200).json('Không thể xóa hình ảnh, xóa catalog thành công');
          } else {
            return res.status(200).json('Xóa hình ảnh, xóa catalog thành công');
          }
        });
      }
    });
  } catch (error) {
    console.log('113---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importCatalogs = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const existingSlugs = await Catalog.findAll({ attributes: ['slug'] });
    const existingSlugSet = new Set(existingSlugs.map((catalog) => catalog.slug));
    const newData = data.filter((row) => !existingSlugSet.has(row.slug));
    Catalog.bulkCreate(newData)
      .then(() => {
        res.status(200).json('Import successful');
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

export default { createCatalog, getCatalog, updateCatalogById, deleteCatalogById, importCatalogs };
