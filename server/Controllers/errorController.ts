import { Response, ErrorRequestHandler } from 'express';
import AppError from '@Utils/AppError';
import mongoose, { CastError } from 'mongoose';

const handleCastErrorDB = (err: CastError) => {
  const message = `הוזן ערך לא חוקי ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: AppError) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `ערך השדה: ${value}. שהוזן כפול, הזן ערך ערך!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `המידע שהוזן לא תקין. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('פרטי ההזדהות שגויים, יש להתחבר מחדש!', 401);

const handleJWTExpiredError = () =>
  new AppError('פרטי ההזדהות אינם בתוקף, יש להתחבר מחדש', 401);

const handleBadCSRFToken = () =>
  new AppError(
    'חסר לך טוקן CSRF! נסה לטעון מחדש את האפליקציה או לנסות להתחבר מחדש מאוחר יותר',
    403
  );

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'משהו השתשבש, נסה שוב מאוחר יותר',
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // TODO: fix error types in err parameter
  const isDevError = process.env.NODE_ENV === 'development';
  const isProdError = process.env.NODE_ENV === 'production';

  if (isDevError) {
    if (err.name === 'PayloadTooLargeError')
      error.message = 'כמות המידע שהוזנה גדולה מדי';
    if (!(error instanceof AppError))
      error = new AppError(error.message, error.code || 500);

    sendErrorDev(err, res);
  } else if (isProdError) {
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error instanceof mongoose.Error.ValidationError ||
      error.name === 'ValidationError'
    )
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'invalid csrf token') error = handleBadCSRFToken();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
