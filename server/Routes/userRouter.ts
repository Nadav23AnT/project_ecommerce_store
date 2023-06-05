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

router
  .get('/csrfToken', csrfToken)
  .post('/signup', signup)
  .post('/login', login)
  .post('/forgotPassword', forgotPassword)
  .patch('/resetPassword/:token', resetPassword)
  .post('/sendConfirmEmail', sendConfirmEmail)

  .use(protect)
  // Protect all this routes after this middleware. this routes is only for signed-in users.
  .post('/confirmEmail', confirmEmail)
  .patch('/updateMyPassword', updatePassword)
  .get('/me', getMe, getUser)
  .patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete('/deleteMe', deleteMe)
  .get('/logout', logout)
  // Restrict all this routes to Admin only.
  .use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(getUser)
  .patch(uploadUserPhoto, resizeUserPhoto, setImageToField, updateUser)
  .delete(deleteUser);

export default router;
