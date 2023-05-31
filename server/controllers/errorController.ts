import { Response, ErrorRequestHandler } from 'express';
import { MongoError } from 'mongodb';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: any) => {
  const message = `הוזן ערך לא חוקי ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `ערך השדה: ${value}. שהוזן כפול, הזן ערך ערך!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el) => (el as any).message);
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

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'משהו השתשבש, נסה שוב מאוחר יותר',
  });
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // TODO: fix error types in err parameter
  if (process.env.NODE_ENV === 'development') {
    if (err.name === 'PayloadTooLargeError')
      err.message = 'כמות המידע שהוזנה גדולה מדי';

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: Error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (((error as MongoError).code as string | number) === 11000)
      error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'invalid csrf token') error = handleBadCSRFToken();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
