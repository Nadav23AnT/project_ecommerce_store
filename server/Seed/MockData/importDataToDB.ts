/* eslint-disable no-console */
import User from '@Models/userModel';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';

const connection = mongoose.connection;

dotenv.config();

const { DATABASE, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } =
  process.env;

const DB_CONNECTION_STRING = DATABASE.replace(
  '<DB_USERNAME>',
  DATABASE_USERNAME
)
  .replace('<DB_PASSWORD>', DATABASE_PASSWORD)
  .replace('<DB_NAME>', DATABASE_NAME);

// don't allow mongoose save fields that don't exist in model's schema
mongoose.set('strictQuery', true);
mongoose.connect(DB_CONNECTION_STRING, () => {
  console.log('DB connection successful!', '\x1b[0m');
});

connection.once('open', () => seedData());

// READ JSON FILES
const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importAllData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log('Data seeded in DB!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteAllData = async () => {
  try {
    await connection.dropDatabase();
    console.log('DB dropped!');
  } catch (err) {
    console.log(err);
  }
};

async function seedData() {
  if (process.argv[2] === '--import') {
    importAllData();
  } else if (process.argv[2] === '--delete') {
    deleteAllData();
  } else if (!process.argv[2]) {
    await deleteAllData();
    await importAllData();
  }

  process.exit();
}
