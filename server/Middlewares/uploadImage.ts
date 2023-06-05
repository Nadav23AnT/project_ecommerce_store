import sharp from 'sharp';
import { Request, RequestHandler } from 'express';
import multer, { FileFilterCallback } from 'multer';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';

// Stores the uploaded files in memory as Buffer objects.
const multerStorage = multer.memoryStorage();

// Check file type and determine whether it should be accepted or rejected.
const multerFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        '["image/jpg", "image/jpeg", "image/png"] התמונה לא בפורמט הנכון בחר תמונה בפורמט',
        400
      )
    );
  }
};

// Create a Multer instance
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');
export const uploadLogo = upload.single('logo');

export const resizeUserPhoto = catchAsync(async (req, _res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  const folderImage = req.baseUrl.slice(req.baseUrl.lastIndexOf('/') + 1);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${folderImage}/${req.file.filename}`);

  next();
});

export const setImageToField: RequestHandler = (req, res, next) => {
  if (req.file && !req.body.imageFieldName)
    return next(
      new AppError(`imageFieldName התמונה לא נשמרה מאחר שלא הוכנס שדה `, 403)
    );

  if (req.file) req.body[req.body.imageFieldName] = req.file?.filename;
  next();
};
