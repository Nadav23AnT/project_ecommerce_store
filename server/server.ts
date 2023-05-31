import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// catch errors in program
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// dotenv.config({ path: './.env.dev' });
dotenv.config();

const {
  NODE_ENV,
  PORT_DEV,
  PORT_PROD,
  DATABASE,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

let DB_CONNECTION_STRING = '';
if (DATABASE && DATABASE_USERNAME && DATABASE_PASSWORD && DATABASE_NAME) {
  DB_CONNECTION_STRING = DATABASE.replace('<DB_USERNAME>', DATABASE_USERNAME)
    .replace('<DB_PASSWORD>', DATABASE_PASSWORD)
    .replace('<DB_NAME>', DATABASE_NAME);
}

// dont allow mongoose save fields that don't exist in model's schema
mongoose.set('strictQuery', true);

mongoose.connect(DB_CONNECTION_STRING, () =>
  console.log('DB connection successful!', '\x1b[0m')
);

const port = NODE_ENV === 'development' ? PORT_DEV : PORT_PROD;

const server = app.listen(port, () => {
  console.log('\x1b[32m', `App running on port ${port}...`);
  console.log(`NODE_ENV: ${NODE_ENV}`);
});

// catch async errors
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err, err.name, err.message);
  // easy close the server
  server.close(() => {
    process.exit(1);
  });
});
