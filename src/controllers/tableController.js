import dotenv from 'dotenv';
import db from '../models';
const { Op } = require('sequelize');
const xlsx = require('xlsx');
dotenv.config();
const Table = db.Table;

const createTable = async (req, res) => {
  try {
    const { name, style, available } = req.body;
    const table = await Table.findOne({ where: { name } });
    if (table) {
      return res.status(422).json({ errorMessage: 'Table already exists' });
    }
    await Table.create({
      name,
      style,
      available: available ? available : true,
    });
    return res.status(200).json({ message: 'Table created successfully' });
  } catch (error) {
    console.log('33___', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const getTable = async (req, res) => {
  try {
    const { name } = req.query;
    if (name) {
      const table = await Table.findOne({ where: { name } });
      return res.status(200).json({ table });
    }
    const tables = await Table.findAll({ raw: true, order: [['name', 'ASC']] });

    const tablesShortByType = tables.reduce((result, table) => {
      const existingGroup = result.find((group) => group.type === table.type);

      if (existingGroup) {
        existingGroup.tables.push(table);
      } else {
        result.push({
          type: table.type,
          tables: [table],
        });
      }
      return result;
    }, []);

    return res.status(200).json({ tablesShortByType });
  } catch (error) {
    console.log('63---,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateTable = async (req, res) => {
  try {
    const dataUpdate = req.body;
    const table = await Table.findOne({ where: { name: dataUpdate.name } });
    if (!table) {
      return res.status(404).json({ errorMessage: 'Table does not exist' });
    }
    await table.set(dataUpdate);
    await table.save();
    return res.status(200).json({ message: 'Table updated successfully' });
  } catch (error) {
    console.log('62---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { name } = req.body;
    const table = await Table.findOne({ where: { name } });
    if (!table) {
      return res.status(404).json({ errorMessage: 'Table does not exist' });
    }
    await table.destroy();
    return res.status(200).json({
      message: 'images deleted, Menu deleted successfully',
    });
  } catch (error) {
    console.log('113---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importTables = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const existingNames = await Table.findAll({ attributes: ['name'] });
    const existingNameSet = new Set(existingNames.map((table) => table.name));
    const newData = data.filter((row) => !existingNameSet.has(row.name));
    Table.bulkCreate(newData)
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

export default { createTable, getTable, updateTable, deleteTable, importTables };
