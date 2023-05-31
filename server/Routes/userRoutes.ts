import express from 'express';
import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getAllUsers,
  updateUser,
  deleteUser,
} from '@Controllers/userController';
import {
  signup,
  csrfToken,
  confirmEmail,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  logout,
  restrictTo,
  sendConfirmEmail,
} from '@Controllers/authController';
import {
  uploadUserPhoto,
  resizeUserPhoto,
  setImageToField,
} from '@Middlewares/uploadImage';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/csrfToken', csrfToken);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.post('/sendConfirmEmail', sendConfirmEmail);

// Protect all routes after this middelware. this routes is only for signed-in users.
router.use(protect);

router.post('/confirmEmail', confirmEmail);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

// Restrict all this routes to Admin only.
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(getUser)
  .patch(uploadUserPhoto, resizeUserPhoto, setImageToField, updateUser)
  .delete(deleteUser);

export default router;
